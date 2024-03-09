import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, OnDestroy {

  query: string = '';
  places: any[] = [];
  placeSub!: Subscription;


  constructor(
    private global: GlobalService,
    private maps: GoogleMapsService,
    private locationService:LocationService,
  ) { }

  ngOnInit() {
    this.placeSub = this.maps.places.subscribe(allPlaces => {
      this.places = allPlaces;
      console.log('Places ', this.places)
    })
  }

  ngOnDestroy(): void {
    if (this.placeSub) this.placeSub.unsubscribe();
  }

  async onSearchChange(event: any) {
    console.log(event);
    this.global.showLoader();
    this.query = event.detail.value;
    if (this.query.length > 0) {
      await this.maps.getPlaces(this.query)
    }
    this.global.hideLoader();
  }


  dismiss(val?:any) {
    this.global.modalDismiss(val);
  }

  choosePlace(place: any) {
    console.log(place);
    this.dismiss(place);
  }

  async getCurrentPosition() {
    try {
      this.global.showLoader();
      const position : any = await this.locationService.getCurrentLocation();
      const {latitude,longitude} = position?.coords;
      const results = await this.maps.getAddress(latitude,longitude);
      console.log(results);
      const place = {
        location_name: results.address_components[0].short_name,
        address: results.formatted_address,
        lat:latitude,
        lng:longitude
      }
      this.global.hideLoader();
      this.dismiss(place);
    } catch (error) {
      console.log(error)
      this.global.hideLoader();
      this.global.errorToast('Check wether GPS is enabled & the App has its permissions',5000)
    }
  }
}
