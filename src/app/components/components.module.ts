import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BannerComponent } from './banner/banner.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { LoadingRestaurantComponent } from './loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { ItemComponent } from './item/item.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { OrdersComponent } from './orders/orders.component';
import { MapComponent } from './map/map.component';
import { SearchLocationComponent } from './search-location/search-location.component';

const listComponents = [
  LoadingRestaurantComponent,
  BannerComponent,
  RestaurantComponent,
  EmptyScreenComponent,
  ItemComponent,
  RestaurantDetailComponent,
  CartItemComponent,
  OrdersComponent,
  MapComponent,
  SearchLocationComponent
];

@NgModule({
  declarations: [...listComponents],
  exports:[...listComponents],
  imports: [
    IonicModule,
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule { }
