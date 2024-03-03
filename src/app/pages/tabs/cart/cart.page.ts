import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { OrderService } from '../../../services/order/order.service';
import { GlobalService } from '../../../services/global/global.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { Cart } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: false }) content!: IonContent;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  deliveryCharge = 20
  instruction: any;
  location = {} as Address;
  cartSub!: Subscription;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private navCtrl: NavController,
    private global: GlobalService,
    private cartService: CartService
  ) { }


  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe((cart: Cart|null) => {
      if(cart) this.model = cart;
      if (!this.model) this.location = {} as Address;
    });
    this.getModel();
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getModel() {
    this.checkUrl();
    this.location = new Address(
      'adddress1',
      "user1",
      "Address 1",
      'Karol Bagh, New Delhi',
      "",
      "",
      28.645518880730844,
      77.19052782917346,
    );
    await this.cartService.getCartData();
  }

  quantityPlus(index: number) {
    this.cartService.quantityPlus(index);
  }
  quantityMinus(index: number) {
    this.cartService.quantityMinus(index);
  }


  checkUrl() {
    let url = (this.router.url).split('/');
    const spliced = url.splice(url.length - 2, 2);
    this.urlCheck = spliced[0];
    url.push(this.urlCheck);
    this.url = url;
  }

  getPreviousUrl() {
    return this.url.join('/')
  }

  async scrollToBottom() {
    await this.content.scrollToBottom(500);
  }

  ionViewDidLeave() {
    console.log('Event [ionViewDidLeave] cart.page.ts');
    if (this.model?.items && this.model?.items?.length > 0) {
      this.cartService.saveCart();
    }
  }

  addAddress() {
    throw new Error('Method not implemented.');
  }

  changeAddress() {
    throw new Error('Method not implemented.');
  }

  makePayment() {
    try {
      const data= {
        restaurant_id: this.model.restaurant.uid,
        instruction: this.instruction ? this.instruction : '',
        res: this.model.restaurant,
        order:this.model.items,
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.model.deliveryCharge ?? 0,
        status: 'Created',
        paid: 'COD'
      }
      console.log('Order Create: ', data);
      this.orderService.placeOrder(data);
      // Clear Cart
      this.cartService.clearCart();
      this.global.successToast('Your Order is Placed Successfully');
      this.navCtrl.navigateRoot(['tabs/account'])
    } catch (error) {
      console.log(error);
    }
  }

}
