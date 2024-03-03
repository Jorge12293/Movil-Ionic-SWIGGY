import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from '../../../services/cart/cart.service';
import { Subscription, take } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit,OnDestroy{
  id:any;
  data:Restaurant = {} as Restaurant;
  items:any[] = [];
  veg:boolean= false;
  isLoading: boolean = false;
  cartData:any={};
  storedData:any={};
  model = {
    icon:'fast-food-outline',
    title: 'No Menu Available'
  }

  categories: Category[] = [];
  allItems:Item[] = [];
  cartSub!:Subscription;

  constructor(
    private route:ActivatedRoute,
    private navController:NavController,
    private router:Router,
    private api:ApiService,
    private cartService:CartService
  ) { }


  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap:any)=>{
      if(!paramMap.has('restaurantId')){
        this.navController.back();
        return;
      }
      const {restaurantId} = paramMap.params;
      this.id = restaurantId;
      this.getItems();
    })
    this.cartSub = this.cartService.cart.subscribe((cart:any)=>{
      this.cartData = {};
      this.storedData = {};
      if(cart && cart?.totalItem > 0){
        this.storedData = cart;
        this.cartData.totalItem = this.storedData.totalItem;
        this.cartData.totalPrice = this.storedData.totalPrice;
        if(cart?.restaurant?.uid == this.id){
          this.allItems.forEach((element:any) => {
            cart.items.forEach((element2:any)=>{
              if(element.id != element2.id) return;
              element.quantity = element2.quantity;
            });
          });
          this.cartData.items = this.allItems.filter((x:any) => x.quantity > 0);
          if(this.veg === true) this.items = this.allItems.filter((x:any)=>x.veg === true);
          else this.items = [...this.allItems];
        }else {
          this.allItems.forEach((element:any) => {
              element.quantity = 0;
          });
          if(this.veg == true) this.items = this.allItems.filter((x:any) => x.veg === true);
          else this.items = [...this.allItems];
        }
      }
    });
  }

  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe;
  }


  async getItems(){
    try {
      this.isLoading = true;
      this.data = {} as Restaurant;
      this.cartData = {};
      this.storedData = {};
      setTimeout(async() => {
        this.allItems = this.api.allItems;
        let data: any = this.api.restaurants1.filter(x => x.uid === this.id);
        this.data = data[0];
        this.categories = this.api.categories.filter(x => x.uid === this.id);
        this.allItems = this.api.allItems.filter(x => x.uid == this.id);
        this.allItems.forEach((element, index) => {
          this.allItems[index].quantity = 0;
        });
        this.items = [...this.allItems];
        await this.cartService.getCartData();
        this.isLoading = false;
      }, 500);
    } catch(e) {
      console.log(e);
    }
  }


  vegOnly($event:any){
    if ($event.detail.checked == true) {
      this.items = this.items.filter(x=>x.veg ==true);
    }else {
      this.items = this.allItems;
    }
  }

  quantityPlus(item:any){
    const index = this.allItems.findIndex((x:any) => x.id === item.id);
    if(!this.allItems[index].quantity || this.allItems[index].quantity == 0) {
      if(!this.storedData.restaurant || (this.storedData.restaurant && this.storedData.restaurant.uid == this.id)) {
        this.cartService.quantityPlus(index, this.allItems,this.data);
      } else {
        this.cartService.alertClearCart(index, this.allItems,this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.allItems,this.data);
    }
  }
  quantityMinus(item:any){
    const index = this.allItems.findIndex((x:any)=>x.id === item.id)
    this.cartService.quantityMinus(index);
  }

  async saveToCart(){
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      await Preferences.set({
        key:'cart',
        value:JSON.stringify(this.cartData)
      })
      this.cartService.saveCart()
    } catch (error) {
      console.log(error)
    }
  }

  async viewCart(){
    if(this.cartData.items && this.cartData.items.length > 0) await this.saveToCart();
    console.log('Router URL: ', this.router.url)
    this.router.navigate([this.router.url + '/cart'])
  }

  ionViewDidLeave() {
    console.log('Event [ionViewDidLeave] cart.page.ts');
    if(this.cartData?.items && this.cartData?.length > 0) this.cartService.saveCart();
  }
}



