import { Injectable } from '@angular/core';
import { AlertButton, AlertController, IonicSafeString, LoadingController, ModalController, ModalOptions, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }


  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?:string | undefined, buttonArray?: (string | AlertButton)[] | undefined) {
    this.alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      buttons: buttonArray ? buttonArray : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  async showToast(msg:string, color:any, position:"top" | "bottom" | "middle", duration:number = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  errorToast(msg?:string, duration = 4000) {
    this.showToast(msg ? msg : 'No Internet Connection', 'danger', 'bottom', duration);
  }

  successToast(msg:string) {
    this.showToast(msg, 'success', 'bottom');
  }

  async showLoader(msg?:string, spinner?:any) {
    if(!this.isLoading) this.setLoader();
    return this.loadingCtrl.create({
      message: msg,
      spinner: spinner ? spinner : 'bubbles'
    }).then(res => {
      res.present().then(() => {
        if(!this.isLoading) {
          res.dismiss().then(() => {
            console.log('abort presenting');
          });
        }
      })
    })
    .catch((e:any) => {
      console.log('show loading error: ', e);
    });
  }

  async hideLoader() {
    if(this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss()
    .then(() => console.log('dismissed'))
    .catch((e:any) => console.log('error hide loader: ', e));
  }

  async createModal(options:ModalOptions) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  modalDismiss(val?:any) {
    let data: any = val ? val : null;
    this.modalCtrl.dismiss(data);
  }

  getIcon(title:string) {
    const name = title.toLowerCase();
    switch(name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline';
      default: return 'location-outline';
    }
  }
}
