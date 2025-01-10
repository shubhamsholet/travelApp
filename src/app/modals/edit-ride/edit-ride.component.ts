import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonLabel, IonItem, IonInput, IonButton, IonDatetime, ModalController, AlertController, IonHeader, IonToolbar, IonTitle, IonIcon } from "@ionic/angular/standalone";
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';

@Component({
  selector: 'app-edit-ride',
  templateUrl: './edit-ride.component.html',
  styleUrls: ['./edit-ride.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTitle, IonToolbar, IonHeader, IonDatetime, IonButton, IonInput, IonItem, IonLabel, IonContent, FormsModule],
})
export class EditRideComponent implements OnInit {

  private handleData = inject(HandleDataService);
  localStorageService = inject(LocalStorageService);
  private modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);
  // commonService = inject(CommonService);

  @Input() currentRideData: any;

  email: any

  price: number | undefined;
  seatAvl: number | undefined;
  time: string | undefined;
  currentUser: any
  currentUserDocId: any;
  constructor() { }
  ngOnInit() {
    console.log('currentRideData', this.currentRideData);

  }

  ionViewWillEnter() {
    this.email = this.currentRideData.riderEmail
    this.price = this.currentRideData.price
    this.seatAvl = this.currentRideData.seatAvl
    this.time = this.currentRideData.time
    console.log(" this.emai === ", this.email);
    this.handleData
      .userExists(this.email)
      .then((result) => {
        if (result.isExist) {
          this.handleData.user = result.data;
          console.log("this.handleData.user === ", this.handleData.user);
          this.currentUserDocId = this.localStorageService.getItem("currentUserDocId");
          // console.log("this.currentUserDocId === ", this.currentUserDocId);
          this.currentUser = this.handleData.user
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }


  async updateRide(form: NgForm) {
    if (form.valid) {
      // Check if at least one field has been updated
      const isPriceChanged = this.price !== this.currentRideData.price;
      const isSeatAvlChanged = this.seatAvl !== this.currentRideData.seatAvl;
      const isTimeChanged = this.time !== this.currentRideData.time;

      if (!isPriceChanged && !isSeatAvlChanged && !isTimeChanged) {
        const alert = await this.alertCtrl.create({
          header: 'No Changes Detected',
          message: 'At least one field must be changed to update the ride.',
          buttons: ['OK'],
          cssClass: 'alertNofieldChanged'
        });
        await alert.present();
        return;
      }

      // Seat availability check
      if (this.seatAvl && this.seatAvl > 6) {
        const alert = await this.alertCtrl.create({
          header: 'Invalid Seat Number',
          message: 'Seats must be less than 7.',
          buttons: ['OK'],
          cssClass: 'alertInvalidSeat'
        });
        await alert.present();
        return;
      }

      // Proceed with updating the ride
      const userRideList = this.currentUser.ride.rideList;
      const idToFind = this.currentRideData.id;
      const matchedRide = userRideList.find((ride: { id: string; }) => ride.id === idToFind);

      if (this.currentUser.userEmail === this.email) {
        if (matchedRide) {
          matchedRide.price = this.price;
          matchedRide.seatAvl = this.seatAvl;
          matchedRide.time = this.time;
          try {
            await this.handleData.updateDocumentField(this.currentUserDocId, 'ride', this.currentUser.ride);
            // Close the modal after a successful update
            // this.modalCtrl.dismiss();
            this.modalCtrl.dismiss({
              updatedRide: matchedRide
            });
          } catch (error) {
            console.error('Error updating document:', error);
          }
        } else {
          console.log('Element with id' + this.price + ' not found');
        }
      } else {
        console.log('ID not matched');
      }
    }
  }


  closeModal() {
    this.modalCtrl.dismiss();
  }

}
