import { Component, computed, signal, AfterViewInit, ViewChildren, QueryList, ElementRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CourseCardComponent } from '../../shared/components/course-card/course-card';
import { LearnService } from './learn.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Header,
    Footer,
    CourseCardComponent,
    PaginatorModule,
    SelectModule
  ],
  templateUrl: './learn.html',
  styleUrl: './learn.css',
})
export class LearnComponent implements AfterViewInit {
  private learnService = inject(LearnService);

  schedules = signal<any[]>([]);
  totalSchedules = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  // Track whether this is the very first load so we don't scroll to grid on page entry
  private isInitialLoad = true;

  // Pagination
  skip = signal(0);
  take = signal(9);

  categories = ['All', 'Workshops', 'Cato Networks', 'Netskope', 'Cisco', 'Cyberhaven'];
  activeCategory = signal('All');
  underlineStyle = signal({ left: '0px', width: '0px' });

  @ViewChildren('categoryBtn') categoryBtns!: QueryList<ElementRef>;

  searchQuery = signal('');
  activeTechnologies = signal<string[]>([]);
  activeDeliveryModes = signal<string[]>([]);
  activeRegion = signal<string>('');

  regions = [
    { label: 'All Regions', value: '' },
    { label: 'North America (NAM)', value: 'NAM' },
    { label: 'Europe/Middle East (EMEA)', value: 'EMEA' },
    { label: 'Asia Pacific (APAC)', value: 'APAC' }
  ];

  // Remove mock filters that were computed
  filteredCourses = computed(() => {
    const start = this.skip();
    const end = start + this.take();

    return this.schedules()
      .slice(start, end)
      .map(item => ({
        scheduleId: item.id,
        title: item.course?.title,
        vendor: item.course?.category?.organization?.name,
        description: item.course?.description || '',
        category: item.course?.category?.trainingType,
        region: this.mapRegion(item.region),
        date: this.formatDate(item.startDate),
        deliveryMode: [item.course?.category?.trainingType],
        vendorLogo: this.resolveVendorLogo(item.course?.category?.organization?.name),
        bannerGradient: 'from-slate-50 to-white'
      }));
  });

  scrollToCourses() {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  resolveVendorLogo(vendorName: string): string {
    if (!vendorName) return '/assets/partners/placeholder.png';
    const name = vendorName.toLowerCase().replace(/\s+/g, '-');

    // Specific mapping based on actual files in /assets/partners/
    const specificMapping: { [key: string]: string } = {
      'cato-networks': 'cato3.svg',
      'cisco': 'cisco.png',
      'cyberhaven': 'cyberhaven copy.svg',
      'netskope': 'netskope.png'
    };

    const fileName = specificMapping[name] || `${name}.png`;
    return `/assets/partners/${fileName}`;
  }

  // allTechnologies = computed(() => {
  //   const techs = new Set<string>();
  //   this.schedules().forEach(c => c.course?.technology?.forEach((t: string) => techs.add(t)));
  //   return Array.from(techs);
  // });

  toggleFilter(type: 'deliveryMode' | 'technology', value: string) {
    if (type === 'deliveryMode') {
      const current = this.activeDeliveryModes();
      const idx = current.indexOf(value);
      if (idx > -1) {
        this.activeDeliveryModes.set(current.filter(m => m !== value));
      } else {
        this.activeDeliveryModes.set([...current, value]);
      }
    } else {
      const current = this.activeTechnologies();
      const idx = current.indexOf(value);
      if (idx > -1) {
        this.activeTechnologies.set(current.filter(t => t !== value));
      } else {
        this.activeTechnologies.set([...current, value]);
      }
    }
    this.skip.set(0); // Reset skip when filters change
  }

  onRegionChange(event: any) {
    this.activeRegion.set(event.value);
    this.skip.set(0); // Reset to first page
  }

  constructor() {
    effect((onCleanup) => {
      // Fetch only when these filter signals change
      this.activeCategory();
      this.activeRegion();
      this.activeDeliveryModes();
      this.searchQuery();

      const sub = this.fetchSchedules();
      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(event: any) {
    this.skip.set(event.first);
    this.take.set(event.rows);
    this.scrollToGrid(); // Scroll on page change too
  }

  fetchSchedules() {
    this.loading.set(true);
    this.error.set(null);

    const category = this.activeCategory();
    let trainingType = '';
    let vendor = '';

    if (category === 'Workshops') trainingType = 'Workshop';
    // else if (category === 'Certification') trainingType = 'Certification';
    else if (['Cato Networks', 'Netskope', 'Cisco', 'Cyberhaven'].includes(category)) {
      vendor = category;
    }

    // Always fetch a large pool to allow client-side windowing/vendor filtering
    return this.learnService.getSchedules({
      skip: 0,
      take: 1000,
      search: this.searchQuery(),
      region: this.activeRegion(),
      training_type: trainingType,
      order: 'asc',
      sortby: 'start_date'
    }).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res) => {
        let data = res.data;

        if (vendor) {
          // Client-side filter for vendors specifically
          data = data.filter((item: any) =>
            item.course?.category?.organization?.name === vendor
          );
        }

        this.schedules.set(data);
        this.totalSchedules.set(data.length);

        // Only scroll to grid for filter / pagination changes, not the initial page load
        if (!this.isInitialLoad) {
          this.scrollToGrid();
        }
        this.isInitialLoad = false;
      },
      error: (err) => {
        this.error.set('Failed to load courses. Please try again later.');
        console.error('API Error:', err);
      }
    });
  }

  scrollToGrid() {
    setTimeout(() => {
      const el = document.getElementById('course-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  mapRegion(code: string): string {
    const mapping: { [key: string]: string } = {
      'NAM': 'North America',
      'EMEA': 'EMEA',
      'APAC': 'Asia Pacific',
      'Global': 'Global'
    };
    return mapping[code] || code;
  }

  ngAfterViewInit() {
    // Set initial underline position
    setTimeout(() => {
      const firstBtn = this.categoryBtns.first?.nativeElement;
      if (firstBtn) {
        this.updateUnderline(firstBtn);
      }
    }, 0);
  }

  selectCategory(category: string, event: MouseEvent) {
    this.activeCategory.set(category);
    this.skip.set(0); // Reset skip when category changes
    this.updateUnderline(event.currentTarget as HTMLElement);
  }

  updateUnderline(el: HTMLElement) {
    this.underlineStyle.set({
      left: `${el.offsetLeft}px`,
      width: `${el.offsetWidth}px`
    });
  }
}
