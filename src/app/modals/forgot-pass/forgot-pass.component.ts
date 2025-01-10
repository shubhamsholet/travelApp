import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonTitle, IonToolbar, IonHeader, IonContent, IonInput]
})
export class ForgotPassComponent implements OnInit {
  public modalCtrl = inject(ModalController)

  constructor() { }

  ngOnInit() {
    console.log("forgot modal");
  }
  close() {
    return this.modalCtrl.dismiss(null, 'close');
  }

}
