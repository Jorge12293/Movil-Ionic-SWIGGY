import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from '../../../services/global/global.service';
import { ModalOptions } from '@ionic/angular';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit,OnDestroy {

   isLoading:boolean = true;

  profile :any= { };
  orders:any[] = [];
  orderSub!: Subscription;
  profileSub!: Subscription;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private globalService: GlobalService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.orderSub = this.orderService.orders.subscribe((order:Order[])=>{
      this.orders = order;
    },e=>{
      console.log(e);
    })
    this.profileSub = this.profileService.profile.subscribe(profile=>{
      this.profile = profile;
    },e=>{
      console.log(e);
    })
    this.getData();
  }

  ngOnDestroy(): void {
    if(this.orderSub) this.orderSub.unsubscribe;
    if(this.profileSub) this.profileSub.unsubscribe;
  }

  getData() {
    this.isLoading = true;
    setTimeout(() => {
      this.profile = {
        name: 'Nikhil Agarwal',
        phone: '9109109100',
        email: 'technyks@gmail.com'
      };
      this.orderService.getOrders();
      this.isLoading = false;
    }, 1000);
  }

  logout() { }

  getHelp(order: any) {
    console.log(order)
  }
  async reorder(order: Order) {
    let data: any = await this.cartService.getCart();
    if(data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }
  async editProfile(){
     const options : ModalOptions= {
        component:EditProfileComponent,
        componentProps:{
          profile:this.profile
        },
        cssClass: 'custom-modal',
     }
     const modal = await this.globalService.createModal(options)
  }
}
