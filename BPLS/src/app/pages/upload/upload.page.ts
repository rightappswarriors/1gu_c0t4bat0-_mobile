import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingController, MenuController,Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  upload = {"action":"save","prev":""};
  uformData = new FormData();
  uform:FormGroup;
  validation_messages;
  image = "assets/user.png";
  imagename = "";
  constructor(private menu:MenuController,private filechooser:FileChooser,
              private filePath:FilePath,private file: File,
              private http:HttpClient,private loading:LoadingController,
              private formbuilder:FormBuilder,private plt: Platform,
              private ref: ChangeDetectorRef,private camera: Camera,
              private webview: WebView) { }
  
  select(selectname,input){
    console.log("click");
    let filter={ "mime": "application/pdf" }
    this.filechooser.open().then(uri => {
      this.filePath.resolveNativePath(uri)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
                    let nameext = currentName.substring(currentName.lastIndexOf('.') + 1);
                    input.value = currentName;
                    //this.pToast(currentName);
                    console.log("filepath:"+filePath);
                    console.log("correct path:"+correctPath);
                    console.log("currentName:"+currentName);
                    console.log("nameext:"+nameext);
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(nameext),selectname);
                });
    })
    .catch(e => console.log(e));
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
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
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
                    let nameext = currentName.substring(currentName.lastIndexOf('.') + 1);
                    //this.pToast(currentName);
                    this.imagename = currentName;
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(nameext),"passimage");
                });
        } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            let nameext = currentName.substring(currentName.lastIndexOf('.') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(nameext),"passimage");
        }
    });
  
  }

  createFileName(ext) {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + "."+ext;
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName, selectname) {
    console.log("newFIleName:"+newFileName);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
       this.setFile(newFileName,selectname);
    }, error => {
        //this.presentToast('Error while storing file.');
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  
  setFile(name,selectname) {

    let filePath = this.file.dataDirectory + name;
    if(selectname == "passimage"){
      let resPath = this.pathForImage(filePath);
      this.image = resPath;
    }
    // let resPath = this.pathForImage(filePath);
    // this.image = resPath;
    // this.imgfilepath = filePath;
    // this.ref.detectChanges();
    //if the user has choose files
    if(filePath != null){
      console.log("Not Empty File");
      this.file.resolveLocalFilesystemUrl(filePath)
      .then(entry => {
          ( < FileEntry > entry).file(file => this.readFile(file,selectname,name))
      })
      .catch(err => {
           console.log("Error while reading file.");
          //this.presentToast('Error while reading file.');
      });
     }else{
       console.log("Empty File");
     }
  
  }

  readFile(file: any,selectname,name) {

    const reader = new FileReader();
    reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        //console.log("filenames:"+file.name);
        this.uformData.append(selectname, imgBlob, name);
        //console.log(JSON.stringify(this.uformData));
        //this.uploadImageData(this.auformData);
    };
    reader.readAsArrayBuffer(file);
  
  }

  async save(val){
    console.log(JSON.stringify(val));
    const loading = await this.loading.create({
      message: 'Please Wait...',
      });
    await loading.present();
    let users = JSON.parse(localStorage.getItem("user"));    
    this.uformData.append("action","add");
    this.uformData.append("passport_name",this.imagename);
    this.uformData.append("prevypermit_name",val.prevypermit);
    this.uformData.append("prevclearance_name",val.prevclearance);
    this.uformData.append("prevclearanceh_name",val.prevclearanceh);
    this.uformData.append("comtax_name",val.comtax);
    this.uformData.append("grossSales_name",val.grossSales);
    this.uformData.append("offreceipt_name",val.offreceipt);
    this.uformData.append("certificate_tax_name",val.certificate_tax);
    this.uformData.append("uid",users.uid);
    this.http.post(localStorage.getItem("url")+"/controller/uploadcontroller.php",this.uformData)
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
  
  instantiateForm(){
    this.uform = this.formbuilder.group({
      prevypermit: new FormControl('',Validators.compose([
        Validators.required
      ])),
      prevclearance: new FormControl('',Validators.compose([
        Validators.required
      ])),
      prevclearanceh: new FormControl('',Validators.compose([
        Validators.required
      ])),
      comtax: new FormControl('',Validators.compose([
        Validators.required
      ])),
      grossSales: new FormControl('',Validators.compose([
        Validators.required
      ])),
      offreceipt: new FormControl('',Validators.compose([
        Validators.required
      ])),
      certificate_tax: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });
  }

  ionViewWillEnter(){
    this.instantiateForm();
    this.menu.enable(true,'menu-content');
  }
  
  ngOnInit() {
    this.instantiateForm();
    this.validation_messages = {
      'prevypermit' : [
        { type: 'required', message: "Previous Year's Permit is required." }
      ],
      'prevclearance' : [
        { type: 'required', message: 'Previous Clearance- Fire is required.' }
      ],
      'comtax' : [
        { type: 'required', message: 'Community Tax - Current year is required.' }
      ],
      'grossSales' : [
        { type: 'required', message: 'Gross Sales Receipts of Preceding Year is required.' }
      ],
      'offreceipt' : [
        { type: 'required', message: 'Official Receipts Showing All Regulatory Fees is required.' }
      ],
      'certificate_tax' : [
        { type: 'required', message: 'Certificate Attesting Tax Exemptions is required.' }
      ]
    };
    this.menu.enable(true,'menu-content');
  }

}
