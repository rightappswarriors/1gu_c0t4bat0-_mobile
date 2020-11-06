import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uedit',
  templateUrl: './uedit.page.html',
  styleUrls: ['./uedit.page.scss'],
})
export class UeditPage implements OnInit {
  
  sign = {"action":"updatedata","name":"","email":"","number":"","password":"","conpassword":"","imageurl":"","ipaddr":"","device":""
         ,"lastname":"","firstname":"","middlename":"","blocks":"","brgy":"","city":"","houseno":"","street":"","username":""};
  sform:FormGroup;
  matching_passwords_group:FormGroup;
  validation_messages;
  brgy: Array<string>; 
  constructor(private router:Router,
              private http:HttpClient,
              private loading:LoadingController,
              private formbuilder:FormBuilder,
              ) { }
  
  
  // go back to tabs
   backtotab3(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
  }

  instantiateForm(){
    let users = JSON.parse(localStorage.getItem("user"));
    this.sform = this.formbuilder.group({
      email: new FormControl(users.email,Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      number: new FormControl(users.mobile,Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      lastname: new FormControl(users.last_name,Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      firstname: new FormControl(users.first_name,Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      middlename: new FormControl(users.middle_name,Validators.compose([
        Validators.pattern('[a-zA-Z ]*')
      ])),
      houseno: new FormControl(users.house_no,Validators.compose([
        
      ])),
      street: new FormControl(users.street,Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      blocks: new FormControl(users.blocks,Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')
      ])),
      brgy: new FormControl(users.brgy,Validators.compose([
        Validators.required
      ])),
      city: new FormControl(users.city,Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')
      ]))
    });
    
  }
  
  async save(val){
    //console.log(val);
    let users = JSON.parse(localStorage.getItem("user"));
    this.sign.blocks = val.blocks;
    this.sign.brgy = val.brgy;
    this.sign.city = val.city;
    this.sign.email = val.email;
    this.sign.firstname = val.firstname;
    this.sign.houseno = val.houseno;
    this.sign.lastname = val.lastname;
    this.sign.middlename = val.middlename;
    this.sign.number = val.number;
    this.sign.street = val.street;
    this.sign.imageurl = "newuser.jpg";
    this.sign.username = users.uid;
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
              this.backtotab3();
            }
            
          }
        },
        (err)=>{
          console.log(JSON.stringify(err));
        }
        );
    
  }

  ionViewWillEnter(){
    this.instantiateForm();
  }
  ngOnInit() {
    this.instantiateForm();

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
