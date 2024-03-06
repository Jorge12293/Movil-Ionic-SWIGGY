import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, OnDestroy {

  query:string ='';
  places:any[] = [];
  placeSub!:Subscription;


  constructor(
    private global:GlobalService,
    private maps: GoogleMapsService
  ) { }

  ngOnInit() {
    this.placeSub = this.maps.places.subscribe(allPlaces=>{
      this.places = allPlaces;
      console.log('Places ',this.places)
    })
  }

  ngOnDestroy(): void {
    if(this.placeSub) this.placeSub.unsubscribe();
  }

  async onSearchChange(event: any) {
    console.log(event);
    this.global.showLoader();
    this.query = event.detail.value;
    if(this.query.length>0){
      await this.maps.getPlaces(this.query)
    }
    this.global.hideLoader();
  }

  dismiss() {
    this.global.modalDismiss();
  }
}
