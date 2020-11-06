import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {formatDate} from '@angular/common';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
@Component({
  selector: 'app-appnew',
  templateUrl: './appnew.page.html',
  styleUrls: ['./appnew.page.scss'],
})
export class AppnewPage implements OnInit {
  myDate: String = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  badd = {"action":"add","purpose":"","status":"On Process","date":"","uid":""};
  bform:FormGroup;
  validation_messages;
  image = "assets/user.png";
  imgfilepath;
  uformData = new FormData();
  constructor(private router:Router,private formbuilder:FormBuilder,
              private http:HttpClient,private loading:LoadingController,
              private actionSheetController: ActionSheetController,
              private plt: Platform,
              private ref: ChangeDetectorRef,
              private filePath: FilePath,private camera: Camera,
              private file: File,private webview: WebView) { }


  async save(val){
    let users = JSON.parse(localStorage.getItem("user"));
    this.uformData.append("action",this.badd.action);
    this.uformData.append("purpose",val.purpose);
    this.uformData.append("uid",users.uid);
    this.uformData.append("date",this.badd.date);
    this.uformData.append("status",this.badd.status);
    const loading = await this.loading.create({
      message: 'Pleaste Wait...',
      });
      await loading.present();
        this.http.post(localStorage.getItem("url")+"/controller/brgycontroller.php",this.uformData)
        .subscribe(data=>{
          console.log(data);
          let response:any = data;
          loading.dismiss();
          if(response.message == "success"){
          this.router.navigateByUrl("/tabs/tabs/tab3");
          }
        },
        (err)=>{
          console.log(JSON.stringify(err));
        }
        );
  }

  backtotab3(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
  }
  
  ionViewWillEnter(){
     this.instantiateForm();
  }

  instantiateForm(){
    this.bform = this.formbuilder.group({
      purpose: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });
    
  }

  selectImage() {
  

    // const actionSheet = await this.actionSheetController.create({
    //   header: 'Select Image source',
    //   buttons: [{
    //     text: 'Select in Gallery', 
    //     handler: () => {
                  
    //           }
    //   }
    //   ]
    // });
    // await actionSheet.present();
    this.takePicture(this.camera.PictureSourceType.CAMERA);
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


  ngOnInit() {
    this.badd.date = this.myDate.toString();
    console.log(this.badd);

    this.instantiateForm();
    this.validation_messages = {
      'purpose' : [
        { type: 'required', message: 'Purpose is required.' },
      ]};
  }

}
