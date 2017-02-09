import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';

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
        filters: [{services: [EnvironmentalSensingService.GATT_PRIMARY_SERVICE]}]
      });
  }

  getTemperature(gatt: BluetoothRemoteGATTServer): Observable<number> {
    return new Observable((subscriber) => {
          (async function() {
            const svc = await gatt.getPrimaryService(EnvironmentalSensingService.GATT_PRIMARY_SERVICE);
            const char = await svc.getCharacteristic(EnvironmentalSensingService.GATT_CHARACTERISTIC_TEMPERATURE);
            (char as any).addEventListener('characteristicvaluechanged', event => {
              subscriber.next(event.target.value);
            })
            char.startNotifications();
          })();
        })
        .map((value: DataView) => {
          return value.getUint16(0, true) / 100.
        })
        .share();
  }

}
