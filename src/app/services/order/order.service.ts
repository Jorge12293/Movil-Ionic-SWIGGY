import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _orders = new BehaviorSubject<Order[]>([]);


  constructor(
    private api: ApiService
  ) { }

  public get orders() {
    return this._orders.asObservable();
  }

  getOrders() {
    try {
      const orders = this.api.orders;
      this._orders.next(orders);
    } catch (error) {
      throw(error);
    }
  }

  placeOrder(param: any) {
    try {
      param.user_id = '1';
      param.id = '5aG0RsPuze8NX00B7uE2';
      let currentOrders: Order[] = [];
      currentOrders.push(new Order(
        param.address,
        param.restaurant,
        param.restaurant_id,
        param.order,
        param.total,
        param.grandTotal,
        param.deliveryCharge,
        param.status,
        param.time,
        param.paid,
        param.id,
        param.user_id,
        param.instruction
      ));
      currentOrders = currentOrders.concat(this._orders.value);
      this._orders.next(currentOrders);
    } catch(e) {
      throw(e);
    }
  }

  updateOrder(param: any) { }


}
