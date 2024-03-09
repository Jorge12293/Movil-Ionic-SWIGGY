import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  _googleMaps:any;
  private _places = new BehaviorSubject<any[]>([]);
  private _markerChange = new BehaviorSubject<any>({});

  get places(){
    return this._places.asObservable();
  }

  get markerChange(){
    return this._markerChange.asObservable();
  }

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) { }

  loadGoogleMaps():Promise<any>{
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps){
      return Promise.resolve(gModule.maps)
    }
    return new Promise((resolve,reject)=>{
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () =>{
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps){
          resolve(loadedGoogleModule.maps);
        }else{
          reject('Google Map is not Available');
        }
      }
    })
  }

  getAddress(lat:number,lng:number):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`)
      .pipe(
        map((geoData:any)=>{
          if(!geoData || !geoData.results || geoData.results.length === 0) throw(null);
          return geoData.results[0];
        })
      ).subscribe(data=>{
        resolve(data);
      }),(e:any)=>{
        reject(e);
      }
    })
  }

  async getPlaces(query: string) {
    try {
      if(!this._googleMaps){
        this._googleMaps = await this.loadGoogleMaps();
      }
      let googleMaps :any = this._googleMaps;
      console.log('maps: ',this._googleMaps);
      let service = new googleMaps.places.AutocompleteService();
      service.getPlacePredictions({
        input: query,
        componentRestrictions: {
          country: 'IN' // Replace IN with your country code that's it
        }
      },(predictions:any,status:any)=>{
        let autoCompleteItems:any[] = [];
        console.log(predictions);
        console.log(status);
        this.zone.run(()=>{
          if(predictions != null){
            predictions.forEach( async (prediction:any)=>{
              console.log(prediction)
              let latLng : any = await this.geoCode(prediction.description,googleMaps);
              const places = {
                location_name : prediction.structured_formatting.main_text,
                address : prediction.description,
                lat:latLng.lat,
                lng:latLng.lng,
              }
              console.log('Places ',places)
              autoCompleteItems.push(places);
            })
            this._places.next(autoCompleteItems);
          }
        });
      })
    } catch (error) {
      console.log(error)
    }
  }

  geoCode(address:any,googleMaps:any){
    let latLng = {lat:'',lng:''};
    return new Promise((resolve,reject)=>{
      let geocoder = new googleMaps.Geocoder();
      geocoder.geocode({'address':address},(results:any)=>{
        console.log('Results => ',results);
        latLng.lat = results[0].geometry.location.lat();
        latLng.lng = results[0].geometry.location.lng();
        resolve(latLng);
      })
    })
  }

  changeMarkerInMap(location:any){
    this._markerChange.next(location);
  }

}
