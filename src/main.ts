import { bootstrapApplication } from "@angular/platform-browser";
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from "@angular/router";
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from "@ionic/angular/standalone";

import { routes } from "./app/app.routes";
import { AppComponent } from "./app/app.component";
import {
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { provideHttpClient } from "@angular/common/http";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { getMessaging, provideMessaging } from "@angular/fire/messaging"; // Import messaging

import { environment } from "./environments/environment";
import { FIREBASE_OPTIONS } from '@angular/fire/compat';





bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        lang: "en",
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,

            provider: new FacebookLoginProvider("852363663092517", {
              scope: "email, public_profile", // Request permissions here

            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()), // Add messaging provider
  ],
});

// src/main.ts

// Register the service worker for Firebase Messaging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}