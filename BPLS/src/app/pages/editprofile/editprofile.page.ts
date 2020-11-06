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
import { ActionSheetController, Platform, LoadingController, MenuController } from '@ionic/angular';

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

  sform:FormGroup;
  uformData = new FormData();
  validation_messages;
  uid;
  constructor(private http:HttpClient,private as:AuthserviceService,
              private router:Router,private camera: Camera, 
              private file: File,private webview: WebView, 
              private actionSheetController: ActionSheetController,
              private plt: Platform,
              private loadingController: LoadingController,
              private ref: ChangeDetectorRef, 
              private filePath: FilePath,
              private formbuilder:FormBuilder,
              private menu:MenuController)
  { 
    
  }

  instantiateForm(){
    let users = JSON.parse(localStorage.getItem("user"));
    this.uid = users.uid;
    this.sform = this.formbuilder.group({
      businessname: new FormControl(users.opr_name,Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),
      address: new FormControl(users.business_address,Validators.compose([
        Validators.required
      ])),
      authorized: new FormControl(users.authorized_signature,Validators.compose([
        Validators.required
      ])),
      email: new FormControl(users.email,Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      contactperson: new FormControl(users.contact_person,Validators.compose([
        Validators.required
      ]))
    });
    
  }

  
  
  //go to tabs
  backtotabs(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
  }

  

  save(val){
     //this.user.dob = formatDate(this.user.dob, 'yyyy-MM-dd', 'en');
     //this.user.uid = this.users.uid;
     //store in form format and sent to the server
     
     this.uformData.append("action","update");
     this.uformData.append("businessname",val.businessname);
     this.uformData.append("address",val.address);
     this.uformData.append("authorized",val.authorized);
     this.uformData.append("email",val.email);
     this.uformData.append("contactperson",val.contactperson);
     this.uformData.append("uid",this.uid);
     console.log("execute save");
     this.http.post(localStorage.getItem("url")+"/controller/x08controller.php",this.uformData)
    .subscribe(data=>{
       let res:any = data;
       console.log(JSON.stringify(res));
       if(res.message == "success"){
        for(let u of res.user){
          localStorage.setItem("user",JSON.stringify(u));
          JSON.parse(localStorage.getItem("user"));
          this.router.navigateByUrl("/main");
        }  
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
    this.instantiateForm();
    this.menu.enable(true,'menu-content');
    console.log(localStorage.getItem("user"));
    
     
  }


  ngOnInit() {
    //instantiate form
    this.instantiateForm(); 
    this.validation_messages = {
      'businessname' : [
        { type: 'required', message: 'Business Name is required.' },
        { type: 'pattern', message: 'Please enter a letters only.' }
      ],
      'address' : [
        { type: 'required', message: 'Address is required.' }
      ],
      'authorized' : [
        { type: 'required', message: 'Authorized Signature is required.' }
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
      'email' : [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Please enter a vaild email.' }
      ],
      'contactperson' : [
        { type: 'required', message: 'Contact Persion is required.' }
      ]
    };
  }

}
