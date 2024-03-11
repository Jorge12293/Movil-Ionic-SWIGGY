import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalOptions } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy {
  banners:any[]=[];
  restaurants:Restaurant[]=[];
  isLoading:boolean=false;
  location = {} as Address;
  addressSub!:Subscription;

  constructor(
    private api:ApiService,
    private addressService:AddressService,
    private global : GlobalService,
    private locationService: LocationService,
    private router:Router
  ) { }


  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe(address=>{
      if(address && address.lat){
        if(!this.isLoading) this.isLoading = true;
        this.location = address;
        this.nearByApiCall(address.lat,address.lng);
      }else {
        if(!address && (!this.location || !this.location.lat) ){
          this.searchLocation('home','home-modal')
        }

      }
    },e=>{
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    })

    this.isLoading = true;
    this.getBanners();
    console.log(this.location.lat)
    if(!this.location.lat){
      this.getNearByRestaurants();
    }
  }

  ngOnDestroy(): void {
    if(this.addressSub) this.addressSub.unsubscribe();
  }

  getBanners(){
    this.banners = this.api.banners;
  }

  nearByApiCall(lat: number, lng: number) {
    this.isLoading = false;
    this.restaurants = this.api.restaurants;
  }

  async getNearByRestaurants() {
    try {
      const position = await this.locationService.getCurrentLocation();
      if(position){
        const { latitude, longitude } = position.coords;
        await this.getData(latitude,longitude);
        console.log('Restaurants: ',this.restaurants);
        this.isLoading = false;
      }else{
        console.log('Error Get Position...');
        this.isLoading = false;
        this.searchLocation('home','home-modal');
      }
    } catch (error) {
      console.log(error);
      this.isLoading = false;
      this.searchLocation('home','home-modal');
    }
  }

  async getData(lat:number,lng:number){
    try {
      this.restaurants = [];
      await this.nearByApiCall(lat,lng);
    } catch (error) {
      console.log(error);
      this.global.errorToast();
    }
  }

  async searchLocation(prop:string,className?:string){
    try {
      const options :ModalOptions = {
        component:SearchLocationComponent,
        cssClass: className ?? '',
        backdropDismiss: prop === 'select-place',
        componentProps: {
          from : prop
        }
      }
      const modal = await this.global.createModal(options);
      if(modal){
        if(modal == 'add'){
          this.addAddress(this.location);
        } else if(modal == 'select'){
          this.searchLocation('select-place')
        } else{
          this.location = modal;
          await this.getData(this.location.lat,this.location.lng);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  addAddress(val?:any){
    let navData: NavigationExtras;
    if(val){
      val.from = 'home'; // Updated Route
    }{
      val = { // Initialize Route
        from : 'home'
      }
    }
    navData = {
      queryParams:{
        data: JSON.stringify(val)
      }
    }
    this.router.navigate(['/','tabs','address','edit-address'],navData)
  }
}
