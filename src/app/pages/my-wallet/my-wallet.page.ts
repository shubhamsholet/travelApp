import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import data from '../../../assets/dummy.json'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardHeader, IonAvatar, IonCardSubtitle, IonCardTitle, IonCard, IonItem, IonText, IonLabel, IonIcon, IonCol, IonRow, IonGrid, IonList, IonImg, IonButton, ModalController, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { TopWithdrawPage } from '../top-withdraw/top-withdraw.page';
import { CommonService } from 'src/app/shared/common.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { ReciptComponent } from 'src/app/modals/recipt/recipt.component';

@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.page.html',
  styleUrls: ['./my-wallet.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonImg, IonList, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonText, IonItem, IonCard, IonCardTitle, IonCardSubtitle, IonAvatar, IonCardHeader, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonMenuButton,]
})
export class MyWalletPage implements OnInit {


  properBalance: number = 0;
  userData: any;
  currentUserData: any;
  transactions: any[] = [];
  transactionList: any;
  userDataLength: any;
  numberOfTransactions: any = 5;
  latestTransaction: any;
  selectedTransactions: any;
  operation: any;
  topUpClicked: any = 'topUpClicked';
  withdrawClicked: any = 'withdrawClicked';
  mybalance: any;

  wallet: any = {
    balance: 0,
    transactions: {
      id: "",
      date: "",
      amount: 0,
      type: "",
      status: "",
      paidTo: "",
    },
    transactionsList: [] as { id: string; date: string; amount: number; type: string; status: string; paidTo: string; }[]
  }

  constructor(private router: Router, private modalCtrl: ModalController, private commonService: CommonService,
    public localStr: LocalStorageService, private handleData: HandleDataService) { }

  currentUser: any = '';
  ngOnInit() {
    // console.log("walletTransaction", this.wallet);
    console.log();


  }
  ionViewWillEnter() {
    const currentUserEmail = this.commonService.currentUserEmail;
    // Retrieve data from Firebase and store it in local storage
    this.handleData.userExists(currentUserEmail).then((res) => {
      console.log("res.data === ", res.data);
      this.currentUserData = res.data;
      // console.log(this.currentUserData);
      console.log("current user data", this.currentUserData);
      this.currentUser = res.data
      if (this.currentUser) {
        this.userData = this.currentUser;
        const length = Object.keys(this.currentUser).length;
        console.log('currentUser length: ', length);
        this.userDataLength = length
        console.log('currentUser: ', this.currentUser);
        const currentUserDocId = this.localStr.getItem("currentUserDocId");
        console.log("this.currentUser.wallet.balance === ", this.currentUser.wallet.balance);
        if (this.currentUser.wallet.balance != undefined) {
          console.log('yes it has balance ');
          this.wallet.balance = this.currentUser.wallet.balance
          this.wallet = {
            balance: this.currentUser.wallet.balance,
          }
          this.mybalance = this.wallet.balance.toFixed(2).toString();
          console.log(" this.mybalance === ", this.mybalance);
          let parts = this.mybalance.split('.');
          console.log("parts === ", parts);
          // Add commas to the integer part
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          // Recombine the integer and decimal parts
          let formattedBalance = parts.join('.');
          this.mybalance = formattedBalance
          console.log(' this.mybalance', this.mybalance);  // Output: "123,456,789.00"
        }
        else {
          console.log('you have to create it ');
          this.handleData.updateDocumentField(currentUserDocId, 'wallet', this.wallet)
        }

      } else {
        console.error("Error: currentUser data not found in local storage.");
      }

      this.transactionList = this.currentUserData.wallet.transactionsList
      console.log("transition list", this.transactionList);
      this.selectedTransactions = this.transactionList.slice(0, this.numberOfTransactions);
    }).catch((error) => {
      console.error("Error: ", error);
    });
  }
  goToWalletHistory() {
    this.router.navigate(['/wallet-history'])
  }
  topUp() {
    this.router.navigate(['/top-withdraw'], { state: { operation: this.topUpClicked } });
  }
  withdraw() {
    this.router.navigate(['/top-withdraw'], { state: { operation: this.withdrawClicked } });
  }

  async walletToRecipt(index: any) {
    const selectedPayment = this.selectedTransactions[index];
    const modal = await this.modalCtrl.create({
      component: ReciptComponent,
      cssClass: ["ReciptComponentCss", "ion-padding-horizontal"],
      componentProps: { userpaymentDetails: selectedPayment },
      // showBackdrop: true,
    });
    modal.present();
  }
}

