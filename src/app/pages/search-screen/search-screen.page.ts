import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OverlayEventDetail } from '@ionic/core/components';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol, IonInput, IonButton, IonItem, IonLabel, IonModal, IonDatetime, IonDatetimeButton, IonIcon, IonButtons, IonMenuButton, IonImg, IonBackButton, ModalController } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { TravelFromToComponent } from 'src/app/components/travel-from-to/travel-from-to.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/shared/common.service';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';

@Component({
  selector: 'app-search-screen',
  templateUrl: './search-screen.page.html',
  styleUrls: ['./search-screen.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonImg, IonButtons, IonIcon, IonDatetimeButton, IonDatetime, IonModal, IonLabel, IonItem, IonButton, IonInput, IonCol, IonRow, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, TravelFromToComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SearchScreenPage implements OnInit {

  routes = inject(Router)
  allRideLists: any[] = [];

  @ViewChild(IonModal)
  modal!: IonModal;
  currentUserData: any;
  minDate: string | undefined;
  from: any;
  to: any;
  errorMessage: string | undefined;
  rideList: any;
  filteredRides: any;
  // allUserData: Promise<{ [x: string]: { [x: string]: any; }; }[]>;

  constructor(private router: Router, private modalCtrl: ModalController, private commonService: CommonService,
    public localStr: LocalStorageService, private handleData: HandleDataService) {

  }
  time: string = '';
  date: any = ''
  passengers: number = 1;
  currentDate: any;
  currentTime: any;


  ngOnInit() {

    this.loadAllRides()
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.currentTime = today.toISOString().split('T')[1];
    this.minDate = this.currentDate;
    this.date = this.minDate;
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    this.time = `${hours}:${minutes}`;

    console.log("this.time === ", this.time);
  }

  async loadAllRides() {
    await this.handleData.getData();
    const allRideData = this.handleData.getAllRideLists()
    const filteredRides = allRideData.filter((ride: { status: string; }) => ride.status === "created");
    this.rideList = filteredRides;
    console.log("this.rideLists ", this.rideList);
  }

  isInputRequired: boolean = true;

  onLocationsChanged(event: { from: string, to: string }) {
    this.from = event.from;
    this.to = event.to;
    // console.log('Locations changed:', this.from, this.to);
  }

  search() {
    this.onLocationsChanged({ from: this.from, to: this.to });
    if (!this.date || !this.time || this.passengers <= 0 || !this.from || !this.to) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const searchData = {
      date: this.date,
      time: this.time,
      passengers: this.passengers,
      from: this.from,
      to: this.to
    };

    // console.log('searchData===', searchData);
    console.log("this.time === ", this.time);

    this.filteredRides = this.rideList.filter((ride: any) => {

      const rideDateMatches = ride.date >= searchData.date;

      // const rideTimeMatches = ride.time >= searchData.time;

      const rideFromMatches = ride.from.toLowerCase() === searchData.from.toLowerCase();

      const rideToMatches = ride.to.toLowerCase() === searchData.to.toLowerCase();
      const rideHasEnoughSeats = ride.seatAvl >= searchData.passengers;
      // return rideDateMatches && rideTimeMatches && rideFromMatches && rideToMatches && rideHasEnoughSeats;
      return rideDateMatches && rideFromMatches && rideToMatches && rideHasEnoughSeats;
    });


    this.router.navigate(['/home'], { state: { searchData: searchData, filteredRides: this.filteredRides } });

  }



  incPassengers() {
    if (this.passengers < 7) {
      this.passengers++
    }
  }

  decPassengers() {
    if (this.passengers > 1) {
      this.passengers--
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    const passengersNumber = Number(this.passengers);
    const error = document.getElementById('errorHere');

    if (!isNaN(passengersNumber) && passengersNumber > 0 && passengersNumber <= 6) {
      this.modal.dismiss(this.passengers, 'confirm');
    } else {
      if (error) {
        if (isNaN(passengersNumber)) {
          error.textContent = `Please enter a valid number of passengerss.`;
        } else if (passengersNumber <= 0) {
          error.textContent = `The number of passengerss must be greater than 0.`;
        } else {
          error.textContent = `The number of passengerss must be less than or equal to 6.`;
        }
      }
    }
  }


}
