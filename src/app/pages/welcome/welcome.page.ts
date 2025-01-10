import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, ModalController, ToastController, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { LoginComponent } from 'src/app/modals/login/login.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { CommonService } from 'src/app/shared/common.service';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonButtons, IonMenuButton, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, RouterLinkActive,]
})
export class WelcomePage implements OnInit {
  public modalCtl = inject(ModalController)
  private handleData = inject(HandleDataService);
  localStorageService = inject(LocalStorageService);
  commonService = inject(CommonService);
  routes = inject(Router);
  toastController = inject(ToastController);
  private firestore: Firestore = inject(Firestore);
  currentUserData: any;
  isLoggedIn: boolean = false;

  constructor() {

  }

  ngOnInit() {
    console.log("welcome page");
  }
  ionViewWillEnter() {
    const currentUserEmail = this.commonService.currentUserEmail;
    console.log("currentUserEmail === ", currentUserEmail);
    this.handleData.userExists(currentUserEmail).then((res) => {
      this.currentUserData = res.data;
      console.log(" this.currentUserData === ", this.currentUserData);
      this.isLoggedIn = this.currentUserData ? true : false; // Set isLoggedIn based on user existence 
      console.log(" this.isLoggedIn === ", this.isLoggedIn);

    });
  }

  onNodesChanged(data: any[]): void {
    // Do something with the updated nodes
    console.log("Updated node data:", data);
  }

  async reqRide() {
    if (this.isLoggedIn) {
      this.routes.navigate(['/create-ride'])
    }
    else {
      const toast = await this.toastController.create({
        message: 'login before request a ride',
        duration: 1500,
        position: 'bottom',
      });

      await toast.present();
    }
  }

  async loginModal() {
    const modal = await this.modalCtl.create({
      component: LoginComponent,
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log("data", data, role);

  }






}


