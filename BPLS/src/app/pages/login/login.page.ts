 import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthserviceService } from 'src/app/services/authservice/authservice.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppVersion } from '@ionic-native/app-version/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  isLoggedIn = false;
  users = { id: '', name: '', email: '', imageurl:'',gender:'',dob:'',number:'',shopname:'',pass:'',uid:''};
  lusers = { uid: ''};
  sign = {"action":"login","username":"","password":""};
  regsign = {"action":"register","name":"","email":"","number":"","password":"","imageurl":""}; 
  clickSub: any;
  lform:FormGroup;
  VersionNumber:string = "Version: 0.0.1";
  validation_messages;
  constructor(private router:Router,
              private fb:Facebook,
              private ns:NativeStorage,
              private as:AuthserviceService,
              private gp:GooglePlus,
              private http:HttpClient,
              private toast:ToastController,
              private localNotifications: LocalNotifications,
              public alertController: AlertController,
              private formbuilder:FormBuilder,
              private loading:LoadingController,
              private appVersion: AppVersion,
              private menu:MenuController) 
              { 
                // this.appVersion.getVersionNumber().then(value => {
                //   this.VersionNumber ="Version: "+value;
                //   console.log(this.VersionNumber);
                // }).catch(err => {
                //   alert(err);
                // });
              }
               
  // go back in the tabs
  backtotabs(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
  }

  
  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: data,
      buttons: ['OK']
    });
    await alert.present();
  }
  unsub() {
    this.clickSub.unsubscribe();
  }
  simpleNotif() {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log(data);
      this.router.navigateByUrl("/tabs/tabs/tab2");
      this.unsub();
    });
    this.localNotifications.schedule({
      id: 1,
      text: 'Single Local Notification',
      data: { route: '/tabs/tabs/tab2' },
      foreground:true,
      lockscreen:true,
      vibrate:true
    });
  }

  // login 
  async login(val){
    const loading = await this.loading.create({
      message: 'Please Wait...',
      });
    await loading.present();  
    this.sign.username = val.username;
    this.sign.password = val.password;
    this.http.post(localStorage.getItem("url")+"/controller/x08controller.php",JSON.stringify(this.sign))
    .subscribe(data=>{
       let res:any = data;
       loading.dismiss();
       console.log(JSON.stringify(res));
       if(res.message == "success"){
        for(let u of res.user){
          localStorage.setItem("user",JSON.stringify(u));
          JSON.parse(localStorage.getItem("user"));
          this.router.navigateByUrl("/main");
        }  
       }else{
          this.presentToast();
       }
    },
    (err)=>{
      console.log(JSON.stringify(err));
    }
    );
  }
  //end of normal login

  //go to sign up page
  signup(){
    this.router.navigateByUrl("/signup");
  }
  
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Invalid Username or Password.',
      duration: 2000
    });
    toast.present();
  }
  showPassword(input: any,icon : any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    icon.name = icon.name === 'eye-outline' ? 'eye-off-outline':'eye-outline';
   }

  //login with google plus
  gpLogin(){
    this.gp.login({})
    .then(res => {
      console.log("gplogin");
      this.regsign.name = res.displayName;
      this.regsign.email = res.email;
      this.regsign.imageurl = res.imageUrl;
      this.http.post(localStorage.getItem("url")+"/controller/buyercontroller.php",JSON.stringify(this.regsign))
      .subscribe(data=>{
        console.log(data);
        let response:any = data;
        this.users.name = res.displayName;
        this.users.email = res.email;
        this.users.imageurl = res.imageUrl;
        this.users.uid = response.uid;
        this.as.addUser(this.users);
        this.router.navigateByUrl("/tabs/tabs/tab1");
      },
      (err)=>{
        console.log(JSON.stringify(err));
      }
      );
    })
    .catch(err => console.error(err));
  }
  //end of google login

  //login with facebook
  fbLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if (res.status === 'connected') {
          this.getUserDetail(res.authResponse.userID);
        } else {
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => { 
        this.users.name = res.name;
        this.users.email = res.email;
        this.users.imageurl = res.picture.data.url;
        this.as.addUser(this.users);
        this.router.navigateByUrl("/tabs/tabs/tab1");
      })
      .catch(e => {
        console.log(e);
      });
  }

  //end of facebook login

  ionViewWillEnter(){
    console.log("ionviewwillenter");
    this.menu.enable(false,'menu-content');
    //this.getItems();
    this.lform = this.formbuilder.group({
      username: new FormControl('',Validators.compose([
        Validators.required
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });
  }
  
  
  ngOnInit() {
    this.lform = this.formbuilder.group({
      username: new FormControl('',Validators.compose([
        Validators.required
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });

    this.validation_messages = {
      'username' : [
        { type: 'required', message: 'Username is required.' },
      ],
      'password' : [
        { type: 'required', message: 'Password is required.' }
      ]
    };
  }

}
