import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface PlayerInfo {
  name: string;
  temperature: Observable<number>;
}

import {
  BluetoothRemoteGATTServer
} from '@manekinekko/angular-web-bluetooth';

import { EnvironmentalSensingService } from './environmental-sensing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private players: PlayerInfo[] = [];

  constructor(private environmentalSensing: EnvironmentalSensingService) {
  }

  connect() {
    this.environmentalSensing.getDevice().subscribe((gatt: BluetoothRemoteGATTServer) => {
      let player = {
        name: gatt.device.name,
        temperature: this.environmentalSensing.getTemperature(gatt)
      };
      player.temperature.subscribe(null, null, () => {
        this.players = this.players.filter(item => item !== player);
      });
      this.players.push(player);
    })
  }
}
