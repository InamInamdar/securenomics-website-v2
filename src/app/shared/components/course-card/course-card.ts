import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-[6px] border border-[#f1f5f9] h-full">
      <!-- Card Header: Dark gradient with logo -->
      <div 
        class="relative h-40 flex items-center justify-center p-8 bg-gradient-to-br"
        [ngClass]="bannerGradient || 'from-slate-50 to-white'"
      >
        <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img 
          [src]="vendorLogo" 
          [alt]="vendor" 
          class="max-h-16 w-auto max-w-[80%] object-contain relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
        />
        
        <!-- Date Badge -->
        <div class="absolute top-4 left-4 bg-slate-100 text-slate-500 border border-slate-300 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
          {{ date }}
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-6 flex flex-col flex-grow">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            {{ category }}
          </span>
          <div class="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ region }}
          </div>
        </div>

        <h3 class="text-lg font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {{ title }}
        </h3>
        
        <p class="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
          {{ description }}
        </p>

        <div class="flex items-center justify-between mt-auto border-t border-slate-50 pt-4">
          <a [routerLink]="scheduleId ? ['/learn', scheduleId] : null" class="inline-flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400 group/link hover:text-blue-600 transition-colors">
            Details
            <svg class="w-3 h-3 ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CourseCardComponent {
  @Input() title: string = '';
  @Input() vendor: string = '';
  @Input() vendorLogo: string = '';
  @Input() category: string = '';
  @Input() description: string = '';
  @Input() region: string = '';
  @Input() date: string = '';
  @Input() deliveryModes: string[] = [];
  @Input() bannerGradient: string = '';
  @Input() scheduleId: number | null = null;
}
