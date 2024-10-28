import { Routes } from '@angular/router';
import { KeypadPageComponent } from './page/keypad-page/keypad-page.component';
import { SettingsPage } from './page/settings-page/settings-page';
import { HistoryPageComponent } from './page/history-page/history-page.component';

export const routes: Routes = [
  { path: '', component: KeypadPageComponent },
  { path: 'settings', component: SettingsPage },
  { path: 'history', component: HistoryPageComponent },
];
