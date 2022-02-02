import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afauth: AngularFireAuth) { }

  async signinWithGoogle() {
    return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => console.error(e));
  }

  getUser() {
    return this.afauth.authState;
  }

  logout() {
    this.afauth.signOut();
  }
}
