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
    title: 'Helping Customers Achieve Maximum ROI from Modern Security Technologies',
    subtitle: 'Securenomics enables organizations to learn, evaluate, and adopt leading security platforms such as Netskope and Cisco Security. Through our partner ecosystem across North America, we accelerate successful adoption and deliver measurable security outcomes.'
  });

  readonly missionContent = signal({
    main: 'We help partners and customers successfully learn, evaluate, and adopt modern security technologies to achieve measurable outcomes and maximize ROI. Our comprehensive approach combines market education, streamlined planning and adoption, rapid proof-of-value and implementation services, and ongoing optimization through our Comanage 360 services. All capabilities are delivered in the cloud to help partners scale efficiently and continuously deliver value to their customers.',
    secondary: 'We work closely with Netskope and Cisco Security , Cato Networks & Cyberhaven to help customers understand and adopt the latest security innovations while enabling partners to deliver successful deployments. At the same time, we simplify how VARs, integrators, and service providers help their customers evaluate solutions, accelerate adoption, streamline procurement, and optimize security outcomes.'
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
    { id: 1, text: 'Learn and evaluate modern security technologies with confidence.' },
    { id: 2, text: 'Accelerate adoption through rapid proof-of-value and implementation.' },
    { id: 3, text: 'Optimize deployments to maximize ROI and measurable outcomes.' },
    { id: 4, text: 'Deliver long-term customer value, satisfaction, and loyalty.' },
    { id: 5, text: 'Scale securely with cloud-delivered capabilities for agility and growth.' }
  ]);
}


