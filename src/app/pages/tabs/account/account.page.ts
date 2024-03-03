import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { Order } from 'src/app/models/order.model';

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

  constructor(
    private orderService:OrderService,
    private cartService:CartService
  ) { }

  ngOnInit() {
    this.orderSub = this.orderService.orders.subscribe((order:Order[])=>{
      this.orders = order;
      // if(order instanceof Array){
      //   this.orders = order;
      // }else {
      //   if(order?.delete) {
      //     this.orders = this.orders.filter(x => x.id != order.id);
      //   } else if(order?.update) {
      //     const index = this.orders.findIndex(x => x.id == order.id);
      //     this.orders[index] = order;
      //   } else {
      //     this.orders = this.orders.concat(order);
      //   }
      // }
    },e=>{
      console.log(e);
    })
    this.getData();
  }

  ngOnDestroy(): void {
    if(this.orderSub) this.orderSub.unsubscribe;
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
}
