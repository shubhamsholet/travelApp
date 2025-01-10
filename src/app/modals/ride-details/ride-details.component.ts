import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonCard, IonCardHeader, IonCardContent, IonItem, IonAvatar, IonLabel, IonContent, IonChip, IonList, IonCardTitle, IonBadge, IonListHeader, IonCardSubtitle, IonImg, IonHeader, IonTitle, IonToolbar, IonText, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.scss'],
  standalone: true,
  imports: [IonNote, IonText, IonToolbar, IonTitle, IonHeader, IonImg, IonCardSubtitle, IonListHeader, IonBadge, IonCardTitle, IonList, IonChip, IonContent, IonLabel, IonAvatar, IonItem, IonCardContent, IonCardHeader, IonCard, IonIcon, IonCol, IonRow, IonGrid, IonButton,],
})
export class UserDetailsComponent implements OnInit {
  @Input() userData: any;
  @Input() journeyDuration: any;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    console.log("user details");
    console.log("user details", this.userData);
  }

  close() {
    this.modalCtrl.dismiss()
  }
  calculateTotalPrice(): number {
    return this.userData.price * this.userData.seatAvl;
  }

  dateFormat(dateString: string): string {
    const date = new Date(dateString);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${weekday} ${day} ${month}`;
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
