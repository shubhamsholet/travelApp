import { Component, inject, OnInit } from "@angular/core";
import {
  IonInput,
  IonInputPasswordToggle,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  ModalController,
  IonIcon,
  IonButton,
  IonCol,
  IonRow,
  IonAvatar,
} from "@ionic/angular/standalone";
import { ForgotPassComponent } from "../forgot-pass/forgot-pass.component";
import { Router } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SocialLoginService } from "src/app/services/auth/social-login.service";
import { LocalStorageService } from "src/app/shared/local-storage.service";
import { from, Observable } from "rxjs";
import { CommonService } from "src/app/shared/common.service";
import { HandleDataService } from "src/app/services/data/handle-data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    IonAvatar,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    FormsModule,
    CommonModule,
  ],
})
export class LoginComponent implements OnInit {
  public modalCtrl = inject(ModalController);
  public router = inject(Router);
  private socialLogin = inject(SocialLoginService);
  public localStr = inject(LocalStorageService);
  public commonService = inject(CommonService);
  private handleData = inject(HandleDataService);

  users: any;
  // users$: Observable<any[]> = new Observable();

  isSocialLogin: boolean = false;
  email_verified: boolean = false;

  userData: any = {
    profilePicture: "",
    userEmail: "",
    userName: "",
    password: "",
    cpassword: "",
    phone: "",
    pickUpLocation: "",
    dropLocation: "",
    isSocialLogin: this.isSocialLogin,
    email_verified: this.email_verified,
    ride: {
      lastride: {
        id: '',
        ridername: '',
        riderpicture: '',
        riderEmail: '',
        riderUserId: '',
        time: '',
        type: '',
        from: '',
        to: '',
        date: '',
        seatAvl: '',
        price: '',
        companionNames: '',
        duration: '',
        distance: '',
        status: '',
        vehicle: '',
        passengerList: [],
        travelDetails: {
          startlocation: '',
          endlocation: '',
          startTime: '',
          endTime: '',
          distanceTravelled: '',
          traveledTime: '',
          discripencyFlag: false,
          agreement: false
        }
      },
      rideList: [],
    },
    wallet: {},
    isNotification: false,
    notificationList: [],
    allNotification: [],
    // driverFeedback =[
    //   {
    //     feedbackId: '',
    //     userId: '',
    //     userName: '',
    //     rideId: '',
    //     rating: undefined,
    //     comment: '',
    //     feedbackDetails: {
    //       behavior: '',
    //       cleanliness: '',
    //       punctuality: '',
    //       drivingSkill: '',
    //     },
    //     feedbackDate: ''
    //   },

    // ];
  };

  constructor() { }

  async ngOnInit() {
    this.users = this.handleData.getData();

    // googleLogin
    await this.socialLogin
      .googleLogin("google")
      .then(async (res) => {
        this.localStr.setItem("googleUserLog", JSON.parse(res));
        const googleLogin = this.localStr.getItem("googleUserLog");

        if (googleLogin) {
          console.log("googleLogin === ", googleLogin);
          this.userData.userEmail = googleLogin.email;

          await this.handleData
            .userExists(this.userData.userEmail)
            .then(async (res) => {
              console.log(res);
              if (res.isExist) {
                let currentUser = res.data;
                if (currentUser) {
                  this.localStr.setItem("currentUser", currentUser);
                } else {
                  this.localStr.setItem("currentUser", googleLogin);
                }
                this.commonService.isUserLoggedin = true;
                this.commonService.currentUserEmail = this.userData.userEmail;
                const isUserLoggedIn = this.commonService.isUserLoggedin;
                this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
                this.close();
                // this.router.navigate(["/home"]);
                location.reload();

                this.router.navigate(["/welcome"]);
                this.handleData.functionToSubscribeUser()
              } else {
                this.userData.email_verified = googleLogin.email_verified;
                this.userData.profilePicture = googleLogin.picture;
                this.userData.userName = googleLogin.name;
                this.userData.isSocialLogin = true;
                delete this.userData["cpassword"];
                await this.handleData.addUser(this.userData);
                this.localStr.setItem("currentUser", this.userData);
                this.commonService.isUserLoggedin = true;
                this.commonService.currentUserEmail = this.userData.userEmail;
                const isUserLoggedIn = this.commonService.isUserLoggedin;
                this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
                // this.router.navigate(["/home"]);
                this.router.navigate(["/welcome"]);
                this.close();
                this.commonService.alertBox(
                  "Account created successfully",
                  "Log in",
                  ["Ok"]
                );
                this.handleData.functionToSubscribeUser()
              }
            })
            .catch((error) => console.log(error));

          // this.handleData
          //   .checkUserExists(this.userData.userEmail)
          //   .subscribe((userExist) => {
          //     if (userExist) {
          //       console.log("userExist === ", userExist);
          //       let currentUser = this.handleData.user;
          //       if (currentUser) {
          //         this.localStr.setItem("currentUser", currentUser);
          //       } else {
          //         this.localStr.setItem("currentUser", googleLogin);
          //       }
          //       this.commonService.isUserLoggedin = true;
          //       this.commonService.currentUserEmail = this.userData.userEmail;
          //       const isUserLoggedIn = this.commonService.isUserLoggedin;
          //       this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
          //       this.close();
          //       this.router.navigate(["/home"]);
          //     } else {
          //       this.userData.email_verified = googleLogin.email_verified
          //       this.userData.profilePicture = googleLogin.picture
          //       this.userData.userName = googleLogin.name;
          //       this.userData.isSocialLogin = true
          //       const data = { [this.userData.userEmail]: { ...this.userData } };
          //       console.log("data === ", data);
          //       this.handleData.addUser(data).subscribe(() => {
          //         this.localStr.setItem('currentUser', data);
          //         this.commonService.isUserLoggedin = true;
          //         this.commonService.currentUserEmail = this.userData.userEmail;
          //         const isUserLoggedIn = this.commonService.isUserLoggedin;
          //         this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
          //         this.router.navigate(['/home']);
          //         this.close()
          //         this.commonService.alertBox("Account created successfully", "Log in", ["Ok"]);
          //       });
          //     }
          //   });
        }
      })
      .catch((error) => console.log(error));
    // googleLogin
  }

  // formLogin
  onSubmit(form: NgForm) {
    if (form.valid) {
      let userEmail = form.value.email;
      let pass = form.value.password;
      this.userData.password = this.handleData.encryptPass(pass);
      console.log("this.userData.password === ", this.userData.password);
      this.handleData
        .userExists(userEmail)
        .then((res) => {

          console.log(res);
          if (res.data) {
            if (res.data.password === this.userData.password) {

              // console.log("res.data === ", res.data);

              // let currentUser = res.data;             

              this.commonService.currentUserEmail = userEmail;
              this.commonService.isUserLoggedin = true;
              this.localStr.setItem("currentUser", res.data);
              const isUserLoggedIn = this.commonService.isUserLoggedin;
              this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
              this.close();
              location.reload();

              this.router.navigate(["/welcome"]);
              this.handleData.functionToSubscribeUser()
            } else {
              this.commonService.alertBox(
                "Login credentials invalid",
                "Login alert",
                ["Ok"]
              );
              // this.close();
              // this.router.navigate(["/register"]);
            }
          } else {
            this.commonService.alertBox(
              "Please create your account",
              "Login alert",
              ["Ok"]
            );
            this.close();
            this.router.navigate(["/register"]);
          }
        })
        .catch((e) => {
          this.commonService.alertBox(e, "Login alert", ["Ok"]);
          this.close();
        });
    } else {
      this.commonService.alertBox("Form is invalid", "Log in Alert", ["Ok"]);
    }
  }

  // formLogin

  // facebookLogin
  async facebookLogin() {
    try {
      this.socialLogin
        .facebookLogin()
        .then(async (faceBookUser) => {
          console.log("Facebook login successful:", faceBookUser);
          let fBUser = faceBookUser;
          this.localStr.setItem("faceBookUserLog", fBUser);

          if (fBUser) {
            console.log("fBUser === ", fBUser);
            this.userData.userEmail = fBUser.email;

            await this.handleData
              .userExists(this.userData.userEmail)
              .then(async (res) => {
                console.log(res);
                if (res.isExist) {
                  let currentUser = res.data;
                  if (currentUser) {
                    this.localStr.setItem("currentUser", currentUser);
                  } else {
                    this.localStr.setItem("currentUser", fBUser);
                  }
                  this.commonService.isUserLoggedin = true;
                  this.commonService.currentUserEmail = this.userData.userEmail;
                  const isUserLoggedIn = this.commonService.isUserLoggedin;
                  this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
                  this.close();

                  this.router.navigate(["/welcome"]);
                  location.reload();

                  // window.location.href = "/welcome";
                  this.handleData.functionToSubscribeUser()
                } else {
                  this.userData.email_verified = true;
                  this.userData.isSocialLogin = true;
                  this.userData.profilePicture = fBUser.photoUrl;
                  this.userData.userName = fBUser.name;
                  delete this.userData["cpassword"];
                  await this.handleData.addUser(this.userData);
                  this.localStr.setItem("currentUser", this.userData);
                  this.commonService.isUserLoggedin = true;
                  this.commonService.currentUserEmail = this.userData.userEmail;
                  const isUserLoggedIn = this.commonService.isUserLoggedin;
                  this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
                  location.reload();

                  this.router.navigate(["/welcome"]);
                  this.close();
                  this.commonService.alertBox(
                    "Account created successfully",
                    "Log in",
                    ["Ok"]
                  );
                  this.handleData.functionToSubscribeUser()
                }
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((err) => {
          console.error("Error during Facebook login:", err);
        });
    } catch (error: any) {
      this.commonService.alertBox(error, "Login alert", ["Ok"]);
    }
  }
  // facebookLogin

  // login modal
  close() {
    return this.modalCtrl.dismiss(null, "close");
  }
  async forgotPassModal() {
    const modal = await this.modalCtrl.create({
      component: ForgotPassComponent,
      cssClass: ["forgotPassModalCss", "ion-padding-horizontal"],
      showBackdrop: true,
    });
    modal.present();
  }
  registerUser() {
    this.close();
    this.router.navigate(["/register"]);
  }
}
