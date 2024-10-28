import { Component, EventEmitter, Output } from '@angular/core';
import { KeypadButtonComponent } from '../keypad-button/keypad-button.component';

@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [KeypadButtonComponent],
  templateUrl: './keypad.component.html',
  styleUrl: './keypad.component.css',
})
export class KeypadComponent {
  buttons = [
    [
      { mainText: '1', secondaryText: '' },
      { mainText: '2', secondaryText: 'ABC' },
      { mainText: '3', secondaryText: 'DEF' },
    ],
    [
      { mainText: '4', secondaryText: 'GHI' },
      { mainText: '5', secondaryText: 'JKL' },
      { mainText: '6', secondaryText: 'MNO' },
    ],
    [
      { mainText: '7', secondaryText: 'PQRS' },
      { mainText: '8', secondaryText: 'TUV' },
      { mainText: '9', secondaryText: 'XYZ' },
    ],
    [
      { mainText: '*', secondaryText: '' },
      { mainText: '0', secondaryText: '+' },
      { mainText: '#', secondaryText: '' },
    ],
  ];
  @Output() buttonClicked = new EventEmitter<string>();
}
