import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ConfigService } from '../../core/service/config/config.service';
import { RtcService } from '../../core/service/rtc/rtc.service';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
    MatSuffix,
    MatButton,
    MatCheckbox,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  private configService = inject(ConfigService);
  private rtcService = inject(RtcService);
  private fb = inject(FormBuilder);

  passwordType = 'password';
  passwordIcon = 'visibility';
  form = this.fb.group({
    address: ['', Validators.required],
    username: ['', Validators.required],
    domain: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  ngOnInit(): void {
    this.form.patchValue(this.configService.getConfigRTC());
  }

  isValid(): boolean {
    this.form.markAllAsTouched();

    return this.form.valid;
  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'visibility_off';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'visibility';
    }
  }

  connect() {
    if (!this.isValid()) {
      return;
    }

    let password = '';
    if (this.form.controls.remember.value) {
      password = this.form.controls.password.value!;
    }

    this.configService.setConfigRTC({
      address: this.form.controls.address.value!,
      username: this.form.controls.username.value!,
      domain: this.form.controls.domain.value!,
      password: password,
    });
    this.rtcService.login(this.form.controls.password.value!);
  }
}
