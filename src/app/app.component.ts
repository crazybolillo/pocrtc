import { Component, inject } from '@angular/core';
import { EventType, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RtcService } from './core/service/rtc/rtc.service';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    NgOptimizedImage,
    AsyncPipe,
    MatNavList,
    MatListItem,
    RouterLink,
    MatIcon,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private rtcService = inject(RtcService);
  private router = inject(Router);

  protected readonly Object = Object;

  stateColors = {
    Disconnected: 'rgb(107 114 128)',
    'Registration Failed': 'rgb(220 38 38)',
    Registered: 'rgb(34 197 94)',
  };
  state = this.rtcService.accountState();
  navigationList = {
    keypad: {
      name: 'Keypad',
      icon: 'dialpad',
      href: '/',
      isActive: false,
    },
    history: {
      name: 'Call History',
      icon: 'history',
      href: '/history',
      isActive: false,
    },
    settings: {
      name: 'Settings',
      icon: 'settings',
      href: '/settings',
      isActive: false,
    },
  };

  constructor() {
    this.router.events.subscribe((route) => {
      if (route.type != EventType.NavigationEnd) {
        return;
      }

      switch (route.urlAfterRedirects) {
        case '/':
          this.navigationList.history.isActive = false;
          this.navigationList.settings.isActive = false;
          this.navigationList.keypad.isActive = true;
          break;
        case '/settings':
          this.navigationList.keypad.isActive = false;
          this.navigationList.history.isActive = false;
          this.navigationList.settings.isActive = true;
          break;
        case '/history':
          this.navigationList.keypad.isActive = false;
          this.navigationList.settings.isActive = false;
          this.navigationList.history.isActive = true;
          break;
      }
    });
  }

  showDisconnect(state: string): boolean {
    return state === 'Disconnected';
  }

  showSuccess(state: string): boolean {
    return state === 'Registered';
  }

  showError(state: string): boolean {
    return ['Registration failed', 'Connection error'].includes(state);
  }
}
