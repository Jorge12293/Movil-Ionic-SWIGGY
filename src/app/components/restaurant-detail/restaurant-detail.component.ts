import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss'],
})
export class RestaurantDetailComponent  implements OnInit {
  @Input() data!:Restaurant;
  @Input() isLoading:boolean=false;

  constructor() { }

  ngOnInit() {}

  getCuisine(cuisine:any){
    return cuisine.join(', ')
  }

}
