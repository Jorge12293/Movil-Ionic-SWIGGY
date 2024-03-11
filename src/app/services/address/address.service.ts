import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address | null>(null);

  constructor(
    private api: ApiService
  ) { }

  get addresses() {
    return this._addresses.asObservable();
  }

  get addressChange(){
    return this._addressChange.asObservable();
  }

  getAddresses(limit?:number) {
    try {
      let allAddress: Address[] = this.api.addresses;
      if(limit){
        let address : Address[] = [];
        let length = limit;
        if(allAddress.length < limit){
          length = allAddress.length;
        }
        for(let i = 0; i < length; i++){
          address.push(allAddress[i]);
        }
        allAddress = address;
      }
      this._addresses.next(allAddress);
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  addAddress(param: any) {
    param.id = 'address1';
    param.user_id = 'user1';
    const currentAddresses = this._addresses.value;
    const data = new Address(
      param.id,
      param.user_id,
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    currentAddresses.push(data);
    this._addresses.next(currentAddresses);
    this._addressChange.next(data);
  }

  updateAddress(id:string, param:any) {
    param.id = id;
    let currentAddresses = this._addresses.value;
    const index = currentAddresses.findIndex(x => x.id == id);
    const data =  new Address(
      id,
      param.user_id,
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    currentAddresses[index] = data;
    this._addresses.next(currentAddresses);
    this._addressChange.next(data);
  }

  deleteAddress(param: any) {
    let currentAddresses = this._addresses.value;
    currentAddresses = currentAddresses.filter(x => x.id != param.id);
    this._addresses.next(currentAddresses);
  }

  changeAddress(address:Address){
    this._addressChange.next(address);
  }

}
