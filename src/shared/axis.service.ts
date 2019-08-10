import { Injectable } from '@angular/core';
import { SnapshotData } from './track-list.interface';

@Injectable()
export class AxisService {
  getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  getLoads(cargoWeight: number, axises: number): SnapshotData[] {
    console.log(`call AxisService.getLoads(${cargoWeight}, ${axises})`);
    // tslint:disable-next-line:prefer-const
    const result = [];
    for (let i = 1; i <= axises; i++) {
      const snapshot: SnapshotData = {
        axisId: i,
        lifted: false,
        weight: 0
      };
      // 1st vehicle axis
      if (i === 1) {
        snapshot.lifted = false; // always false
        snapshot.weight = Math.round(
          cargoWeight * 0.43 + this.getRandom(10, 50)
        ); // 40-43% weight of total cargo
      }
      // 2nd vehicle axis
      if (i === 2) {
        snapshot.lifted = false; // always false
        snapshot.weight = Math.round(cargoWeight * 0.2 + this.getRandom(5, 40)); // 20-24% weight of total cargo
      }
      if (axises === 5) {
        // 1st trailer axis
        if (i === 3) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.11 + this.getRandom(10, 80)
          ); // 10-12% weight of total cargo
        }
        // 2nd trailer axis
        if (i === 4) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.12 + this.getRandom(10, 40)
          ); // 12-12.5% weight of total cargo
        }
        // 3d trailer axis
        if (i === 5) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.1 + this.getRandom(30, 60)
          ); // 10.7% weight of total cargo
        }
      }
      if (axises === 4) {
        // 1st trailer axis
        if (i === 3) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.19 + this.getRandom(7, 60)
          ); // 19% weight of total cargo
        }
        // 2nd trailer axis
        if (i === 4) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.17 + this.getRandom(7, 60)
          ); // 17% weight of total cargo
        }
      }
      result.push(snapshot);
    }
    return result;
  }
}
