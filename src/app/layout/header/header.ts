import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarDropdownComponent, DropdownItem } from './navbar-dropdown/navbar-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NavbarDropdownComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  readonly platformItems = signal<DropdownItem[]>([
    {
      title: 'Netskope',
      link: 'https://www.netskope.com/',
    },
    {
      title: 'Cisco Security',
      link: 'https://www.cisco.com/',
    },
    {
      title: 'Cato Networks',
      link: 'https://www.catonetworks.com/',
    },
    {
      title: 'Cyberhaven',
      link: 'https://www.cyberhaven.com/',
    }
  ]);

  readonly solutionItems = signal<DropdownItem[]>([
    {
      title: 'Netscope Solutions',
      link: 'https://www.netskope.com/solutions',
    },
    {
      title: 'Cisco-Security Solutions',
      link: 'https://www.cisco.com/site/us/en/solutions/secure-the-enterprise/index.html?ccid=cc003064',
    },
  ]);
}
