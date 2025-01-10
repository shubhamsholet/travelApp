import { Component, Inject, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonRow,
  IonCol,
  IonItem,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList, IonButtons
} from "@ionic/angular/standalone";
import { HandleDataService } from "src/app/services/data/handle-data.service";
import { LocalStorageService } from "src/app/shared/local-storage.service";
import { CommonService } from "src/app/shared/common.service";
import { Router } from "@angular/router";

interface Feedback {
  rideId: string;
  userName: string;
  email: string;
  star: number | string;
  feedbackDate: string;
  feedbackDetails: FeedbackDetails;
  comment: string;
}
interface FeedbackDetails {
  behavior: string;
  cleanliness: string;
  punctuality: string;
  drivingSkill: string;
}



@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.page.html",
  styleUrls: ["./feedback.page.scss"],
  standalone: true,
  imports: [IonButtons,
    IonList,
    IonTextarea,
    IonItem,
    IonCol,
    IonRow,
    IonButton,
    IonIcon,
    IonLabel,
    IonTabButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})



export class FeedbackPage implements OnInit {
  handleData = inject(HandleDataService);
  router = inject(Router);
  localStorageService = inject(LocalStorageService);
  commonService = inject(CommonService);

  star: any;
  email: any = this.commonService.currentUserEmail;
  // id: any = 'zhPlRI2PZ4or8StW5qAk'
  users: any[] = [];
  feedbackForm: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  filledStars: boolean[] = [false, false, false, false, false];

  // feedbackFields = [
  //   {
  //     email: '',
  //     userName: '',
  //     rideId: '',
  //     star: "",
  //     comment: '',
  //     feedbackDate: '',
  //     feedbackDetails: {
  //       behavior: '',
  //       cleanliness: '',
  //       punctuality: '',
  //       drivingSkill: '',
  //     },

  //   },

  // ];
  driverData: any

  feedbackFields = {
    lastFeedback: {} as Feedback, // Initialize lastFeedback with the correct type
    feedbackList: [] as Feedback[], // Initialize feedbackList as an empty array of Feedback
  };

  matchedRideToDisplay: any;
  riderId: any;

  constructor(private FormBuilder: FormBuilder) {
    this.feedbackForm = this.FormBuilder.group({
      star: [0, Validators.required],
      feedbackOptions: [[]],
      comment: [""],
    });
  }

  ngOnInit() {

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.matchedRideToDisplay = navigation.extras.state['matchedRideToDisplay'];
      this.riderId = this.matchedRideToDisplay.riderUserId;
      this.driverData = navigation.extras.state['driverData'];
      console.log('matchedRideToDisplay:', this.matchedRideToDisplay);
    }

    this.handleData
      .userExists(this.email)
      .then((result) => {
        if (result.isExist) {
          this.handleData.user = result.data;
          console.log("this.handleData.user === ", this.handleData.user);
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });


    if (this.driverData.feedback != undefined) {
      this.feedbackFields = this.driverData?.feedback
    } else {
      this.handleData.updateDocumentField(this.riderId, 'feedback', this.feedbackFields)
    }

  }



  onStarClick(index: number) {
    console.log("Star index:", index + 1);
    this.star = index + 1;
    for (let i = 0; i < this.stars.length; i++) {
      this.filledStars[index] = true;
      this.filledStars[i] = i <= index;
    }
    this.feedbackForm.patchValue({
      star: this.star,
    });
  }

  submitFeedback() {
    console.log("Feedback submitted successfully");
    console.log(this.feedbackForm.value);
    const feedbackValues = this.feedbackForm.value;

    // Ensure user data is available
    const currentUser = this.handleData.user;
    console.log("currentUser === ", currentUser);

    if (currentUser) {
      // Create a new feedback object with the form data
      const newFeedback: Feedback = {
        rideId: this.matchedRideToDisplay.id || '',
        userName: currentUser.userName || "",
        email: this.email,
        star: feedbackValues.star,
        feedbackDate: new Date().toISOString(),
        feedbackDetails: feedbackValues.feedbackOptions,
        comment: feedbackValues.comment,
      };

      console.log("this.feedbackFields.feedbackList === ", this.feedbackFields.feedbackList);
      // Update lastFeedback with the new feedback
      if (this.feedbackFields) {
        this.feedbackFields.lastFeedback = newFeedback;
      }
      console.log("his.feedbackFields.lastFeedback === ", this.feedbackFields.lastFeedback);
      console.log("newFeedback === ", newFeedback);
      this.feedbackFields.feedbackList.unshift(newFeedback);
      console.log("this.feedbackFields.feedbackList === ", this.feedbackFields.feedbackList);
      console.log(" this.feedbackFields === ", this.feedbackFields);

      const currentUserDocId = this.localStorageService.getItem("currentUserDocId");

      console.log("Updated Current User:", currentUser);
      console.log("currentUserDocId === ", currentUserDocId);

      // Update the feedback field in the database
      this.handleData.updateDocumentField(this.riderId, 'feedback', this.feedbackFields)
        .then(() => {
          console.log("Feedback updated successfully in Firebase.");
          this.router.navigate(['/welcome']);
        })
        .catch((error) => {
          console.error("Error updating feedback:", error);
        });
    }
  }


  onSkip() {
    this.router.navigate(['/welcome'])
  }

}