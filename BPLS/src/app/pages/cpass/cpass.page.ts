import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-cpass',
  templateUrl: './cpass.page.html',
  styleUrls: ['./cpass.page.scss'],
})
export class CpassPage implements OnInit {

sform:FormGroup;
matching_passwords_group:FormGroup;
validation_messages;
save = {"action":"updatepass","password":"","uid":""};

constructor(private router:Router,private formbuilder:FormBuilder,
              private http:HttpClient,private loading:LoadingController,private menu:MenuController) { }
  



async changepass(val){
  let users = JSON.parse(localStorage.getItem("user"));
  this.save.password = val.matching_passwords.password;
  this.save.uid = users.uid;
  const loading = await this.loading.create({
    message: 'Pleaste Wait...',
    });
    await loading.present();
      this.http.post(localStorage.getItem("url")+"/controller/x08controller.php",JSON.stringify(this.save))
      .subscribe(data=>{
        console.log(data);
        loading.dismiss();
        let response:any = data;
        if(response.message == "success"){
          this.router.navigateByUrl("/main");
        }
      },
      (err)=>{
        console.log(JSON.stringify(err));
      }
      );
}
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
      matching_passwords: this.matching_passwords_group
    });
    
  }

  
  showPassword(input: any,icon : any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    icon.name = icon.name === 'eye-outline' ? 'eye-off-outline':'eye-outline';
   }

  backtotab3(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
  }
  
  ionViewWillEnter(){
     this.instantiateForm();
     this.menu.enable(true,'menu-content');
  }

  ngOnInit() {
     this.instantiateForm();
     this.validation_messages = {
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
      ]
    };
  }

}
