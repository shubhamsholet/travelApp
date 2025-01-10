import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonMenuButton, ModalController, ToastController, IonRow, IonCol, IonCard, IonIcon } from '@ionic/angular/standalone';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { CommonService } from 'src/app/shared/common.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCard, IonCol, IonRow, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton]
})
export class NotificationPage implements OnInit {
  handleData = inject(HandleDataService);
  localStorageService = inject(LocalStorageService);
  commonService = inject(CommonService);
  private router = inject(Router);
  currentUserData: any;
  isLoggedIn: boolean | undefined;
  allnotfication: any
  constructor() { }

  ngOnInit() {
    console.log();

  }

  ionViewWillEnter() {
    const currentUserEmail = this.commonService.currentUserEmail;
    console.log("currentUserEmail === ", currentUserEmail);
    this.handleData.userExists(currentUserEmail).then((res) => {
      this.currentUserData = res.data;
      console.log(" this.currentUserData === ", this.currentUserData);
      this.isLoggedIn = this.currentUserData ? true : false; // Set isLoggedIn based on user existence 
      console.log(" this.isLoggedIn === ", this.isLoggedIn);
      this.allnotfication = this.currentUserData.allNotification
      console.log(" this.allnotfication === ", this.allnotfication);
    });
  }

  checkNotification(index: any) {
    const selectedRide = this.allnotfication[index].Ridedata;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ride: JSON.stringify(selectedRide)
      }
    };
    this.router.navigate(['/ride-detail-view'], navigationExtras);
  }

}
