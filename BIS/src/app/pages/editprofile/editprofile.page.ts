import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthserviceService } from 'src/app/services/authservice/authservice.service';
import {formatDate} from '@angular/common';
import { Router } from '@angular/router';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';

import { File, FileEntry } from '@ionic-native/File/ngx';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
 
import { finalize } from 'rxjs/operators';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';

import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  users;
  
  genders: Array<string>;
  image;
  user = {"action":"update","name":"","email":"","gender":"","shopname":"","dob":"","number":"","pass":"","uid":""};

  imgpath;
  imgfilepath;

  form:FormGroup;
  uformData = new FormData();
  error_messages = {'name':[{type:'required',message:'Name is Required'}]
                   };

  constructor(private http:HttpClient,private as:AuthserviceService,
              private router:Router,private camera: Camera, 
              private file: File,private webview: WebView, 
              private actionSheetController: ActionSheetController,
              private plt: Platform,
              private loadingController: LoadingController,
              private ref: ChangeDetectorRef, 
              private filePath: FilePath,
              private formbuilder:FormBuilder)
  { 
    
  }

  //go to tabs
  backtotabs(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
  }

  

  save(){
     this.user.dob = formatDate(this.user.dob, 'yyyy-MM-dd', 'en');
     this.user.uid = this.users.uid;
     //store in form format and sent to the server
     this.uformData.append("action",this.user.action);
     this.uformData.append("name",this.user.name);
     this.uformData.append("email",this.user.email);
     this.uformData.append("gender",this.user.gender);
     this.uformData.append("shopname",this.user.shopname);
     this.uformData.append("dob",this.user.dob);
     this.uformData.append("number",this.user.number);
     this.uformData.append("pass",this.user.pass);
     this.uformData.append("uid",this.user.uid);
      
     console.log("execute save");
      

     let nuser = { id: '', name: '', email: '', imageurl:'',gender:'',dob:'',number:'',shopname:'',pass:'',uid:''};
     console.log(JSON.stringify(this.user));
     this.http.post(localStorage.getItem("url")+"/controller/buyercontroller.php",this.uformData)
    .subscribe(data=>{
       let res:any = data;
       console.log(JSON.stringify(res));
       if(res.message == "success"){
          nuser.name = this.user.name;
          nuser.email = this.user.email;
          nuser.imageurl = this.image;
          nuser.gender = this.user.gender;
          nuser.dob = this.user.dob;
          nuser.number = this.user.number;
          nuser.shopname = this.user.shopname;
          nuser.pass = this.user.pass;
          nuser.uid = this.user.uid;
          //update user 
          this.as.addUser(nuser);
          this.router.navigateByUrl("/tabs/tabs/tab1")
       }
          
    },
    (err)=>{
      console.log(JSON.stringify(err));
    }
    );
  }
  
  //for selecting pictures functions
  async selectImage() {
  

    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Select in Gallery', 
        handler: () => {
                  this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
              }
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
  
    this.camera.getPicture(options).then(imagePath => {
        if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    //this.pToast(currentName);
                    
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
        } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
    });
  
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.setImage(newFileName);
    }, error => {
        //this.presentToast('Error while storing file.');
    });
   }

   setImage(name) {

    let filePath = this.file.dataDirectory + name;
    let resPath = this.pathForImage(filePath);
    this.image = resPath;
    this.imgfilepath = filePath;
    this.ref.detectChanges();

    //if the user has choose photos
    if(this.imgfilepath != null){
      console.log("Not Empty File");
      this.file.resolveLocalFilesystemUrl(this.imgfilepath)
      .then(entry => {
          ( < FileEntry > entry).file(file => this.readFile(file))
      })
      .catch(err => {
           console.log("Error while reading file.");
          //this.presentToast('Error while reading file.');
      });
     }else{
       console.log("Empty File");
     }
  
   }

   pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  readFile(file: any) {

    const reader = new FileReader();
    reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        this.uformData.append('file', imgBlob, file.name);
        //console.log(JSON.stringify(this.uformData));
        //this.uploadImageData(this.auformData);
    };
    reader.readAsArrayBuffer(file);
  
  }

  //end of selecting pictures functions
  
  









  //before the page enter initialize first
  ionViewWillEnter(){
    console.log("ionviewwillenter");

    let u = this.as.getUserLocal();
    if(u!=null){
       console.log('true');
       this.users = this.as.getUserLocal();
       this.user.name = this.users.name;
       this.user.email = this.users.email;
       this.user.gender = this.users.gender;
       this.user.dob = this.users.dob;
       this.user.number = this.users.number;
       this.user.shopname = this.users.shopname;
       this.user.pass = this.users.pass; 
       this.image = this.users.imageurl;
    }
    
     
  }


  ngOnInit() {
    //instantiate form 
    this.form = this.formbuilder.group({
      name: new FormControl('',Validators.compose([Validators.required])),
      email: new FormControl('',null)
    });

    this.genders = [
      "Male",
      "Female"
    ];
  }

}
