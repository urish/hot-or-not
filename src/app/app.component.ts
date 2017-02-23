import { Component } from '@angular/core';

import { EnvironmentalSensingService } from './environmental-sensing.service';

interface PlayerInfo {
  name: string;
  temperature: number;
  isWinner: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private players: PlayerInfo[] = [];

  constructor(private environmentalSensing: EnvironmentalSensingService) {
  }

  addPlayer() {
    this.environmentalSensing.getDevice()
      .subscribe(gatt => {
        const player = {
          name: gatt.device.name, 
          temperature: 0,
          isWinner: false
        };
        this.environmentalSensing.getTemperature(gatt)
         .finally(() => {
            this.players = this.players.filter(item => item !== player);
          })
          .subscribe(value => {
            player.temperature = value;
            player.isWinner = !this.players.some(p => p.temperature > value);
          });
        this.players.push(player);
     });
  }
}
