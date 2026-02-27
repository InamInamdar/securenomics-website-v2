import { ChangeDetectionStrategy, Component, computed, signal, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { HeroSection } from "../../features/sections/hero-section/hero-section";
import { WhyChooseUsSection } from "../../features/sections/why-choose-us-section/why-choose-us-section";
import { MissionSection } from "../../features/sections/mission-section/mission-section";
import { FaqSection } from "../../features/sections/faq-section/faq-section";
import { TrustedPartner } from '../../shared/models';
import { SeoService } from '../../shared/services/seo.service';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    Header,
    Footer,
    HeroSection,
    WhyChooseUsSection,
    MissionSection,
    FaqSection
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  constructor(private seo: SeoService) { }

  ngOnInit() {
    this.seo.updateSeo(
      'Securenomics | Security Growth Distribution',
      'Securenomics accelerates routes to market for Netskope and Cisco Security.'
    );
  }
  readonly partners = signal<TrustedPartner[]>([
    { name: 'Netskope', logo: 'assets/partners/netskope.png' },
    { name: 'Cisco', logo: 'assets/partners/cisco.png' },
    { name: 'Cyberhaven', logo: 'assets/partners/cyberhaven%20copy.svg' },
    { name: 'Cato', logo: 'assets/partners/cato3.svg' }
  ]);

  readonly marqueePartners = computed(() => [
    ...this.partners(),
    ...this.partners(),
    ...this.partners()
  ]);
}
