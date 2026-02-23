import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';

@Component({
    selector: 'app-mission-section',
    standalone: true,
    imports: [AnimateOnScrollDirective],
    templateUrl: './mission-section.html',
    styleUrl: './mission-section.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionSection {
    readonly missionHighlights = signal([
        {
            title: 'Precision Enablement',
            description: 'Custom training and localized playbooks that drive real-world adoption.',
            icon: 'target'
        },
        {
            title: 'Route to Market',
            description: 'Strategic distribution networks connecting world-class vendors with the right partners.',
            icon: 'route'
        },
        {
            title: 'Success Lifecycle',
            description: 'Ongoing support and optimization ensuring long-term value for every stakeholder.',
            icon: 'shield'
        }
    ]);
}
