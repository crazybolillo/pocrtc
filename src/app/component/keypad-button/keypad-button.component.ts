import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-keypad-button',
  standalone: true,
  imports: [MatButton],
  templateUrl: './keypad-button.component.html',
  styleUrl: './keypad-button.component.css',
})
export class KeypadButtonComponent {
  @Input() mainText?: string;
  @Input() secondaryText?: string;
}
