import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  async getCurrentLocation(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      return;
    }
    const options:PositionOptions = {
      maximumAge:300,
      timeout:10000,
      enableHighAccuracy:true
    }

    return await Geolocation.getCurrentPosition(options);
  }


}
