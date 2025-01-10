import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IonInput, IonHeader, IonContent, IonCard, IonThumbnail, IonItem, IonLabel, IonCardHeader, IonAvatar, IonCardTitle, IonIcon, IonCardSubtitle, IonCardContent, IonRow, IonButton, IonCol, ModalController, IonItemDivider, IonBadge } from "@ionic/angular/standalone";
import { UserDetailsComponent } from 'src/app/modals/ride-details/ride-details.component';
import { HandleDataService } from 'src/app/services/data/handle-data.service';
import { CommonService } from 'src/app/shared/common.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.scss'],
  standalone: true,
  imports: [IonBadge, IonItemDivider, IonCol, IonButton, IonRow, IonCardContent, IonCardSubtitle, IonIcon, IonCardTitle, IonAvatar, IonCardHeader, IonLabel, IonItem, IonCard, IonContent, IonHeader, IonInput, IonThumbnail, CommonModule, IonItemDivider, IonBadge],
})
export class RideCardComponent implements OnInit {
  @Input() userInfo: any;
  dateInput: string | undefined;
  journeyDuration: string | undefined;

  constructor(private router: Router, private modalCtrl: ModalController, private commonService: CommonService,
    public localStr: LocalStorageService, private handleData: HandleDataService) {

  }

  ngOnInit() {
    // console.log("it's user card ts working");
    console.log('userInfo', this.userInfo);
    this.dateInput = this.userInfo['date'];
    const journeyStart = this.userInfo['journeyStart'];
    // console.log(this.userInfo['time'])
    // console.log(this.userInfo['duration'])
    let journeyEnd = this.userInfo['time'] + this.userInfo['duration'];
    // console.log("journeyEnd", journeyEnd);
    this.calculateEndTime(this.userInfo)
  }


  calculateEndTime(userInfo: any): string {
    const time = userInfo['time']; // e.g., "15:27"
    const duration = userInfo['duration']; // e.g., "1 day 5 hours"

    // Parse start time
    const [startHours, startMinutes] = time.split(':').map(Number);

    // Parse duration
    const durationDaysMatch = duration.match(/(\d+)\s*day/);
    const durationHoursMatch = duration.match(/(\d+)\s*hour/);
    const durationMinsMatch = duration.match(/(\d+)\s*mins/);

    const durationDays = durationDaysMatch ? parseInt(durationDaysMatch[1], 10) : 0;
    const durationHours = durationHoursMatch ? parseInt(durationHoursMatch[1], 10) : 0;
    const durationMinutes = durationMinsMatch ? parseInt(durationMinsMatch[1], 10) : 0;

    // Calculate end time
    let endHours = startHours + durationHours;
    let endMinutes = startMinutes + durationMinutes;
    let endDays = durationDays;

    // Handle overflow of minutes
    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }

    // Handle overflow of hours
    if (endHours >= 24) {
      endHours -= 24;
      endDays += 1;
    }

    // Format the final time
    const formattedEndHours = endHours.toString().padStart(2, '0');
    const formattedEndMinutes = endMinutes.toString().padStart(2, '0');

    // If days are involved, include them in the output
    const endTime = endDays > 0
      ? `${endDays} day(s) ${formattedEndHours}:${formattedEndMinutes}`
      : `${formattedEndHours}:${formattedEndMinutes}`;

    return endTime;
  }


}
