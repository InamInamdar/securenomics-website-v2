import { Injectable, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface OnViewConfig {
    animationClass: string;
    delay?: string;
    duration?: string;
    repeat?: boolean;
    threshold?: number;
}

@Injectable({
    providedIn: 'root'
})
export class OnViewService {
    private observer: IntersectionObserver | null = null;
    private elements = new Map<Element, { config: OnViewConfig; callback: (isVisible: boolean) => void }>();

    constructor(
        private ngZone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    private getObserver(threshold: number = 0.1): IntersectionObserver | null {
        if (!this.isBrowser()) return null;
        if (this.observer) return this.observer;

        this.observer = new IntersectionObserver(
            (entries) => {
                this.ngZone.run(() => {
                    entries.forEach((entry) => {
                        const data = this.elements.get(entry.target);
                        if (data) {
                            if (entry.isIntersecting) {
                                data.callback(true);
                                if (!data.config.repeat) {
                                    this.unobserve(entry.target);
                                }
                            } else if (data.config.repeat) {
                                data.callback(false);
                            }
                        }
                    });
                });
            },
            { threshold }
        );

        return this.observer;
    }

    observe(element: Element, config: OnViewConfig, callback: (isVisible: boolean) => void) {
        this.elements.set(element, { config, callback });
        const observer = this.getObserver(config.threshold);
        if (observer) {
            observer.observe(element);
        } else {
            // If SSR or no observer, trigger callback immediately or as needed
            // For now, let's just trigger it so content is visible
            callback(true);
        }
    }

    unobserve(element: Element) {
        if (this.observer) {
            this.observer.unobserve(element);
        }
        this.elements.delete(element);
    }
}
