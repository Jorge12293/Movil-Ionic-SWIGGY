import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, GeolocationOptions, Position, PositionOptions } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  positionOptions: PositionOptions = {
    maximumAge: 300,
    timeout: 10000,
    enableHighAccuracy: false
  }

  constructor() { }

  async getCurrentLocation() {

    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return undefined;
    }

    if (Capacitor.isNativePlatform()) {
      const permission = await Geolocation.requestPermissions();
      console.log(permission)
    }

    return await Geolocation.getCurrentPosition(this.positionOptions);

    // if (Capacitor.isNative) {
    //   const permission = await Geolocation.requestPermissions();
    //   if (permission && permission.location === 'granted') {
    //     const options: PositionOptions = {
    //       maximumAge: 300,
    //       timeout: 10000,
    //       enableHighAccuracy: false
    //     }
    //     console.log(options)
    //     return await Geolocation.getCurrentPosition();
    //   } else {
    //     console.log('The necessary permissions have not been granted ');
    //     return;
    //   }
    // }else{
    //   console.log('Mode Web')
    //   return;
    // }

  }

}


