import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyBD70WjHnReFQtRk0ioNAsgXOhYRfMh8a4";
  private userToken: string;

  constructor( private http: HttpClient ) { 
    this.loadToken();
  }

  login( user: UserModel ) {
    const loginData = { ...user, returnSecureToken: true }

    return this.http.post(
      `${ this.apiUrl }signInWithPassword?key=${ this.apiKey }`,
      loginData
    ).pipe(
      map( response => {
          this.saveToken(response['idToken']);
          return response;
        }
      )
    );
  }

  register( user: UserModel ) {
    const registerData = { ...user, returnSecureToken: true }

    return this.http.post(
      `${ this.apiUrl }signUp?key=${ this.apiKey} `, 
      registerData
    ).pipe(
      map( response => {
          this.saveToken(response['idToken']);
          return response;
        }
      )
    );
  }

  logOut() {
    this.userToken = '';
    localStorage.removeItem('token');
  }

  saveToken( token: string ) {
    this.userToken = token;
    localStorage.setItem( 'token', this.userToken );

    let now = new Date();
    now.setSeconds( 3600 );
    localStorage.setItem('expiresIn', now.getTime().toString())
  }

  loadToken() {
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  isAuthenticated(): boolean {
    if(!this.userToken) return false;
    
    const expiresIn = Number(localStorage.getItem('expiresIn'));
    
    if( expiresIn < new Date().getTime() ) return false;

    return true;
  }



}
