export interface CurrentLatLng {
  lat: number;
  lng: number;
}

// GeoJson intarfaces
export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  properties?: any;
  $key?: string;
}

export interface TrackList {
  snapshotId?: number;
  id: number;
  name: string;
  date: Date;
  comments?: string;
  distance?: number;
  gpxData: string;
  startPoint?: number[];
}

export interface SnapshotData {
  weight: number;
  lifted: boolean;
  axisId: number;
}

export interface AxisLoads {
  a1?: number;
  a2?: number;
  a3?: number;
  a4?: number;
  a5?: number;
}

export interface Snapshot {
  id: number;
  timestamp?: string;
  vehicleId: string;
  vehicleAxises: number;
  trailerAxises: number;
  axises: number;
  emptyLoads?: AxisLoads;
  notEmptyLoads?: AxisLoads;
  vehicleEmptyWeight?: number;
  totalWeight?: number;
  cargoWeight?: number;
  data?: SnapshotData[];
  clientUuid?: string;
  gps: CurrentLatLng;
  // user?: User;
}

// current position info
export interface PositionInfo {
  point: IGeoJson;
  timeStamp?: number;
  timePassed?: number;
  passedPoints?: number;
  currentSpeed?: number;
  passedDistance?: number;
  snapshot?: Snapshot;
}

export interface TrackLog {
  startPoint?: IGeoJson;
  totalPoints?: number; // total points from GPX track
  endPoint?: IGeoJson;
  timeStamp?: number; // epoch in ms
  points: Array<PositionInfo>;
}
