import { Component, inject } from '@angular/core';
import { KeypadComponent } from '../../component/keypad/keypad.component';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RtcService } from '../../core/service/rtc/rtc.service';

@Component({
  selector: 'app-keypad-page',
  standalone: true,
  imports: [
    KeypadComponent,
    MatFabButton,
    MatIcon,
    ReactiveFormsModule,
    MatIconButton,
  ],
  templateUrl: './keypad-page.component.html',
  styleUrl: './keypad-page.component.css',
})
export class KeypadPageComponent {
  private fb = inject(FormBuilder);
  private rtcService = inject(RtcService);

  disableCallButton = true;
  form = this.fb.group({
    number: [''],
  });
  state = this.rtcService.state();
  activeCall = this.rtcService.activeCall();
  disableCallControls = true;

  constructor() {
    this.form.controls.number.valueChanges.subscribe((value) => {
      this.disableCallButton = !value;
    });
    this.state.subscribe((value) => {
      this.disableCallButton = value === 'call';
    });
    this.activeCall.subscribe((call) => {
      this.disableCallControls = !call;
    });
  }

  keypadClick(value: string) {
    const oldValue = this.form.controls.number.value;
    this.form.controls.number.setValue(oldValue + value);
  }

  backspaceClick() {
    const oldValue = this.form.controls.number.value;
    if (!oldValue) {
      return;
    }

    this.form.controls.number.setValue(
      oldValue.substring(0, oldValue.length - 1),
    );
  }

  audioCall() {
    const number = this.form.controls.number.value;
    if (!number) {
      return;
    }

    this.rtcService.call(number);
  }

  endCall(): void {
    this.rtcService.endActiveCall();
  }
}
