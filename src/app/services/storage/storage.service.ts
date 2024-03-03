import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setStorage(key:string,value:string){
    await Preferences.set({key:key,value:value});
  }

  async getStorage(key:string){
    return await Preferences.get({key:key});
  }

  async removeStorage(key:string){
    await Preferences.remove({key:key});
  }

  async clearStorage(){
    await Preferences.clear();
  }
}
