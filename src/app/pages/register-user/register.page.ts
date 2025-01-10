import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonRow,
  IonCol,
  IonMenuButton,
  IonInput,
  IonItem,
  IonInputPasswordToggle,
  IonButton,
  IonBackButton,
  IonAvatar,
} from "@ionic/angular/standalone";
import { SocialLoginService } from "src/app/services/auth/social-login.service";
import { LocalStorageService } from "src/app/shared/local-storage.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/shared/common.service";
import { HandleDataService } from "src/app/services/data/handle-data.service";
import { Observable } from "rxjs";

declare var google: any;
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
  standalone: true,
  imports: [
    IonAvatar,
    IonBackButton,
    IonButton,
    IonItem,
    IonInput,
    IonCol,
    IonRow,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInputPasswordToggle,
  ],
  providers: [GooglePlaceModule],
})
export class RegisterPage implements OnInit {
  private socialLogin = inject(SocialLoginService);
  public localStr = inject(LocalStorageService);
  public router = inject(Router);
  public commonService = inject(CommonService);
  private handleData = inject(HandleDataService);

  users: any;

  isSocialLogin: boolean = false;
  email_verified: boolean = false;

  pickUpLocation: any;
  dropLocation: any;

  userData: any = {
    profilePicture: "",
    userEmail: "",
    userName: "",
    password: "",
    cpassword: "",
    phone: "",
    // pickUpLocation: "",
    // dropLocation: "",
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
    allNotification: []
  };

  constructor() { }

  async ngOnInit() {
    this.users = this.handleData.getData();
    //google login
    try {
      const res = await this.socialLogin.googleLogin("google");
      this.localStr.setItem("googleUserLog", JSON.parse(res));
      const googleLogin = this.localStr.getItem("googleUserLog");

      if (googleLogin) {
        console.log("googleLogin === ", googleLogin);
        this.userData.userEmail = googleLogin.email;
        this.userData.userName = googleLogin.name;
        this.userData.profilePicture = googleLogin.picture;
        this.userData.isSocialLogin = true;
        this.userData.email_verified = googleLogin.email_verified;
      }
    } catch (error: any) {
      console.log(error);
      this.commonService.alertBox(error, "Register alert", ["Ok"]);
    }
    //google login
  }

  passCheck = false;
  validatePassword() {
    if (this.userData.password != this.userData.cpassword) {
      this.passCheck = true;
    } else {
      this.passCheck = false;
    }
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const email = this.userData.userEmail;
      console.log("email === ", email);

      await this.handleData
        .userExists(email)
        .then(async (res) => {
          console.log(res);
          if (res.isExist) {
            this.commonService.alertBox(
              "User Already Exist",
              "Registration alert",
              ["Ok"]
            );
          } else {
            const pass = form.value.password;
            this.userData.password = this.handleData.encryptPass(pass);
            delete this.userData["cpassword"];
            console.log("this.userData === ", this.userData);
            await this.handleData.addUser(this.userData);
            // const data = { [email]: { ...this.userData } };
            this.localStr.setItem("currentUser", this.userData);
            this.commonService.isUserLoggedin = true;
            this.commonService.currentUserEmail = email;
            const isUserLoggedIn = this.commonService.isUserLoggedin;
            this.localStr.setItem("isUserLoggedIn", isUserLoggedIn);
            this.router.navigate(["/welcome"]);
            this.commonService.alertBox(
              "Registration Successfully",
              "Registration alert",
              ["Ok"]
            );
            form.reset();
            this.handleData.functionToSubscribeUser()
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      this.commonService.alertBox("Form is invalid", "Form alert", ["Ok"]);
    }
  }

  //Facebook login
  async facebookLogin() {
    try {
      this.socialLogin
        .facebookLogin()
        .then((faceBookUser) => {
          console.log("Facebook login successful:", faceBookUser);
          let fBUser = faceBookUser;
          this.localStr.setItem("faceBookUserLog", fBUser);

          if (fBUser) {
            this.userData.userEmail = fBUser.email;
            this.userData.userName = fBUser.name;
            this.userData.profilePicture = fBUser.photoUrl;
            this.userData.email_verified = true;
            this.userData.isSocialLogin = true;
          }
        })
        .catch((err) => {
          console.error("Error during Facebook login:", err);
        });
    } catch (error: any) {
      this.commonService.alertBox(error, "Register alert", ["Ok"]);
    }
  }
  //Facebook login

  ionViewWillEnter() {
    this.pickUpLoc();
    this.dropLoc();
  }

  pickUpLoc() {
    let inputElement = document.getElementById("pickUpLocation");
    if (inputElement) {
      let input = inputElement.getElementsByTagName("input")[0];
      let autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        // retrieve the place object for your use
        let place = autocomplete.getPlace();
        console.log("google place called", place);
        this.pickUpLocation = place.formatted_address;
        // for (var i = 0; i < place.address_components.length; i++) {
        //   for (var j = 0; j < place.address_components[i].types.length; j++) {
        //     if (place.address_components[i].types[j] == "postal_code") {
        //       this.pincode = place.address_components[i].long_name;
        //     }
        //     if (place.address_components[i].types[j] == "locality") {
        //       this.city = place.address_components[i].long_name;
        //       console.log("enter in locality if", this.city);
        //     }
        //   }
        // }
        // this.locationName = place.formatted_address;
      });
    }
  }
  dropLoc() {
    let inputElement = document.getElementById("dropLocation");
    if (inputElement) {
      let input = inputElement.getElementsByTagName("input")[0];
      let autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        // retrieve the place object for your use
        let place = autocomplete.getPlace();
        console.log("google place called", place);
        this.dropLocation = place.formatted_address;
        // for (var i = 0; i < place.address_components.length; i++) {
        //   for (var j = 0; j < place.address_components[i].types.length; j++) {
        //     if (place.address_components[i].types[j] == "postal_code") {
        //       this.pincode = place.address_components[i].long_name;
        //     }
        //     if (place.address_components[i].types[j] == "locality") {
        //       this.city = place.address_components[i].long_name;
        //       console.log("enter in locality if", this.city);
        //     }
        //   }
        // }
        // this.locationName = place.formatted_address;
      });
    }
  }
}

// strongly typed dataStructure for user Data
// userData: UserData = new UserData()

// export class UserData {
//   userEmail: string;
//   userName: string;
//   password: string;
//   cpassword: string;
//   phone: number;
//   pickUpLocation: string;
//   dropLocation: string;
//   isSocialLogin: boolean;
//   email_verified: boolean;
//   constructor() {
//     this.userEmail = "";
//     this.userName = "";
//     this.password = "";
//     this.cpassword = "";
//     this.phone = 0;
//     this.pickUpLocation = "";
//     this.dropLocation = "";
//     this.isSocialLogin = false;
//     this.email_verified = false
//   }
// }
