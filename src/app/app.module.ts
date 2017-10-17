import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";

import {AppComponent} from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBCfFLnNuwh9Lh7cORu4BjBcm5SQvKOBP4",
  authDomain: "angular-firebase-note.firebaseapp.com",
  databaseURL: "https://angular-firebase-note.firebaseio.com",
  storageBucket: "angular-firebase-note.appspot.com",
  messagingSenderId: '1073562697896'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
