import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonIcon, ModalController, IonBackButton, IonAvatar, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonToggle, IonNote, IonList, IonListHeader, IonText, AlertController } from '@ionic/angular/standalone';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { CommonService } from 'src/app/shared/common.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';

@Component({
  selector: 'app-top-withdraw',
  templateUrl: './top-withdraw.page.html',
  styleUrls: ['./top-withdraw.page.scss'],
  standalone: true,
  imports: [IonText, IonListHeader, IonList, IonNote, IonToggle, IonInput, IonItem, IonCardContent, IonLabel, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard, IonButton, IonCol, IonRow, IonGrid, IonAvatar, IonBackButton, IonIcon, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, RouterLink]
})
export class TopWithdrawPage implements OnInit {

  private handleData = inject(HandleDataService);
  localStorageService = inject(LocalStorageService);
  commonService = inject(CommonService);

  email: any = this.commonService.currentUserEmail;
  users: any[] = [];
  userdata: any;
  transaction_data: any = [];
  amountToAdd: any;
  userBalance: any;
  operation: any;

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.operation = navigation.extras.state['operation'];
      console.log('Operation:', this.operation);
    }
  }

  ionViewWillEnter() {
    const currentUserDocId = this.localStorageService.getItem("currentUserDocId");
    console.log("currentUserDocId === ", currentUserDocId);
    this.handleData
      .userExists(this.email)
      .then((result) => {
        if (result.isExist) {
          this.handleData.user = result.data;
          console.log("User data:", result.data);
          this.userdata = result.data
          this.userBalance = this.userdata.wallet.balance
          console.log("  this.userdet === ", this.userdata);
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  @Output() updatedBalance = new EventEmitter<string>();
  addMoney() {
    if (this.amountToAdd > 0) {
      const currentUserDocId = this.localStorageService.getItem("currentUserDocId");
      this.userBalance += this.amountToAdd;
      this.userdata.wallet.balance = this.userBalance;
      this.userdata.wallet.transactions.id = Math.random().toString();
      this.userdata.wallet.transactions.paidTo = this.userdata.userName
      this.userdata.wallet.transactions.amount = this.amountToAdd
      // this.userdata.wallet.transactions.date = (new Date()).toISOString().slice(0, 10)
      this.userdata.wallet.transactions.date = (new Date()).toISOString()
      this.userdata.wallet.transactions.status = 'recieve'
      this.userdata.wallet.transactions.type = 'credit'

      const immutableTransaction = Object.freeze({ ...this.userdata.wallet.transactions });


      this.userdata.wallet.transactionsList.unshift(immutableTransaction);

      this.handleData.updateDocumentField(currentUserDocId, 'wallet', this.userdata.wallet)

      this.amountToAdd = null;


    } else {
      this.presentInvalidAmountAlert();
    }

  }
  withdrawMoney() {
    if (this.amountToAdd > 0 && this.amountToAdd <= this.userBalance && this.amountToAdd < 20000) {
      const currentUserDocId = this.localStorageService.getItem("currentUserDocId");
      this.userBalance -= this.amountToAdd;
      this.userdata.wallet.balance = this.userBalance;
      this.userdata.wallet.transactions.id = Math.random().toString();
      this.userdata.wallet.transactions.paidTo = this.userdata.userName
      this.userdata.wallet.transactions.amount = this.amountToAdd
      // this.userdata.wallet.transactions.date = (new Date()).toISOString().slice(0, 10)
      this.userdata.wallet.transactions.date = (new Date()).toISOString()
      this.userdata.wallet.transactions.status = 'paid'
      this.userdata.wallet.transactions.type = 'debit'

      const immutableTransaction = Object.freeze({ ...this.userdata.wallet.transactions });


      this.userdata.wallet.transactionsList.unshift(immutableTransaction);

      this.handleData.updateDocumentField(currentUserDocId, 'wallet', this.userdata.wallet)

      this.amountToAdd = null;


    } else {
      this.presentInvalidAmountAlert();
    }

  }


  async presentInvalidAmountAlert() {
    const alert = await this.alertController.create({
      header: 'Invalid Amount',
      message: 'Please enter a valid amount.',
      buttons: ['OK']
    });

    await alert.present();
  }


  goToWalletHistory() {
    this.router.navigate(['/wallet-history'])
  }


  // close() {
  //   this.modalCtrl.dismiss()
  // }

}

