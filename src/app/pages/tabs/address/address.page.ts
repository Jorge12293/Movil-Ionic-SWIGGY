import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { AddressService } from '../../../services/address/address.service';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit,OnDestroy {

  isLoading:boolean=true;
  addresses:Address[]=[];
  addressesSub!:Subscription;
  model:any={
    title:'No address added yet',
    icon: 'location-outline'
  }

  constructor(
    private global:GlobalService,
    private addressService:AddressService,
    private router:Router
  ) { }

  ngOnInit() {
    this.addressesSub = this.addressService.addresses.subscribe((address:Address[])=>{
      this.addresses = address;
    });
    this.getAddress();
  }

  ngOnDestroy(): void {
    if(this.addressesSub) this.addressesSub.unsubscribe();
  }

  getAddress(){
    this.isLoading = true;
    setTimeout(() => {
      this.addressService.getAddresses();
      this.isLoading = false;
    }, 500);
  }

  getIcon(title:string) {
    return this.global.getIcon(title);
  }

  deleteAddress(address:any) {
    this.global.showAlert(
      'Are you sure you want to delete this address?',
      'Confirm',
      [
        {
          text:'No',
          role:'cancel',
          handler: ()=> {
            console.log('Cancel');
            return;
          }
        },
        {
          text:'Yes',
          handler: async() => {
            this.global.showLoader();
            await this.addressService.deleteAddress(address);
            this.global.hideLoader();
          }
        }
      ]
    )
  }

  editAddress(address:any) {
    const navData:NavigationExtras = {
      queryParams: {
        data:JSON.stringify(address)
      }
    }
    this.router.navigate([this.router.url,'edit-address'],navData);
  }

}
