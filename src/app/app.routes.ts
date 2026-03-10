import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.LandingComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.ServicesComponent)
  },
  {
    path: 'learn',
    loadComponent: () => import('./pages/learn/learn').then((m) => m.LearnComponent)
  },
  {
    path: 'learn/:id',
    loadComponent: () => import('./pages/course-detail/course-detail').then((m) => m.CourseDetailComponent)
  },
  {
    path: 'pov-request',
    loadComponent: () => import('./pages/pov-request/pov-request').then((m) => m.PovRequestComponent)
  }
];
