import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/fromEvent';

import {
  BluetoothCore,
  BluetoothRemoteGATTServer,
  BluetoothRemoteGATTService,
  BluetoothRemoteGATTCharacteristic,
  DataView
} from '@manekinekko/angular-web-bluetooth';

@Injectable()
export class EnvironmentalSensingService {

  static GATT_CHARACTERISTIC_HUMIDITY = 'humidity';
  static GATT_CHARACTERISTIC_TEMPERATURE = 'temperature';
  static GATT_PRIMARY_SERVICE = 'environmental_sensing';

  constructor(public ble: BluetoothCore) { }

  getDevice() {
    return this.ble
      .discover$({
        filters: [{ services: [EnvironmentalSensingService.GATT_PRIMARY_SERVICE] }]
      });
  }

  getTemperature(gatt: BluetoothRemoteGATTServer): Observable<number> {
    return this.ble.getPrimaryService$(gatt, EnvironmentalSensingService.GATT_PRIMARY_SERVICE)
      .mergeMap(service => this.ble.getCharacteristic$(service, EnvironmentalSensingService.GATT_CHARACTERISTIC_TEMPERATURE))
      .mergeMap(char => {
        char.startNotifications();
        return Observable.fromEvent(char as any, 'characteristicvaluechanged').map(event => (event as any).target.value)
      })
      .map((value: DataView) => {
        return value.getUint16(0, true) / 100.
      })
      .share();
  }

}
