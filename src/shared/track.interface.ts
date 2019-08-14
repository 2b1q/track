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
  vehicleAxises: number;
  trailerAxises: number;
  axises: number;
  timestamp?: string;
  totalWeight: number;
  cargoWeight: number;
  data?: [SnapshotData];
  clientUuid?: string;
  gps: CurrentLatLng;
  // user?: User;
}

// current position info
export interface PositionInfo {
  point: IGeoJson;
  currentSpeed: number;
  snapshot: Snapshot;
}
