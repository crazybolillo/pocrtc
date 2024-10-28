import { Routes } from '@angular/router';
import { KeypadPageComponent } from './page/keypad-page/keypad-page.component';
import { SettingsPageComponent } from './page/settings-page/settings-page.component';
import { HistoryPageComponent } from './page/history-page/history-page.component';

export const routes: Routes = [
  { path: '', component: KeypadPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'history', component: HistoryPageComponent },
];
