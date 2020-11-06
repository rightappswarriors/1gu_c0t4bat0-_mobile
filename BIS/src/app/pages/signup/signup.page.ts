import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthserviceService } from 'src/app/services/authservice/authservice.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  isLoggedIn = false;
  users = { id: '', name: '', email: '', imageurl:'',gender:'',dob:'',number:'',shopname:'',pass:'',uid:''};
  sign = {"action":"register","name":"","email":"","number":"","password":"","conpassword":"","imageurl":"","ipaddr":"","device":""
         ,"lastname":"","firstname":"","middlename":"","blocks":"","brgy":"","city":"","houseno":"","street":"","username":""};
  sform:FormGroup;
  matching_passwords_group:FormGroup;
  validation_messages;
  brgy: Array<string>; 
  constructor(private router:Router,
              private fb:Facebook,
              private ns:NativeStorage,
              private as:AuthserviceService,
              private gp:GooglePlus,
              private http:HttpClient,
              private loading:LoadingController,
              private formbuilder:FormBuilder,private device:Device,
              private networkInterface: NetworkInterface,
              private toast:ToastController) { }
  

    

  // go back in the login
  backtologin(){
    this.router.navigateByUrl("/login");
  }
  
  
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
 
  //register to users table
  async register(val){
    //console.log(val);
    this.sign.blocks = val.blocks;
    this.sign.brgy = val.brgy;
    this.sign.city = val.city;
    this.sign.email = val.email;
    this.sign.firstname = val.firstname;
    this.sign.houseno = val.houseno;
    this.sign.lastname = val.lastname;
    this.sign.middlename = val.middlename;
    this.sign.number = val.number;
    this.sign.password = val.matching_passwords.password;
    this.sign.street = val.street;
    this.sign.imageurl = "newuser.jpg";
    this.sign.username = val.username;
    console.log(this.sign);
    const loading = await this.loading.create({
      message: 'Pleaste Wait...',
      });
      await loading.present();
        this.http.post(localStorage.getItem("url")+"/controller/x08controller.php",JSON.stringify(this.sign))
        .subscribe(data=>{
          console.log(data);
          let response:any = data;
          loading.dismiss();
          if(response.message == "success"){
            for(let u of response.user){
              localStorage.setItem("user",JSON.stringify(u));
              JSON.parse(localStorage.getItem("user"));
              this.router.navigateByUrl("/tabs/tabs/tab1");
            }
          }else if(response.message == "userexists"){
            this.presentToast("Username already exist.");
          }
        },
        (err)=>{
          console.log(JSON.stringify(err));
        }
        );
    
  }
  //end of register

  //login with google plus
  gpLogin(){
    this.gp.login({})
    .then(res => {
      console.log("gplogin");
      this.sign.name = res.displayName;
      this.sign.email = res.email;
      this.sign.imageurl = res.imageUrl;
      this.http.post(localStorage.getItem("url")+"/controller/buyercontroller.php",JSON.stringify(this.sign))
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
        console.log(res);
        this.users.name = res.displayName;
        this.users.email = res.email;
        this.users.imageurl = res.picture.data.url;
        this.as.addUser(this.users);
        this.as.getUser();
        this.router.navigateByUrl("/tabs/tabs/tab1");
      })
      .catch(e => {
        console.log(e);
      });
  }
  //end of facebook login
  areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];

        if (val === undefined) {
          val = control.value
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }
  
  showPassword(input: any,icon : any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    icon.name = icon.name === 'eye-outline' ? 'eye-off-outline':'eye-outline';
   }
  
  instantiateForm(){
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return this.areEqual(formGroup);
    });
    this.sform = this.formbuilder.group({
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      number: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      lastname: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      firstname: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      middlename: new FormControl('',Validators.compose([
        Validators.pattern('[a-zA-Z ]*')
      ])),
      houseno: new FormControl('',Validators.compose([
        null
      ])),
      street: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      blocks: new FormControl('',Validators.compose([
        null
      ])),
      brgy: new FormControl('',Validators.compose([
        Validators.required
      ])),
      city: new FormControl('Cotabato',Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')
      ])),
      username: new FormControl('',Validators.compose([
        Validators.required
      ])),
      matching_passwords: this.matching_passwords_group
    });
    
  }

  ionViewWillEnter(){
    this.instantiateForm();
  }
  ngOnInit() {
    //get the ip address
   
  //  this.networkInterface.getWiFiIPAddress()
  //   .then(address => this.sign.ipaddr = address.ip)
  //   .catch(error => console.error(`Unable to get IP: ${error}`));
  //  this.sign.device = this.device.model;
  
    
    
    //instantiate form 
    this.instantiateForm();
    
    

    // for validation messages
    this.validation_messages = {
      'email' : [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Please enter a valid email.' }
      ],
      'number' : [
        { type: 'required', message: 'Number is required.' },
        { type: 'pattern', message: 'Please enter a valid email.' }
      ],
      'lastname' : [
        { type: 'required', message: 'Lastname is required.' },
        { type: 'pattern', message: 'Please enter a letters only.' }
      ],
      'firstname' : [
        { type: 'required', message: 'Firstname is required.' },
        { type: 'pattern', message: 'Please enter a letters only.' }
      ],
      'middlename' : [
        { type: 'pattern', message: 'Please enter a letters only.' }
      ],
      'houseno' : [
        { type: 'pattern', message: 'Please enter a letters and numbers only.' }
      ],
      'street' : [
        { type: 'required', message: 'Street is required.' },
        { type: 'pattern', message: 'Please enter a letters only.' }
      ],
      'blocks' : [
        { type: 'required', message: 'Blocks is required.' },
        { type: 'pattern', message: 'Please enter a letters and numbers only.' }
      ],
      'brgy' : [
        { type: 'required', message: 'Barangay is required.' }
      ],
      'city' : [
        { type: 'required', message: 'City is required.' },
        { type: 'pattern', message: 'Please enter a letters and numbers only.' }
      ],
      'password' : [
        { type: 'required', message: 'Password is required.' },
        { type: 'minlength', message: 'Password must be at least 5 characters long.' },
        { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
      ],
      'confirm_password': [
        { type: 'required', message: 'Confirm password is required.' }
      ],
      'matching_passwords': [
        { type: 'areEqual', message: 'Password mismatch.' }
      ],
      'username' : [
        { type: 'required', message: 'Username is required.' }
      ],
    };

    this.brgy = [
      "Bagua Mother",
      "Bagua I",
      "Bagua II",
      "Bagua III",
      "Kalanganan Mother",
      "Kalanganan I",
      "Kalanganan II",
      "Poblacion Mother",
      "Poblacion II",
      "Poblacion IV",
      "Poblacion V",
      "Poblacion VI",
      "Poblacion VII",
      "Poblacion VIII",
      "Poblacion IX",
      "Rosary Heights Mother"
    ];
    
  }

}
