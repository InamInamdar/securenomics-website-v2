import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../shared/directives/animate-on-scroll.directive';
export interface FaqItem {
    question: string;
    answer: string;
}

@Component({
    selector: 'app-faq-section',
    standalone: true,
    imports: [CommonModule, AnimateOnScrollDirective],
    templateUrl: './faq-section.html',
    styleUrl: './faq-section.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqSection {
    readonly faqs = signal<FaqItem[]>([
        {
            question: 'Why should partners trust Securenomics with their growth strategy?',
            answer: 'We focus exclusively on security enablement, vendor alignment, and long-term value creation — helping partners grow predictably and sustainably.'
        },
        {
            question: 'How does Securenomics help partners grow their cybersecurity business?',
            answer: 'Securenomics accelerates growth through market enablement, rapid implementation, cloud-delivered services, and continuous operational support, helping partners close deals faster and maximize long-term customer value.'
        },
        {
            question: 'How does Securenomics ensure customer data security and compliance?',
            answer: 'We work with industry-leading security platforms and follow best practices to ensure secure deployments, regulatory alignment, and continuous protection across cloud and network environments.'
        },
        {
            question: 'Is Securenomics only for large enterprises?',
            answer: 'No. We specialize in helping partners serve the mid-market and growing organizations with scalable, cloud-first security solutions tailored to business size and complexity.'
        },
        {
            question: 'Will partnering with Securenomics increase operational costs?',
            answer: 'No. Our model helps reduce internal overhead by providing expert enablement, deployment support, and ongoing optimization without requiring large in-house security teams.'
        },
        {
            question: 'Do partners need deep technical expertise to work with Securenomics?',
            answer: 'No. We provide technical enablement, guidance, and deployment assistance to support partners at every stage of their security journey.'
        }
    ]);

    readonly activeIndex = signal<number | null>(null);

    toggleItem(index: number): void {
        if (this.activeIndex() === index) {
            this.activeIndex.set(null);
        } else {
            this.activeIndex.set(index);
        }
    }
}
