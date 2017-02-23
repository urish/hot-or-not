import { Injectable } from '@angular/core';

import 'rxjs/add/operator/mergeMap';

import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';

@Injectable()
export class EnvironmentalSensingService {

  constructor(public ble: BluetoothCore) { }

  getDevice() {
    return this.ble
      .discover$({
        filters: [{ services: ['environmental_sensing'] }]
      });
  }

  getTemperature(gatt: BluetoothRemoteGATTServer) {
    return this.ble.getPrimaryService$(gatt, 'environmental_sensing')
      .mergeMap(service => this.ble.getCharacteristic$(service, 'temperature'))
      .mergeMap(char => this.ble.observeValue$(char))
      .map(value => value.getUint16(0, true) / 100.);
  }
}
