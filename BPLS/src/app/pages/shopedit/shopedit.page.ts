import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice/authservice.service';
import { SellerService } from 'src/app/services/sellerservice/seller.service';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';

import { File, FileEntry } from '@ionic-native/File/ngx';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
 
import { finalize } from 'rxjs/operators';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-shopedit',
  templateUrl: './shopedit.page.html',
  styleUrls: ['./shopedit.page.scss'],
})
export class ShopeditPage implements OnInit {
  users;

  //for the send to server data
  shopedit = {"action":"update","shopname":"","shopdesc":"","shopimage":"","uid":""};
  uformData = new FormData();

  //for image
  imgfilepath;

  
  constructor(private router:Router,private seller:SellerService,
              private http:HttpClient,private as:AuthserviceService,
              private camera: Camera, private file: File,
              private webview: WebView,private actionSheetController: ActionSheetController,
              private plt: Platform,private loadingController: LoadingController,
              private ref: ChangeDetectorRef,private filePath: FilePath) 
  { 

  }


  // go to shop dashboard
  gotodashboard(){
    this.router.navigateByUrl("/seller");
  }

  update(){
    this.shopedit.uid = this.users.uid;
    //shopedit = {"action":"update","shopname":"","shopdesc":"","shopimage":"","uid":""};

    //store in form format and sent to the server
    this.uformData.append("action",this.shopedit.action);
    this.uformData.append("shopname",this.shopedit.shopname);
    this.uformData.append("shopdesc",this.shopedit.shopdesc);
    this.uformData.append("uid",this.shopedit.uid);
    
    this.http.post(localStorage.getItem("url")+"/controller/sellercontroller.php",this.uformData)
    .subscribe(data=>{
       let res:any = data;
       console.log(JSON.stringify(res));
       if(res.message == "success"){
           this.seller.addSeller(res.shop);
           this.router.navigateByUrl("/seller");
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
    this.shopedit.shopimage = resPath;
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
    };
    reader.readAsArrayBuffer(file);
  
  }
  //end for selecting pictures functions
  

  //initialize display
  ionViewWillEnter(){
    console.log("ionviewwillenter")
    let seller = this.seller.getSeller();
    if(seller !=null){
       console.log("true");
       for(let s of seller){
         this.shopedit.shopname = s.shop_name;
         this.shopedit.shopdesc = s.shop_description;
         this.shopedit.shopimage = localStorage.getItem("url")+"/files/users/"+s.shop_image; 
      }
    }

    console.log(JSON.parse(localStorage.getItem("user")));
    let u = JSON.parse(localStorage.getItem("user"));
    if(u!=null){
       console.log('true');
       this.users = JSON.parse(localStorage.getItem("user"));
    }
    this.as.getUserNS().then(data=>{
      console.log('truenative');
      this.users = data;
    }, err =>{
    });
  }

  ngOnInit() {
  }


}
