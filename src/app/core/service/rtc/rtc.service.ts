import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UA, WebSocketInterface } from 'jssip';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class RtcService {
  private configService = inject(ConfigService);
  private _state = new BehaviorSubject<string>('Disconnected');
  private socket?: WebSocketInterface;
  private ua?: UA;

  constructor() {
    const cfg = this.configService.getConfigRTC();
    if (cfg.password) {
      this.login(cfg.password);
    }
  }

  state(): Observable<string> {
    return this._state;
  }

  login(password: string) {
    if (this.ua) {
      this.ua.stop();
    }

    const cfg = this.configService.getConfigRTC();
    this.socket = new WebSocketInterface(cfg.address);
    this.ua = new UA({
      sockets: [this.socket],
      uri: `sip:${cfg.username}@${cfg.domain}`,
      password: password,
    });

    this.ua.on('registered', () => {
      this._state.next('Registered');
    });
    this.ua.on('registrationFailed', (evt) => {
      console.log('registrationFailed:', evt);
      this._state.next('Registration Failed');
    });
    this.ua.on('disconnected', (evt) => {
      console.log('disconnected:', evt);
      if (evt.error) {
        this._state.next('Connection error');
      }
    });

    this.ua.start();
  }

  call(target: string, video = false) {
    if (!this.ua) {
      return;
    }

    const session = this.ua.call(target, {
      mediaConstraints: { audio: true, video: video },
    });

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    session.connection.addEventListener('addstream', (evt: any) => {
      console.log('addstream:', evt);
      const remote: HTMLVideoElement = document.createElement('video');
      remote.srcObject = evt.stream;
      remote.play();
    });
  }
}
