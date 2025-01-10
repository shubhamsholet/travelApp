import { Component, inject, Input, OnInit } from '@angular/core';
import { addIcons } from "ionicons";
import {
  IonCard, IonInput, IonRow, IonCol, IonTitle, IonSelect,
  IonSelectOption, IonButton, IonFooter, IonContent,
  ModalController, IonHeader, IonToolbar, IonIcon
} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { close } from "ionicons/icons";

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss'],
  standalone: true,
  imports: [IonIcon, IonToolbar, IonHeader, IonContent, IonFooter, IonButton, IonTitle, IonCol, IonRow, IonInput, IonCard, IonSelect,
    IonSelectOption, FormsModule,]
})
export class EditVehicleComponent implements OnInit {

  @Input() data: any;
  @Input() selectedVehicle: any;

  vehicleType: any = "";
  vehicleNumber: any = "";
  vehicleName: any = "";
  vehicleColor: any = '';
  vehicleList: any;

  public modalCtrl = inject(ModalController);
  private handleData = inject(HandleDataService);
  private localStr = inject(LocalStorageService);

  constructor() {
    addIcons({ close });
  }

  ngOnInit() {
    console.log("this.data.vehicle === ", this.data.vehicle);
    // console.log("this.data.vehicle === ", this.data.vehicle);
    console.log("selectedVehicle === ", this.selectedVehicle);

    // To show the data of selected car in input field we did this or if we want empty fields we can comment/remove these lines
    this.vehicleType = this.selectedVehicle.vehicleType
    this.vehicleColor = this.selectedVehicle.vehicleColor
    this.vehicleName = this.selectedVehicle.vehicleName
    this.vehicleNumber = this.selectedVehicle.vehicleNumber

  }

  async updateVehicle() {
    const matchedVehicle = this.selectedVehicle;
    console.log("matchedVehicle === ", matchedVehicle);

    if (matchedVehicle) {
      matchedVehicle.vehicleType = this.vehicleType;
      matchedVehicle.vehicleName = this.vehicleName;
      matchedVehicle.vehicleColor = this.vehicleColor;
      const currentUserDocId = this.localStr.getItem("currentUserDocId");
      await this.handleData.updateDocumentField(currentUserDocId, 'vehicle', this.data.vehicle);

      // Pass the updated vehicle back to the parent component
      this.modalCtrl.dismiss(this.data.vehicle); // Passing the updated data
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}