import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {


  form!: FormGroup;
  location: any = {};
  isSubmitted: boolean = false;
  isLocationFetched: boolean = false;
  center:any;
  update:boolean= false;
  id:any;
  isLoading:boolean=false;

  constructor(
    private addressService: AddressService,
    private global: GlobalService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private map: GoogleMapsService,
  ) { }

  ngOnInit() {
    this.checkedForUpdate();
  }

  checkedForUpdate(){
    this.isLoading = true;
    this.location.location_name = 'Locating...';
    this.isLocationFetched = false;
    this.route.queryParams.subscribe(async(data:any)=>{
      if(data?.data){
        const address = JSON.parse(data.data);
        this.center = {
          lat:address.lat,
          lng:address.lng
        };
        this.update = true;
        this.location.lat = this.center.lat;
        this.location.lng = this.center.lng;
        this.location.address = address.address;
        this.location.location_name = address.title;
        this.id = address.id;
        await this.initForm(address);
        this.toggleFetched()
      }else {
        this.update= false;
        this.initForm()
      }
    });
  }

  initForm(address?:any) {
    let data : any = {
      title:null,
      house:null,
      landmark:null,
    }
    if(address){
      data = {
        title:address.title,
        house:address.house,
        landmark:address.landmark,
      }
    }
    this.formData(data);
  }

  formData(data:any){
    this.form = new FormGroup({
      title: new FormControl(data.title, { validators: [Validators.required] }),
      house: new FormControl(data.house, { validators: [Validators.required] }),
      landmark: new FormControl(data.landmark, { validators: [Validators.required] })
    })
    this.isLoading = false;
  }

  fetchLocation(location: any) {
    this.location = location;
    this.isLocationFetched = true;
  }

  toggleFetched() {
    this.isLocationFetched = !this.isLocationFetched;
  }

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }

  async onSubmit() {
    try {
      this.toggleSubmit();
      if (!this.form.valid || !this.isLocationFetched) {
        this.toggleSubmit();
        return;
      }
      const data: any = {
        title: this.form.value.title,
        landmark: this.form.value.landmark,
        house: this.form.value.house,
        address: this.location.address,
        lat: this.location.lat,
        lng: this.location.lng,
      }
      if(!this.id){
        this.addressService.addAddress(data);
      }else {
        this.addressService.updateAddress(this.id,data);
      }
      this.navCtrl.back();
      this.toggleSubmit();
    } catch (error) {
      console.log(error);
      this.global.errorToast();
    }
  }

  async searchLocation(){
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass:'address-modal',
        swipeToClose: true
      }
      const location = await this.global.createModal(options);
      if(location){
        this.location = location;
        const loc = {
          lat: location.lat,
          lng: location.lng
        }
        // Update Marker
        this.update = true;
        this.map.changeMarkerInMap(loc);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
