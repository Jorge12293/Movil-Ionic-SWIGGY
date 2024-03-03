import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  banners:any[]=[];
  restaurants:Restaurant[]=[];
  isLoading:boolean=false;
  constructor(
    private api:ApiService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    setTimeout(()=>{
      this.banners = this.api.banners;
      this.restaurants = this.api.restaurants;
      this.isLoading = false;
    },500);
  }

}
