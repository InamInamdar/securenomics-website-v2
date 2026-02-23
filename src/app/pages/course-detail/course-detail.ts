import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { CourseDetailService } from './course-detail.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, Header, Footer],
    templateUrl: './course-detail.html',
    styleUrl: './course-detail.css'
})
export class CourseDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private sanitizer = inject(DomSanitizer);
    private courseDetailService = inject(CourseDetailService);

    schedule = signal<any>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.error.set('Invalid course ID.');
            this.loading.set(false);
            return;
        }
        this.courseDetailService.getSchedule(id).pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: (data) => this.schedule.set(data),
            error: () => this.error.set('Failed to load course details. Please try again later.')
        });
    }

    get safeDescription(): SafeHtml {
        const desc = this.schedule()?.course?.description || '';
        return this.sanitizer.bypassSecurityTrustHtml(desc);
    }

    formatDate(dateString: string, timezone?: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const tz = timezone || 'America/New_York';
        try {
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZone: tz,
                timeZoneName: 'short'
            }).format(date);
        } catch {
            return date.toLocaleString();
        }
    }

    getStatusClass(status: string): string {
        switch ((status || '').toLowerCase()) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    }

    mapRegion(code: string): string {
        const mapping: Record<string, string> = {
            NAM: 'North America',
            EMEA: 'Europe / Middle East / Africa',
            APAC: 'Asia Pacific',
            Global: 'Global'
        };
        return mapping[code] || code;
    }
}
