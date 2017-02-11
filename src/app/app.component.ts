import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface PlayerInfo {
  name: string;
  temperature: number;
  isWinner: boolean;
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
    this.environmentalSensing.getDevice()
      .subscribe((gatt: BluetoothRemoteGATTServer) => {
        let player = {
          name: gatt.device.name,
          temperature: null,
          isWinner: false
        };
        this.environmentalSensing.getTemperature(gatt)
         .finally(() => {
            this.players = this.players.filter(item => item !== player);
          })
          .subscribe(value => {
            player.temperature = value;
            player.isWinner = this.players.filter(p => p.temperature > value).length === 0;
          })
        this.players.push(player);
      });
  }
}
