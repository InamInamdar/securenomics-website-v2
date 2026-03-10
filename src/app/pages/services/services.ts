import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    AfterViewInit,
    Inject,
    PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [CommonModule, Header, Footer, AnimateOnScrollDirective, RouterLink],
    templateUrl: './services.html',
    styleUrl: './services.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements AfterViewInit {
    @ViewChild('heroVideo') videoElement!: ElementRef<HTMLVideoElement>;

    journeySteps = [
        {
            number: '01',
            icon: 'pi pi-book',
            image: 'assets/seed_img.jpg',
            title: 'Learn',
            description: 'Understand Modern Security Technologies.',
            targetId: 'learn',
            delay: '100ms'
        },
        {
            number: '02',
            icon: 'pi pi-verified',
            image: 'assets/rapid-pov.jpg',
            title: 'Prove',
            description: 'Validate Value with Rapid Proof of Value.',
            targetId: 'prove',
            delay: '200ms'
        },
        {
            number: '03',
            icon: 'pi pi-send',
            image: 'assets/service_img.jpg',
            title: 'Deploy',
            description: 'Accelerate Deployment and Adoption.',
            targetId: 'deploy',
            delay: '300ms'
        },
        {
            number: '04',
            icon: 'pi pi-chart-line',
            image: 'assets/comanage_success.jpg',
            title: 'Optimize',
            description: 'Maximize Long-Term Security Outcomes.',
            targetId: 'optimize',
            delay: '400ms'
        }
    ];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.playVideo();
        }
    }

    scrollToSection(targetId: string) {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    private playVideo() {
        const video = this.videoElement?.nativeElement;
        if (video) {
            // Force mute to satisfy browser autoplay policies
            video.muted = true;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Services video autoplay failed:', error);
                });
            }
        }
    }
}
