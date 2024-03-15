import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile = new BehaviorSubject<User | null>(null);

  constructor() { }

  get profile(){
    return this._profile.asObservable();
  }

  updateProfile(profile:User,param:any){
    try {
      const data = new User(
        param.email,
        param.phone,
        profile.name
      );
      this._profile.next(data);
    } catch (error) {
      console.log(error);
      throw(error);
    }
  }
}
