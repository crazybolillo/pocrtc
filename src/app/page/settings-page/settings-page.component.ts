import { Component } from '@angular/core';
import { AccountComponent } from '../../component/account/account.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [AccountComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent {}
