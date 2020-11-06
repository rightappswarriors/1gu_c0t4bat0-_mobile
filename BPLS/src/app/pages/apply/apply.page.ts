import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-apply',
  templateUrl: './apply.page.html',
  styleUrls: ['./apply.page.scss'],
})
export class ApplyPage implements OnInit {
  btype: Array<string>;
  aform:FormGroup;
  aformData = new FormData();

  constructor(private menu:MenuController,
              private formbuilder:FormBuilder,
              private loading:LoadingController,
              private http:HttpClient
              ) 
  { 
    
  }
  

              
  ionViewWillEnter(){
    this.instantiateForm();
    this.menu.enable(true,'menu-content');
  }
  
  instantiateForm(){
    this.aform = this.formbuilder.group({
      btype: new FormControl('',Validators.compose([
        Validators.required
      ])),
      bname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      streetname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      barangay: new FormControl('',Validators.compose([
        Validators.required
      ])),
      citymun: new FormControl('',Validators.compose([
        Validators.required
      ])),
      province: new FormControl('',Validators.compose([
        Validators.required
      ])),
      zcode: new FormControl('',Validators.compose([
        Validators.required
      ])),
      lnumber: new FormControl('',Validators.compose([
        Validators.required
      ])),
      cnumber: new FormControl('',Validators.compose([
        Validators.required
      ])),
      email: new FormControl('',Validators.compose([
        Validators.required
      ])),
      olname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      ofname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      omname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      oposition: new FormControl('',Validators.compose([
        Validators.required
      ])),
      lyincome: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });
    
  }


  async save(val){
    const loading = await this.loading.create({
      message: 'Please Wait...',
      });
     await loading.present();
     let users = JSON.parse(localStorage.getItem("user"));  
     let save = {"action":"add","btype":"","bname":"","streetname":"","barangay":"","citymun":"","province":"","zcode":"",
                "lnumber":"","cnumber":"","email":"","olname":"","ofname":"","omname":"","oposition":"","lyincome":"","uid":""};
     save.btype = val.btype;
     save.bname = val.bname;   
     save.streetname = val.streetname;
     save.barangay = val.barangay;
     save.citymun = val.citymun;
     save.province = val.province;
     save.zcode = val.zcode;
     save.lnumber = val.lnumber;
     save.cnumber = val.cnumber;
     save.email = val.email;        
     save.olname = val.olname;
     save.ofname = val.ofname;
     save.omname = val.omname;
     save.oposition = val.oposition;
     save.lyincome = val.lyincome;
     save.uid = users.uid;
     console.log(JSON.stringify(val));
     this.http.post(localStorage.getItem("url")+"/controller/applycontroller.php",JSON.stringify(save))
     .subscribe(data=>{
        let res:any = data;
        console.log(JSON.stringify(res));
        loading.dismiss();
       //  if(res.message == "success"){
       //   for(let u of res.user){
       //     localStorage.setItem("user",JSON.stringify(u));
       //     JSON.parse(localStorage.getItem("user"));
       //     this.router.navigateByUrl("/main");
       //   }  
       //  }   
     },
     (err)=>{
       console.log(JSON.stringify(err));
     }
     );
  }

  ngOnInit() {
    this.instantiateForm();
    this.btype = [
      "Single Proprietor",
      "Partnership",
      "Corporation",
      "Incorporation"
    ];
    this.menu.enable(true,'menu-content');
  }

}
