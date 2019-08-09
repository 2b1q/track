import { CurrentLatLng } from './map.interfaces';

export interface TrackList {
  id: number;
  name: string;
  date: Date;
  comments?: string;
  distance?: number;
  gpxData: string;
}

export interface SnapshotData {
  weight: number;
  lifted: boolean;
  axisId: number;
}

export interface Snapshot {
  id: number;
  vehicleId: string;
  axises: number;
  timestamp?: string;
  totalWeight: number;
  cargoWeight: number;
  data?: [SnapshotData];
  clientUuid?: string;
  gps: CurrentLatLng;
  // user?: User;
}

export interface SnapshotData {
  weight: number;
  lifted: boolean;
  axisId: number;
}
