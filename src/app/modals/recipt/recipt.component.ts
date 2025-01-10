import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton, ModalController,
  IonBackButton, IonContent, IonCard, IonItem, IonCardHeader, IonIcon, IonLabel,
  IonCardContent, IonButton, IonItemDivider, IonAvatar
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipt',
  templateUrl: './recipt.component.html',
  styleUrls: ['./recipt.component.scss'],
  standalone: true,
  imports: [
    IonAvatar, IonItemDivider, IonButton, IonCardContent, IonLabel, IonIcon,
    IonCardHeader, IonItem, IonCard, IonContent, IonBackButton, IonTitle,
    IonButtons, IonToolbar, IonHeader, IonMenuButton, CommonModule
  ],
})
export class ReciptComponent implements OnInit {
  @Input() userpaymentDetails: any;

  public modalCtrl = inject(ModalController);

  constructor() { }

  formatID(id: string): string {
    let formattedID = id.replace("0.", "");
    if (formattedID.length < 12) {
      formattedID = formattedID.padEnd(12, '0');
    } else {
      formattedID = formattedID.slice(0, 12);
    }
    return formattedID;
  }

  ngOnInit() {
    if (this.userpaymentDetails && this.userpaymentDetails.id) {
      this.userpaymentDetails.id = this.formatID(this.userpaymentDetails.id);
    }
    console.log("userpaymentDetails === ", this.userpaymentDetails);
  }

  close() {
    return this.modalCtrl.dismiss(null, "close");
  }
}
