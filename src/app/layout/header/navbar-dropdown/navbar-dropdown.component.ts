import { Component, Input, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface DropdownItem {
    title: string;
    link: string;
    icon?: string;
}

@Component({
    selector: 'app-navbar-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar-dropdown.component.html',
    styleUrl: './navbar-dropdown.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarDropdownComponent {
    @Input() label: string = '';
    @Input() items: DropdownItem[] = [];

    isOpen = signal(false);

    @HostListener('mouseenter')
    onMouseEnter() {
        if (window.innerWidth >= 1024) {
            this.isOpen.set(true);
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (window.innerWidth >= 1024) {
            this.isOpen.set(false);
        }
    }

    toggleDropdown() {
        if (window.innerWidth < 1024) {
            this.isOpen.update(v => !v);
        }
    }
}
