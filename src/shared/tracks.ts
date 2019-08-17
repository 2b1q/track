import { TrackList, Snapshot } from './track.interface';

export const SAVED_ACTIVITIES: TrackList[] = [
  {
    id: 1,
    name: 'Брянск - Москва METRO',
    date: new Date('06/05/2019'),
    gpxData: '../../assets/gpx/1.gpx',
    distance: 373,
    comments: 'Bryansk > Metro Teply Stan, Moskva'
  },
  {
    id: 2,
    name: 'СПБ - МСК',
    date: new Date('06/08/2018'),
    gpxData: '../../assets/gpx/2.gpx',
    distance: 721,
    comments: 'Санкт-Петербург > Москва'
  },
  {
    id: 3,
    name: 'Химки - Нахабино',
    date: new Date('07/08/2019'),
    gpxData: '../../assets/gpx/3.gpx',
    distance: 21.1,
    comments: 'Поездка на грузовике'
  }
];

export const CURRENT_ACTIVITIES: TrackList[] = [
  {
    id: 1,
    name: 'Москва - Воронеж',
    date: new Date(),
    gpxData: '../../assets/gpx/4r.gpx',
    distance: 524,
    startPoint: [37.618423, 55.751244]
  },
  {
    id: 2,
    snapshotId: 5,
    name: 'Домодедово МЕТАЛЛ-ЭНЕРГИЯ - Воронеж АО ТЖБИ-4',
    date: new Date(),
    gpxData: '../../assets/gpx/5r.gpx',
    distance: 524,
    startPoint: [55.39259, 37.82463]
  }
];

export const SAVED_SNAPSHOTS: Snapshot[] = [
  {
    id: 1,
    vehicleId: '3601bd57-4ed7-4e11-941f-63d21c03a6d7',
    axises: 4,
    vehicleAxises: 2,
    trailerAxises: 2,
    totalWeight: 21334,
    cargoWeight: 7134,
    data: [{ weight: 0, lifted: false, axisId: 1 }],
    gps: {
      lat: 0.0,
      lng: 0.0
    }
  },
  {
    id: 2,
    vehicleId: 'f52ed328-8d3c-46be-8b43-d225a1a1cc00',
    axises: 4,
    vehicleAxises: 2,
    trailerAxises: 2,
    totalWeight: 28116,
    cargoWeight: 13760,
    gps: {
      lat: 0.0,
      lng: 0.0
    }
  },
  {
    id: 3,
    vehicleId: 'bcf79c56-f80a-4632-a00d-ce9c3a7775ac',
    axises: 5,
    vehicleAxises: 2,
    trailerAxises: 3,
    totalWeight: 31200,
    cargoWeight: 16620,
    gps: {
      lat: 0.0,
      lng: 0.0
    }
  },
  {
    id: 4,
    vehicleId: 'bf33c29d-6295-4887-9ab0-5a71f9579c97',
    axises: 5,
    vehicleAxises: 2,
    trailerAxises: 3,
    totalWeight: 33400,
    cargoWeight: 18900,
    gps: {
      lat: 0.0,
      lng: 0.0
    }
  },
  {
    id: 5,
    vehicleId: 'e253fc8b-fe63-4620-b4a9-af1b37399d15',
    axises: 5,
    vehicleAxises: 2,
    trailerAxises: 3,
    totalWeight: 34010,
    cargoWeight: 19810,
    vehicleEmptyWeight: 14200,
    emptyLoads: {
      a1: 5360,
      a2: 3900,
      a3: 1680,
      a4: 1560,
      a5: 1700
    },
    notEmptyLoads: {
      a1: 6200,
      a2: 8900,
      a3: 6320,
      a4: 6150,
      a5: 6400
    },
    gps: {
      lat: 0.0,
      lng: 0.0
    }
  }
];
