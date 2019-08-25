import { Injectable } from '@angular/core';
import { SnapshotData, CurrentLatLng, AxisLoads } from './track.interface';
import { headingDistanceTo } from 'geolocation-utils';

@Injectable()
export class AxisService {
  private operator = '+';
  private prevPosition: CurrentLatLng;
  private prevTime: number;
  private prevSpeed: number;

  getRandom(min, max) {
    const add = Math.round(Math.random() * (max - min) + min);
    // this.operator = this.operator === '-' ? '+' : '-'; // revert operator
    return parseInt(`${this.operator}${add}`, 10);
  }

  getLoads(cargoWeight: number, axises: number): SnapshotData[] {
    // console.log(`call AxisService.getLoads(${cargoWeight}, ${axises})`);
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
        snapshot.weight = Math.round(cargoWeight * 0.4 + this.getRandom(3, 10)); // 40-43% weight of total cargo
      }
      // 2nd vehicle axis
      if (i === 2) {
        snapshot.lifted = false; // always false
        snapshot.weight = Math.round(
          cargoWeight * 0.24 + this.getRandom(5, 10)
        ); // 20-24% weight of total cargo
      }
      if (axises === 5) {
        // 1st trailer axis
        if (i === 3) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.12 + this.getRandom(3, 10)
          ); // 10-12% weight of total cargo
        }
        // 2nd trailer axis
        if (i === 4) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.13 + this.getRandom(3, 12)
          ); // 12-12.5% weight of total cargo
        }
        // 3d trailer axis
        if (i === 5) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(
            cargoWeight * 0.11 + this.getRandom(10, 15)
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

  getLoadsFromCurrentWeight(currentLoads: AxisLoads): SnapshotData[] {
    const axises = Object.keys(currentLoads).length;
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
        snapshot.weight = Math.round(currentLoads.a1 + this.getRandom(0, 3));
      }
      // 2nd vehicle axis
      if (i === 2) {
        snapshot.lifted = false; // always false
        snapshot.weight = Math.round(currentLoads.a2 + this.getRandom(0, 4));
      }
      if (axises === 5) {
        // 1st trailer axis
        if (i === 3) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(currentLoads.a3 + this.getRandom(0, 5));
        }
        // 2nd trailer axis
        if (i === 4) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(currentLoads.a4 + this.getRandom(0, 4));
        }
        // 3d trailer axis
        if (i === 5) {
          snapshot.lifted = false; // maight be true
          snapshot.weight = Math.round(currentLoads.a5 + this.getRandom(0, 5));
        }
      }
      result.push(snapshot);
    }
    return result;
  }

  /**
   *
   * @returns km's passed per one hour
   */
  getCurrentSpeed(currentTime: number, position: CurrentLatLng): number {
    if (
      this.prevPosition &&
      this.prevPosition.lat === position.lat &&
      this.prevPosition.lng === position.lng
    ) {
      return 0;
    }

    if (!this.prevPosition) {
      this.prevPosition = position;
      this.prevTime = currentTime;
      this.prevSpeed = 0;
      return 0;
    }
    const timePassed = currentTime - this.prevTime;
    const secPassed = Math.round(timePassed / 1000);
    // const minPassed = secPassed / 60;

    // console.log('secPassed from previous point to current', secPassed);
    // console.log('minPassed', minPassed);

    const location1 = {
      lat: this.prevPosition.lat,
      lon: this.prevPosition.lng
    };
    const location2 = { lat: position.lat, lon: position.lng };
    const { distance: metersPassed } = headingDistanceTo(location1, location2);

    const metersPerSec = metersPassed / secPassed;

    const kmPerHour = ((metersPerSec * 60) / 1000) * 60;
    // console.log('kmPerHour', kmPerHour);

    let avg = 0;
    if (this.prevSpeed !== kmPerHour) {
      avg = (this.prevSpeed + kmPerHour) / 2;
    }

    // console.log('AVG kmPerHour', avg);

    this.prevPosition = position;
    this.prevTime = currentTime;
    this.prevSpeed = kmPerHour;
    return avg > 0 ? avg : kmPerHour;
  }

  /**
   *
   * @param startPositon start point coordinates
   * @param currentPosition current position coordinates
   * @returns km passed (number)
   */
  getDistance(
    startPositon: CurrentLatLng,
    currentPosition: CurrentLatLng
  ): number {
    const { distance } = headingDistanceTo(
      { lat: startPositon.lat, lon: startPositon.lng },
      { lat: currentPosition.lat, lon: currentPosition.lng }
    );
    return Math.round(distance);
  }
}
