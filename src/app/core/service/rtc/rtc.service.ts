import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UA, WebSocketInterface } from 'jssip';
import { ConfigService } from '../config/config.service';
import { RTCSession } from 'jssip/lib/RTCSession';

interface CallRTC {
  callId: string;
  session: RTCSession;
  streams: [MediaStream] | null;
}

@Injectable({
  providedIn: 'root',
})
export class RtcService {
  private configService = inject(ConfigService);
  private _accountState = new BehaviorSubject<string>('Disconnected');
  private _state = new BehaviorSubject<string>('Idle');
  private socket?: WebSocketInterface;
  private ua?: UA;
  private streams: { [id: string]: HTMLVideoElement } = {};
  private calls: { [id: string]: CallRTC } = {};
  private _activeCall = new BehaviorSubject<CallRTC | null>(null);

  constructor() {
    const cfg = this.configService.getConfigRTC();
    if (cfg.password) {
      this.login(cfg.password);
    }
  }

  accountState(): Observable<string> {
    return this._accountState;
  }

  state(): Observable<string> {
    return this._state;
  }

  activeCall(): Observable<CallRTC | null> {
    return this._activeCall;
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
      this._accountState.next('Registered');
    });
    this.ua.on('registrationFailed', (evt) => {
      console.log('registrationFailed:', evt);
      this._accountState.next('Registration Failed');
    });
    this.ua.on('disconnected', (evt) => {
      console.log('disconnected:', evt);
      if (evt.error) {
        this._accountState.next('Connection error');
      }
    });

    this.ua.start();
  }

  endActiveCall(): boolean {
    if (this._activeCall.value) {
      return this.endCall(this._activeCall.value.callId);
    } else {
      return false;
    }
  }

  endCall(callId: string): boolean {
    const call = this.calls[callId];
    if (call) {
      call.session.terminate();
      this.processCallEnd(callId);
      return true;
    } else {
      return false;
    }
  }

  handleAddStream(evt: any, sessionId: string) {
    console.log('addStream: ', evt);

    const call = this.calls[sessionId];
    if (call.streams) {
      call.streams.push(evt.stream);
    } else {
      call.streams = [evt.stream];
    }

    const remote: HTMLVideoElement = document.createElement('video');
    remote.srcObject = evt.stream;
    this.streams[evt.stream.id] = remote;
    remote.play().catch((reason) => {
      console.error('Failed to playback stream: ', reason);
    });
  }

  removeStream(stream: MediaStream) {
    const remote = this.streams[stream.id];
    if (remote) {
      remote.remove();
    }

    delete this.streams[stream.id];
  }

  handleRemoveStream(evt: any) {
    console.log('removeStream: ', evt);
    this.removeStream(evt.stream);
  }

  handleCallConfirmed(evt: any) {
    console.log('CallRTC confirmed: ', evt);
    this._state.next('call');
  }

  handleCallEnd(evt: any) {
    console.log('CallRTC end: ', evt);
    if (!evt.message) {
      return;
    }

    this.processCallEnd(evt.message.call_id);
  }

  processCallEnd(callId: string) {
    const call = this.calls[callId];
    if (call.streams) {
      call.streams.forEach((stream: MediaStream) => {
        this.removeStream(stream);
      });
    }
    delete this.calls[callId];

    this._state.next('idle');
    this._activeCall.next(null);
  }

  call(target: string, video = false) {
    if (!this.ua) {
      return;
    }

    const session = this.ua.call(target, {
      eventHandlers: {
        ended: (event) => {
          this.handleCallEnd(event);
        },
        confirmed: (event: any) => {
          this.handleCallConfirmed(event);
        },
      },
      mediaConstraints: { audio: true, video: video },
    });
    console.log('Session: ', session);

    // @ts-expect-error this field is actually accessible
    const callId = session.id.replace(session._from_tag, '');
    const call = { callId: callId, session: session, streams: null };

    this.calls[callId] = call;
    this._activeCall.next(call);

    session.connection.addEventListener('addstream', (evt) => {
      this.handleAddStream(evt, callId);
    });
    session.connection.addEventListener('removestream', (evt) => {
      this.handleRemoveStream(evt);
    });
    session.on('ended', (evt) => {
      this.handleCallEnd(evt);
    });
  }
}
