<!-- cmd 1: to make build -->

ng build --output-path=dist/carpool --base-href /travelApp/

<!-- cmd 2: to update and push  -->

npx angular-cli-ghpages --dir=dist/carpool

<!-- for main branch  -->
<!-- for add -->

git add .

<!-- for commit -->

git commit -m "Your commit message"

<!-- for pull -->

git pull origin main

<!-- for push -->

git push

<!-- for android -->

To make the google-services.json config values accessible to Firebase SDKs, you need the Google services Gradle plugin.

Kotlin DSL (build.gradle.kts)

Groovy (build.gradle)
Add the plugin as a dependency to your project-level build.gradle file:

Root-level (project-level) Gradle file (<project>/build.gradle):
plugins {
// ...

// Add the dependency for the Google services Gradle plugin
id 'com.google.gms.google-services' version '4.4.2' apply false

}
Then, in your module (app-level) build.gradle file, add both the google-services plugin and any Firebase SDKs that you want to use in your app:

Module (app-level) Gradle file (<project>/<app-module>/build.gradle):
plugins {
id 'com.android.application'

// Add the Google services Gradle plugin
id 'com.google.gms.google-services'

...
}

dependencies {
// Import the Firebase BoM
implementation platform('com.google.firebase:firebase-bom:33.7.0')

// TODO: Add the dependencies for Firebase products you want to use
// When using the BoM, don't specify versions in Firebase dependencies
// https://firebase.google.com/docs/android/setup#available-libraries
}
By using the Firebase Android BoM, your app will always use compatible Firebase library versions. Learn more
After adding the plugin and the desired SDKs, sync your Android project with Gradle files.
