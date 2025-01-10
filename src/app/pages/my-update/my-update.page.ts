import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonRow, IonCol, IonCardContent, IonAvatar, IonItem, IonBadge, IonLabel, ModalController, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { HandleDataService } from 'src/app/services/data/handle-data.service';

@Component({
  selector: 'app-my-update',
  templateUrl: './my-update.page.html',
  styleUrls: ['./my-update.page.scss'],
  standalone: true,
  imports: [IonButtons, IonLabel, IonBadge, IonMenuButton, IonItem, IonAvatar, IonCardContent, IonCol, IonRow, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})


export class MyUpdatePage implements OnInit {


  journeyDuration: string | null = null;
  currentUserData: any;
  currentUser: any;
  userData: any;
  rideList: any;
  // userDataLength: number;

  constructor(private router: Router, private modalCtrl: ModalController, private commonService: CommonService,
    public localStr: LocalStorageService, private handleData: HandleDataService) {

  }

  ngOnInit() {

    this.updateRideStatuses();

    const currentUserEmail = this.commonService.currentUserEmail;

    // Retrieve data from Firebase and store it in local storage
    this.handleData.userExists(currentUserEmail).then((res) => {
      console.log("res.data === ", res.data);
      this.currentUserData = res.data;
      console.log("this.currentUserData.profile", this.currentUserData['profilePicture']);

      console.log("this.currentUserData === ", this.currentUserData);


      this.rideList = this.currentUserData.ride.rideList;
      console.log("this.rideList", this.rideList);

      if (this.currentUserData) {
        const length = Object.keys(this.currentUserData);
        // console.log('currentUserData length: ', length);
      }
    })
  }

  updateRideStatuses() {
    const now = new Date();
    if (this.rideList) {
      this.rideList.forEach((ride: any) => {
        const [endHours, endMinutes] = ride.journeyEnd.split(':').map(Number);
        const rideDate = new Date(`${ride.date.split('/').reverse().join('-')}T${endHours}:${endMinutes}:00`);

        if (rideDate <= now) {
          ride.rideStatus = 'completed';
        } else {
          ride.rideStatus = 'in-progress';
        }
      });
    }
  }


  // calculateJourneyDuration(index: number) {
  //   const journeyStart = this.rideList[index].journeyStart;
  //   const journeyEnd = this.rideList[index].journeyEnd;
  //   const dateInData = this.rideList[index].date;

  //   // Create a Date object from the dateInData
  //   const [day, month, year] = dateInData.split('/').map(Number);
  //   const date = new Date(year, month - 1, day);

  //   // Set hours and minutes for journeyStart and journeyEnd
  //   const [startHours, startMinutes] = journeyStart.split(':').map(Number);
  //   const [endHours, endMinutes] = journeyEnd.split(':').map(Number);

  //   const start = new Date(date);
  //   start.setHours(startHours, startMinutes);

  //   const end = new Date(date);
  //   end.setHours(endHours, endMinutes);

  //   const diffMs = end.getTime() - start.getTime();

  //   const diffHrs = Math.floor(diffMs / 3600000); // 1 hour = 3600000 ms
  //   const diffMins = Math.round((diffMs % 3600000) / 60000); // 1 minute = 60000 ms

  //   // Format the duration as HH:MM
  //   const formattedHours = diffHrs.toString().padStart(2, '0');
  //   const formattedMinutes = diffMins.toString().padStart(2, '0');

  //   this.journeyDuration = `${formattedHours}h ${formattedMinutes}m`;
  //   console.log("this.journeyDuration", this.journeyDuration);
  // }



  // rideDetailView() {
  //   this.router.navigate(['/ride-detail-view'])
  // }
  rideDetailView(index: number) {
    const selectedRide = this.rideList[index];
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ride: JSON.stringify(selectedRide)
      }
    };
    this.router.navigate(['/ride-detail-view'], navigationExtras);
  }
}
