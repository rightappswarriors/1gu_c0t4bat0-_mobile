import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private user;
  constructor(private ns:NativeStorage,private http:HttpClient) { }

  getUserNS(){
    return this.ns.getItem('auser');
  }

  getUserLocal(){
    return JSON.parse(localStorage.getItem("user"));
  }

  getUser(){
    console.log("Execute Get User");
    return this.user;
  }
  
  addUser(user){
    console.log("Execute Add user service");
    localStorage.setItem("user",JSON.stringify(user));
    this.ns.setItem('auser',user);
    this.user = user;
  }

  removeUser(){
    localStorage.removeItem("user");
    this.ns.remove("auser");
    this.user = null;
  }
}
