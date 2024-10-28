import { Component } from '@angular/core';
import { AccountComponent } from '../../component/account/account.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [AccountComponent],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css',
})
export class SettingsPage {}
