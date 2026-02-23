import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
import { Benefit } from '../../../shared/models';

@Component({
    selector: 'app-why-choose-us-section',
    standalone: true,
    imports: [AnimateOnScrollDirective],
    templateUrl: './why-choose-us-section.html',
    styleUrl: './why-choose-us-section.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhyChooseUsSection {
    readonly benefits = signal<Benefit[]>([
        { id: 1, label: 'Vast Mid-Market Reach' },
        { id: 2, label: 'Strong Vendor Alignment' },
        { id: 3, label: 'Streamlined Procurement' },
        { id: 4, label: 'Faster Adoption & Deployment' },
        { id: 5, label: 'Ongoing Value Creation' }
    ]);
}
