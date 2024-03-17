import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileService } from '../../services/profile/profile.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  @Input() profile: any = {};
  @ViewChild('phoneInput', { static: false }) phoneInput!: IonInput;
  isSubmitted: boolean = false;

  constructor(
    private profileService: ProfileService,
    private global: GlobalService
  ) { }

  ngOnInit() {
    setTimeout(()=>{
      if (this.phoneInput) {
        this.phoneInput.setFocus();
      }
    },500);
  }

  async onSubmit(form: NgForm) {
    try {
      if (!form.valid) {
        return;
      }
      console.log(form.value)
      this.isSubmitted = true;
      setTimeout(async () => {
        await this.profileService.updateProfile(this.profile, form.value);
        this.global.modalDismiss();
        this.isSubmitted = false;
      },1000);
    } catch (error) {
      console.log(error)
      this.global.errorToast();
    }
  }
}
