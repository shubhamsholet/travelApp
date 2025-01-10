import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  ModalController,
  IonHeader,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonCard,
  IonCol,
  IonInput,
  IonRow,
  IonInputPasswordToggle,
  IonToggle,
  IonFooter,
  IonSelect,
  IonSelectOption,
} from "@ionic/angular/standalone";
import { HandleDataService } from "src/app/services/data/handle-data.service";
import { LocalStorageService } from "src/app/shared/local-storage.service";
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";
import { CommonService } from "src/app/shared/common.service";

@Component({
  selector: "app-edit-card",
  templateUrl: "./edit-card.component.html",
  styleUrls: ["./edit-card.component.scss"],
  standalone: true,
  imports: [
    IonFooter,
    IonToggle,
    IonRow,
    IonInput,
    IonCol,
    IonCard,
    IonContent,
    IonButton,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonHeader,
    CommonModule,
    FormsModule,
    IonInputPasswordToggle,
    IonSelect,
    IonSelectOption,
  ],
})
export class EditCardComponent implements OnInit {
  @Input() data: any;
  @Input() addVehicleClicked: any;
  @Input() addGovtIdClicked: any;

  public modalCtrl = inject(ModalController);
  private handleData = inject(HandleDataService);
  private localStr = inject(LocalStorageService);
  private commonService = inject(CommonService);

  checkDocs?: boolean = false;
  userRole = "passenger";
  // userRole = "driver";
  fileDetails: any;

  vehicle: any = {
    vehicleDetails: {
      vehicleType: "",
      vehicleNumber: "",
      vehicleName: "",
      vehicleColor: '',
    },
    vehicleList: []
  }


  about: any = {
    miniBio: "",
    travelPreference: [],
  };
  govtDocs: any = {
    fileDetails: "",
    url: "",
  };


  isEmailTouched = false;
  isPassTouched = false;
  isNameTouched = false;
  isPhoneTouched = false;
  isDocTouched = false;
  isGenderTouched = false;
  isDocumentUploaded = false;
  isAboutTouched = false;
  isPrefTouched = false;

  onFieldChange(): boolean {
    return this.isEmailTouched || this.isPassTouched || this.isNameTouched || this.isDocTouched || this.isPhoneTouched || this.isDocumentUploaded || this.isGenderTouched || this.isAboutTouched || this.isPrefTouched
  }

  onDocumentUpload(event: any) {
    this.isDocumentUploaded = true;
  }

  vehicleDetailsAuth(): boolean {
    const { vehicleType, vehicleName, vehicleNumber, vehicleColor } = this.vehicle.vehicleDetails;
    return vehicleType && vehicleName && vehicleNumber && vehicleColor ? true : false;
  }

  // fileContent: string | ArrayBuffer | null | any = null;
  file: any;

  constructor() {
    addIcons({ close });
  }


  ngOnInit() {
    console.log("addGovtIdClicked === ", this.addGovtIdClicked);

    console.log("addVehicleClicked === ", this.addVehicleClicked);

    console.log("this.data.cpassword === ", this.data.cpassword);

    this.handleData
      .userExists(this.data.userEmail)
      .then((res) => {
        this.data = res.data;
        console.log("this.data updated === ", this.data);
        this.localStr.setItem("currentUser", this.data);
        if (this.data.vehicle) {
          if (this.addVehicleClicked) {


            // this.vehicle = this.data.vehicle;
            this.vehicle.vehicleList = this.data.vehicle.vehicleList;

          } else {
            console.log("hero");

          }
        }
        if (this.data.about) {
          this.about = this.data.about;
        }
        if (this.data.govtDocs) {
          this.govtDocs = this.data.govtDocs;
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    console.log("edit modal", this.data);
  }

  passCheck = false;
  validatePassword() {
    if (this.data.password != this.data.cpassword) {
      this.passCheck = true;
    } else {
      this.passCheck = false;
    }
  }

  changePass = false;
  togglePassChange() {
    this.changePass = !this.changePass;
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }


  async updateData() {

    if (this.data) {

      // Check if at least pass field has been updated
      // const isPassChanged = this.changePass !== this.data.cpassword
      console.log("this.data === ", this.data);
      console.log("this.changePass === ", this.changePass);

      if (this.changePass == true && this.data.cpassword === undefined) {
        this.data.cpassword = this.handleData.encryptPass(this.data.password);
        this.data.password = this.data.cpassword;
      }

      if (this.changePass == true && this.data.cpassword !== undefined) {
        this.data.cpassword = this.handleData.encryptPass(this.data.password);
        this.data.password = this.data.cpassword;
      }


      if (this.file) {
        const fileUrl = this.handleData
          .fileUploadToFirebase(this.file)
          .then((res) => {
            this.govtDocs = {
              fileDetails: this.fileDetails,
              url: res,
            };
            this.data.govtDocs = this.govtDocs;
            // console.log("res === ", res);
            console.log("Updated File Details with URL:", this.data.govtDocs);

            //update document
            this.updateDoc();

          })
          .catch((e) => {
            console.error("Error: ", e);
          });
      } else {
        this.updateDoc();
      }


      // return;
    } else {
      console.error("Error: this.data is null or undefined.");
    }
  }

  updateDoc() {

    const currentUserDocId = this.localStr.getItem("currentUserDocId");
    if (this.addVehicleClicked) {
      this.vehicle.vehicleList.unshift(this.vehicle.vehicleDetails);
      this.handleData.updateDocumentField(currentUserDocId, 'vehicle', this.vehicle);
    }
    let _data = {
      ...this.data,
      about: this.about,
      govtDocs: this.govtDocs,
    };

    if (this.userRole === "driver" && this.checkDocs === true) {
      console.log("_data : ", _data);
    } else {
      console.log("edit else modal", _data);

      // console.log("data1", this.data);

      if (currentUserDocId) {
        this.handleData.updateDocument(currentUserDocId, _data).then(() => {
          let updateData = this.handleData
            .userExists(this.data.userEmail)
            .then((res) => {
              this.data = res.data;
              console.log("this.data updated === ", this.data);
              this.localStr.setItem("currentUser", this.data);
              this.localStr.setItem("currentUser", _data);


              this.modalCtrl.dismiss(_data.vehicle.vehicleList);

              this.close();
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
        });
      } else {
        console.error("Error: currentUserDocId is null or undefined.");
      }
    }
  }

  close() {
    // const data = this.data;
    this.modalCtrl.dismiss();
    // this.modalCtrl.dismiss();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.checkDocs = true;
      this.fileDetails = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };
      console.log("File Details:", this.fileDetails);
    }
  }
}