import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

//   // Import the functions you need from the SDKs you need

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use

// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {

//   apiKey: "AIzaSyA4WUyztpemvGVtLWSDZajEz7gPTsO9Q5Q",

//   authDomain: "barryprono-f0d76.firebaseapp.com",

//   databaseURL: "https://barryprono-f0d76-default-rtdb.europe-west1.firebasedatabase.app",

//   projectId: "barryprono-f0d76",

//   storageBucket: "barryprono-f0d76.appspot.com",

//   messagingSenderId: "124717631465",

//   appId: "1:124717631465:web:398ac5ba36ec509e492d78",

//   measurementId: "G-JYZ91NECGB"

// };

// // Initialize Firebase

// const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
