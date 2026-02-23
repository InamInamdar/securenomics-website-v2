import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

interface Stat {
  label: string;
  value: string;
  suffix: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [Header, Footer, AnimateOnScrollDirective],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly heroContent = signal({
    title: 'Accelerating the Growth of All Your Routes to Market',
    subtitle: 'Securenomics is a premier distributor of security services for Netskope and Cisco Security, providing vast mid-market reach through our partner ecosystem in North America.'
  });

  readonly missionContent = signal({
    main: 'We enable the success of our partners through our comprehensive approach, which encompasses market seeding and education, streamlined planning and adoption — with rapid POV and implementation services — and ongoing value creation with our Comanage 360 services. All capabilities are delivered in the cloud to help our partners seamlessly grow their business.',
    secondary: 'We work closely with Netskope and Cisco Security to drive awareness of the latest security offerings and maximize the effectiveness of channel partners and online marketplaces. At the same time, we make it easier for VARs, integrators, and service providers to accelerate adoption, streamline procurement, and optimize deployments for their customers to create maximum value and increase satisfaction and loyalty.'
  });

  readonly whoWeAre = signal({
    title: 'Who is Securenomics?',
    text: 'Securenomics is a security services distributor that helps you leverage valuable tools, services, and ecosystem partners to drive faster growth and success with customers. With Securenomics you get the best and most cost effective service to deploy and manage Netskope and Cisco Security solutions to protect customers\' environments anywhere and everywhere.'
  });

  readonly stats = signal<Stat[]>([
    { label: 'Partners Empowered', value: '500', suffix: '+' },
    { label: 'Security Deployments', value: '10', suffix: 'k+' },
    { label: 'Growth Acceleration', value: '45', suffix: '%' },
    { label: 'Expert Support', value: '24', suffix: '/7' }
  ]);

  readonly impactPoints = signal([
    { id: 1, text: 'Accelerate adoption and streamline procurement.' },
    { id: 2, text: 'Optimize deployments for maximum customer value.' },
    { id: 3, text: 'Increase satisfaction and long-term customer loyalty.' },
    { id: 4, text: 'Cloud-delivered capabilities for agility and scale.' }
  ]);
}


