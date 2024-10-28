import { Injectable } from '@angular/core';

export interface ConfigRTC {
  address: string;
  username: string;
  domain: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  setConfigRTC(config: ConfigRTC) {
    localStorage.setItem('configRTC', JSON.stringify(config));
  }

  getConfigRTC(): ConfigRTC {
    const retrieved = localStorage.getItem('configRTC');
    if (!retrieved) {
      return { address: '', domain: '', username: '', password: '' };
    }

    return JSON.parse(retrieved);
  }
}
