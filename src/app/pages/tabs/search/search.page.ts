import { Component, OnInit, ViewChild } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput') searchInput: any;
  querySearch: string = '';
  model: any = {
    icon: 'search-outline',
    title: 'No Restaurants Record Found'
  };
  isLoading: boolean = false;
  allRestaurants: Restaurant[] = [];
  restaurants: Restaurant[] = [];

  constructor(
    private api:ApiService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.allRestaurants = this.api.allRestaurants;
      this.searchInput.setFocus();
    }, 500);
  }

  async onSearchChange($event: any) {
    this.querySearch = $event.detail.value ?? '';
    this.restaurants = [];
    if (this.querySearch.length == 0) return;
    this.isLoading = true
    setTimeout(() => {
      this.restaurants = this.allRestaurants.filter((element: Restaurant) => element.short_name.includes(this.querySearch.toLowerCase()))
      this.isLoading = false;
    }, 500);

  }
}
