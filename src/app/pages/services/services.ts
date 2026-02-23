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

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.playVideo();
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
