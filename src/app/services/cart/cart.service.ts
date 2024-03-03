import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { GlobalService } from '../global/global.service';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Item } from 'src/app/models/item.model';
import { Cart } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  model = {} as Cart;
  deliveryCharge:number=20;

  private _cart = new BehaviorSubject<Cart | null>(null);

  constructor(
    private storage:StorageService,
    private global:GlobalService,
    private router: Router
  ) { }

  get cart(){
    return this._cart.asObservable();
  }

  getCart() {
    return this.storage.getStorage('cart');
  }

  async getCartData() {
    let data: any = await this.getCart();
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      await this.calculate();
      this._cart.next(this.model);
    }
  }

  async calculate() {
    let item = this.model.items.filter((x: any) => x.quantity > 0)
    this.model.items = item ?? [];
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal = 0;
    item.forEach((element: Item) => {
      this.model.totalItem += element.quantity ?? 0;
      this.model.totalPrice += (element.price * (element.quantity ?? 0));
    });
    this.model.deliveryCharge = this.deliveryCharge;
    this.model.totalPrice = Number(this.model.totalPrice.toFixed(2));
    this.model.grandTotal = Number((this.model.totalPrice ?? 0 + this.model.deliveryCharge).toFixed(2));
    if (this.model.totalItem === 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = {} as Cart;
    }
  }


  async quantityPlus(index:number,items?:Item[],restaurant?:Restaurant) {
    try {
      if(items) {
        this.model.items = [...items];
      }
      if(restaurant) {
        this.model.restaurant = restaurant;
      }
      if(!this.model.items[index].quantity || this.model.items[index].quantity == 0) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1;
      }
      await this.calculate();
      this._cart.next(this.model);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  alertClearCart(index:any, items:any, data?:any,order?:any) {
    this.global.showAlert(
      order ?
      'Would you like to reset your cart before re-ordering from this restaurant?'
      :
      'Your cart contain items from a different restaurant. Would you like to reset your cart before browsing the restaurant?',
      'Items already in Cart',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.clearCart();
            this.model = {} as Cart;
            if(order){
              this.orderToCart(order);
            }else{
              this.quantityPlus(index, items,data);
            }
          }
        }
      ]
    )
  }

  async orderToCart(order: Order) {
    console.log('order: ', order);
    const data = new Cart(
      order.restaurant,
      order.order,
      0,
      0,
      0
    );
    this.model = data;
    await this.calculate();
    this.saveCart();
    console.log('model: ', this.model);
    this._cart.next(this.model);
    this.router.navigate(['/', 'tabs', 'restaurants', order.restaurant_id]);
  }

  async quantityMinus(index:number){
    try {
      if(this.model?.items[index].quantity !=0 ){
        this.model.items[index].quantity -= 1;
      }else{
        this.model.items[index].quantity = 0;
      }
      await this.calculate();
      this._cart.next(this.model);
   } catch (error) {
     console.log(error);
     throw(error);
   }
  }

  async clearCart() {
    this.global.showLoader();
    await this.storage.removeStorage('cart');
    this._cart.next(null);
    this.global.hideLoader();
  }

  saveCart(model?:any){
    if(model) this.model = model;
    this.storage.setStorage('cart',JSON.stringify(this.model));
    this._cart.next(this.model);
  }
}
