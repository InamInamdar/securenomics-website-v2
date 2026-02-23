import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Inject,
    PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
import { StrategicPartner } from '../../../shared/models';

@Component({
    selector: 'app-hero-section',
    standalone: true,
    imports: [AnimateOnScrollDirective],
    templateUrl: './hero-section.html',
    styleUrl: './hero-section.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSection implements AfterViewInit {
    @ViewChild('heroVideo') videoElement!: ElementRef<HTMLVideoElement>;

    readonly strategicPartners = signal<StrategicPartner[]>([
        {
            id: 1,
            name: 'Netskope',
            subtitle: 'Cloud security leader',
            highlight: 'Secure access service edge'
        },
        {
            id: 2,
            name: 'Cisco Security',
            subtitle: 'Trusted enterprise defense',
            highlight: 'Zero trust protection'
        }
    ]);

    readonly partnerCount = computed(() => this.strategicPartners().length);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.playVideo();
        }
    }

    private playVideo() {
        const video = this.videoElement?.nativeElement;
        if (video) {
            // Force mute again to satisfy browsers
            video.muted = true;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Video autoplay failed:', error);
                    // This often happens if the user hasn't interacted with the page yet.
                    // But with 'muted', it should work.
                });
            }
        }
    }
}
