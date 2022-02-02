import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afauth: AngularFireAuth) { }

  async signin() {
    return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => console.error(e));
  }

  signout() {
    this.afauth.signOut();
  }

  getUser() {
    return this.afauth.authState;
  }
}
