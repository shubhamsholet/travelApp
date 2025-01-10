import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, arrowDown, star, search, home, person, pin, navigate, location, arrowForwardOutline, chevronForwardOutline, carSportOutline, addCircleOutline, checkmarkCircleOutline, call, create, chevronBackOutline, locate, starOutline, informationCircleOutline, exit, chatbubbles, wallet, cash, car, receiptOutline, calendarOutline, notificationsOutline, timer, carSport, personSharp, sadOutline, starHalfOutline, thumbsUpOutline } from 'ionicons/icons';
import { LocalStorageService, } from './shared/local-storage.service';
import { CommonService } from './shared/common.service';
import { HandleDataService } from './services/data/handle-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonBadge, RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, SocialLoginModule,],
})
export class AppComponent implements OnInit {
  public commonService = inject(CommonService)
  public localStr = inject(LocalStorageService)
  public router = inject(Router)
  private handleData = inject(HandleDataService)
  public appPages = [
    { title: 'Home', url: '/welcome', icon: 'home' },
    { title: 'Search Screen', url: '/search', icon: 'search' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    // { title: 'Feedback', url: '/feedback', icon: 'chatbubbles' },
    { title: 'Wallet', url: '/myWallet', icon: 'wallet' },
    { title: 'Create Ride', url: '/create-ride', icon: 'car' },
    { title: 'My Update', url: '/my-update', icon: 'receipt-outline' },
    { title: 'Notifications', url: '/notification', icon: 'notifications-outline' },

  ];

  datalist: any;
  notificationCount: any;


  ngOnInit(): void {
    // this.commonService.currentUser
    // this.notificationCount = this.localStr.getItem("currentUser").allNotification.length;
    this.updateNotificationCount()
  }
  updateNotificationCount(): void {
    const currentUser = this.localStr.getItem("currentUser");
    if (currentUser && currentUser.allNotification) {
      this.notificationCount = currentUser.allNotification.length;
    } else {
      this.notificationCount = 0;
    }
  }

  constructor() {
    addIcons({ close, arrowDown, star, search, home, person, pin, navigate, location, arrowForwardOutline, chevronForwardOutline, carSportOutline, addCircleOutline, checkmarkCircleOutline, call, create, chevronBackOutline, locate, starOutline, informationCircleOutline, exit, chatbubbles, wallet, cash, car, receiptOutline, calendarOutline, notificationsOutline, timer, carSport, personSharp, sadOutline, starHalfOutline, thumbsUpOutline });
    // console.log("localStorage.getItem(currentUser) === ", localStorage.getItem("currentUser"));
    const data: any = localStorage.getItem("currentUser");
    const parsedData: any = JSON.parse(data);
    // console.log("data === ", parsedData);

    if (this.localStr.getItem("googleUserLog")) {
      const user = this.localStr.getItem("googleUserLog")
      this.commonService.currentUserEmail = user.email
    }
    else if (parsedData) {
      const user = parsedData
      this.commonService.currentUserEmail = user.userEmail
    }
    else {
      this.commonService.currentUserEmail = "Your@email.com"
    }

    this.datalist = this.handleData.getData()

  }

  logOut() {
    this.localStr.clear();
    this.commonService.currentUserEmail = '';
    this.commonService.isUserLoggedin = false; // Set the login status to false
    this.router.navigate(['/welcome']);
  }


}
