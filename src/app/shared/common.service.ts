import { Injectable, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular/standalone";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: "root",
})
export class CommonService {
  public isUserLoggedin: boolean = false;
  public currentUserEmail: string = "";

  constructor(private alertController: AlertController, private platform: Platform) {
    const data: any = localStorage.getItem("currentUser");
    const parsedData: any = JSON.parse(data);
    console.log("parsedData === ", parsedData);
    // this.currentUserEmail = parsedData.userEmail;
    // console.log("this.currentUserEmail === ", this.currentUserEmail);

  }


  async alertBox(
    message: string,
    header: string,
    buttons?: string[],
    subHeader?: string
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
    });

    await alert.present();
  }


  async sendNotification(title: string, body: string, redirect: string, data: any, largBody: string = '', summaryText: string = '') {
    console.log('sendNotification');

    if (this.platform.is('android') || this.platform.is('ios')) {
      let options: ScheduleOptions = {
        notifications: [
          {
            title: title,
            body: body,
            id: 1,
            // schedule: { at: new Date(Date.now() + 1000 * 5) }, // Trigger after 5 seconds
            largeBody: largBody,
            summaryText: summaryText,
            extra: {
              redirect: redirect,
              data: data
            },
          },
        ],
      }
      try {
        await LocalNotifications.schedule(options)
      } catch (ex) {
        console.log("ni chala");
        alert(JSON.stringify(ex));
      }
    } else {
      this.alertBox('No specific plateform found. ', 'Notification Error.', ["Ok"])
    }
  }
  // async sendNotification(title: string, body: string, redirect: string, largBody: string = '', summaryText: string = '') {
  //   console.log('sendNotification');

  //   if (this.platform.is('android') || this.platform.is('ios')) {
  //     let options: ScheduleOptions = {
  //       notifications: [
  //         {
  //           title: title,
  //           body: body,
  //           id: 1,
  //           // schedule: { at: new Date(Date.now() + 1000 * 5) }, // Trigger after 5 seconds
  //           largeBody: largBody,
  //           summaryText: summaryText,
  //           extra: {
  //             redirect: redirect  
  //           },
  //         },
  //       ],
  //     }
  //     try {
  //       await LocalNotifications.schedule(options)
  //     } catch (ex) {
  //       console.log("ni chala");
  //       alert(JSON.stringify(ex));
  //     }
  //   } else {
  //     this.alertBox('No specific plateform found. ', 'Notification Error.', ["Ok"])
  //   }
  // }
}
