import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  @Output() location: EventEmitter<any> = new EventEmitter();
  @Input() center = { lat: 28.649944693035188, lng: 77.23961776224988 }
  @Input() update: boolean = false;

  mapListener!:Subscription;
  mapChange!:Subscription;

  googleMaps: any;
  map: any;
  marker: any;

  constructor(
    private maps: GoogleMapsService,
    private rendered: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.initAfterViewInit();
  }

  async initAfterViewInit(){
    await this.initMap();
    await this.updateMarkerInMap();
  }

  async updateMarkerInMap(){
    this.mapChange = this.maps.markerChange.subscribe(async(loc:any)=>{
      if(loc?.lat){
        const googleMaps = this.googleMaps;
        const location = new googleMaps.LatLng(loc.lat,loc.lng);
        this.map.panTo(location);
        this.marker.setMap(null);
        await this.addMarker(location);
      }
    });
  }

  ngOnDestroy(): void {
    if(this.mapListener) this.googleMaps.event.removeListener(this.mapListener);
    if(this.mapChange) this.mapChange.unsubscribe();
  }

  async initMap() {
    try {
      if(!this.update){
        const position = await this.locationService.getCurrentLocation();
        console.log(position)
        this.center = {
          lat: position?.coords.latitude ?? 0,
          lng: position?.coords.longitude ?? 0,
        }
        await this.loadMap();
        this.getAddress(this.center.lat, this.center.lng);
      }else {
        await this.loadMap();
      }
    } catch (error) {
      console.log(error);
      this.loadMap();
    }
  }


  async loadMap() {
    try {
      let googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.RoadMap, 'SwiggyClone']
        },
      });
      const style = [{
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -100 }
        ]
      }];
      const mapType = new googleMaps.StyledMapType(style);
      this.map.mapTypes.set('SwiggyClone', mapType);
      this.map.setMapTypeId('SwiggyClone');
      this.rendered.addClass(mapEl, 'visible');
      this.addMarker(location);
    } catch (error) {
      console.log(error);
    }
  }

  addMarker(location: any) {
    let googleMaps = this.googleMaps;
    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50)
    }
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true,
      animation: googleMaps.Animation.DROP
    });
    this.mapListener = this.googleMaps.event.addListener(this.marker, 'dragend', () => {
      this.getAddress(this.marker.position.lat(), this.marker.position.lng());
    });
  }


  async getAddress(lat: number, lng: number) {
    try {
      const result: any = await this.maps.getAddress(lat, lng)
      const loc = {
        title: result.address_components[0].short_name,
        address: result.formatted_address,
        lat,
        lng
      }
      this.location.emit(loc);
    } catch (error) {
      console.log(error);
    }
  }
}
