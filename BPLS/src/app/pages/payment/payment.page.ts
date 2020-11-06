import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {formatDate} from '@angular/common';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  mop: Array<string>;
  pform:FormGroup;
  pformData = new FormData();
  constructor(private menu:MenuController,
              private formbuilder:FormBuilder,
              private filechooser:FileChooser,
              private file: File,
              private filePath:FilePath,
              private loading:LoadingController,
              private http:HttpClient) { }
  
  
  
  instantiateForm(){
    this.pform = this.formbuilder.group({
      mop: new FormControl('',Validators.compose([
      ])),
      date: new FormControl('',Validators.compose([
      ])),
      orno: new FormControl('',Validators.compose([
      ])),
      amount: new FormControl('',Validators.compose([
      ])),
      bdbname: new FormControl('',Validators.compose([
      ])),
      bdtno: new FormControl('',Validators.compose([
      ])),
      bdamount: new FormControl('',Validators.compose([
      ])),
      bddeposit: new FormControl('',Validators.compose([
      ])),
      opbname: new FormControl('',Validators.compose([
      ])),
      optno: new FormControl('',Validators.compose([
      ])),
      opamount: new FormControl('',Validators.compose([
      ])),
      opdeposit: new FormControl('',Validators.compose([
      ]))
    });
    
  }
  
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
  
  setFile(name,selectname) {

    let filePath = this.file.dataDirectory + name;
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
        this.pformData.append(selectname, imgBlob, name);
        //console.log(JSON.stringify(this.uformData));
        //this.uploadImageData(this.auformData);
    };
    reader.readAsArrayBuffer(file);
  
  }

  async save(val){
    //formatDate(this.user.dob, 'yyyy-MM-dd', 'en');
    const loading = await this.loading.create({
      message: 'Please Wait...',
      });
     await loading.present();
     let users = JSON.parse(localStorage.getItem("user"));  
     console.log(JSON.stringify(val));
     this.pformData.append("action","add");
     this.pformData.append("mop",val.mop);
     this.pformData.append("date",formatDate(val.date, 'yyyy-MM-dd', 'en'));
     this.pformData.append("orno",val.orno);
     this.pformData.append("amount",val.amount);
     this.pformData.append("bdbname",val.bdbname);
     this.pformData.append("bdtno",val.bdtno);
     this.pformData.append("bdamount",val.bdamount);
     this.pformData.append("opbname",val.opbname);
     this.pformData.append("optno",val.optno);
     this.pformData.append("opamount",val.opamount);
     this.pformData.append("uid",users.uid);
     this.http.post(localStorage.getItem("url")+"/controller/paymentcontroller.php",this.pformData)
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

  ionViewWillEnter(){
    this.instantiateForm();
    this.menu.enable(true,'menu-content');
  }
  
  ngOnInit() {
    this.instantiateForm();
    this.menu.enable(true,'menu-content');
    this.mop = [
      "CASH",
      "BANK"
    ];
  }

}
