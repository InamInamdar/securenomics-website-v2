import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { OnViewService, OnViewConfig } from '../services/on-view.service';

@Directive({
    selector: '[appAnimateOnScroll]',
    standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
    @Input('appAnimateOnScroll') animationClass: string = 'animate__fadeInUp';
    @Input() animationDelay: string = '0ms';
    @Input() animationDuration: string = '0.6s';
    @Input() repeat: boolean = false;
    @Input() threshold: number = 0.1;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private onViewService: OnViewService
    ) { }

    ngOnInit() {
        // Initial state: invisible and prepare animate.css base class
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.addClass(this.el.nativeElement, 'animate__animated');

        const config: OnViewConfig = {
            animationClass: this.animationClass,
            delay: this.animationDelay,
            duration: this.animationDuration,
            repeat: this.repeat,
            threshold: this.threshold
        };

        this.onViewService.observe(this.el.nativeElement, config, (isVisible) => {
            if (isVisible) {
                this.applyAnimation();
            } else if (this.repeat) {
                this.resetAnimation();
            }
        });
    }

    private applyAnimation() {
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation-delay', this.animationDelay);
        this.renderer.setStyle(this.el.nativeElement, 'animation-duration', this.animationDuration);
        this.renderer.addClass(this.el.nativeElement, this.animationClass);
    }

    private resetAnimation() {
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.removeClass(this.el.nativeElement, this.animationClass);
    }

    ngOnDestroy() {
        this.onViewService.unobserve(this.el.nativeElement);
    }
}
