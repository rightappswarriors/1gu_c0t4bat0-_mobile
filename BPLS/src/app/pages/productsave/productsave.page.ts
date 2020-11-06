import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { SellerService } from 'src/app/services/sellerservice/seller.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';
@Component({
  selector: 'app-productsave',
  templateUrl: './productsave.page.html',
  styleUrls: ['./productsave.page.scss'],
})
export class ProductsavePage implements OnInit {
   
  title = "Add Product";
  action;
  cat2 = false;
  sellerid;
  brandlist;
  categorylist;
  variation = [];
  form:FormGroup;
  pformData = new FormData();
  validation_messages;

  image = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";
  imgfilepath;
  imagelist = [];
  
  //for variation
  checkvariation = false;
  variant = [];
  varopt0 = [];
  varopt1 = [];
  varopt = [this.varopt0,this.varopt1];
  varstock = [];
  //end for variation

  prodid;
  
  constructor(private router:Router,private http:HttpClient,private formbuilder:FormBuilder,
              private loading:LoadingController,private seller:SellerService,private camera: Camera, 
              private file: File,private webview: WebView,private actionSheetController: ActionSheetController,
              private plt: Platform,private loadingController: LoadingController,private ref: ChangeDetectorRef,
              private filePath: FilePath,private imagepick:ImagePicker,private route: ActivatedRoute) 
  { 
    
  }
  
  async save(val){
    console.log(val);
    //set variation item preparation for sending data to the databas
    let varitems = [];
    for(let o of this.varstock){
        let type,options,price,stock;
        type = this.variant.join(",").toString();
        options = o.optvalue;
        price = o.price;
        stock = o.stock;
        if(o.varstockopt2.length !=0){
          for(let o2 of o.varstockopt2){
              options = [o.optvalue,o2.optvalue].join(",");
              price = o2.price;
              stock = o2.stock;
              varitems.push({"type":type,"options":options,"price":price,"stock":stock});
          }
        }else{
          varitems.push({"type":type,"options":options,"price":price,"stock":stock});
        }
        
    }
    const loading = await this.loading.create({
      message: 'Pleaste Wait...',
      });
      await loading.present();

    this.pformData.append("action",this.action);
    this.pformData.append("name",val.name);
    this.pformData.append("desc",val.desc);
    this.pformData.append("category",val.category);
    this.pformData.append("brand",val.brand);
    this.pformData.append("price",val.price);
    this.pformData.append("stock",val.stock);
    this.pformData.append("sellerid",this.sellerid);
    this.pformData.append("variation",JSON.stringify(varitems));
    //for update purpose
    this.pformData.append("prodid",this.prodid);
   
    this.http.post(localStorage.getItem("url")+"/controller/productscontroller.php",this.pformData)
        .subscribe(data=>{
          console.log(data);
          let response:any = data;
          this.uploadimages(response.prodid);
          loading.dismiss();
          this.router.navigateByUrl("/sellerproducts");
        },
        (err)=>{
          console.log(JSON.stringify(err));
        }
        );
  }

  uploadimages(sellerid){
    if(this.imagelist.length != 0){
      for(let i of this.imagelist){
        this.file.resolveLocalFilesystemUrl(i.imagefilepath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFiles(file,sellerid))
        })
        .catch(err => {
             console.log("Error while reading file.");
            //this.presentToast('Error while reading file.');
        });
  
      }
    }
  }
  //check if category has subcategory
  onChangeCat1(e){
    console.log(e.target.value);
    //this.cat2 = true;
  }

  // go to products
  gotoproducts(){
     this.router.navigateByUrl("/sellerproducts")
  }

  //get brand data in the server
  dispbrand(){
    let brand = {"action":"getbrand"}
    this.http.post(localStorage.getItem("url")+"/controller/productscontroller.php",JSON.stringify(brand))
    .subscribe(data=>{
       let res:any = data;
       this.brandlist = res.brand;
       console.log(JSON.stringify(res));
    },
    (err)=>{
      console.log(JSON.stringify(err));
    }
    );
  }
  
  //get category data in the server
  dispcategory(){
    let category = {"action":"getcategory"}
    this.http.post(localStorage.getItem("url")+"/controller/productscontroller.php",JSON.stringify(category))
    .subscribe(data=>{
       let res:any = data;
       this.categorylist = res.category;
       console.log(JSON.stringify(res));
    },
    (err)=>{
      console.log(JSON.stringify(err));
    }
    );
  }

  //initialize display
  ionViewWillEnter(){
    console.log("ionviewwillenter")
    let seller = this.seller.getSeller();
    if(seller !=null){
       console.log("true");
       for(let s of seller){
         this.sellerid = s.sellerid;
      }
    }
  }

  //for selecting pictures functions
  async selectImages() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Select in Gallery', 
        handler: () => {
                  this.takePictures();
              }
      }
      ]
    });
    await actionSheet.present();
  }

  takePictures() {

    var options:ImagePickerOptions = {
      maximumImagesCount:5,
      quality:100
    };

    this.imagepick.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        let filename = results[i].substring(results[i].lastIndexOf('/')+1);
        let path = results[i].substring(0,results[i].lastIndexOf('/')+1);
        this.copyFileToLocalDir(path, filename, this.createFileName());
      }
    }, (err) => {
      alert(err);
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
        this.setImages(newFileName);
    }, error => {
        //this.presentToast('Error while storing file.');
    });
   }
   
   setImages(name) {
    let filePath = this.file.dataDirectory + name;
    let resPath = this.pathForImage(filePath);
    this.imagelist.push({"imageres":resPath,"imagefilepath":filePath});
    this.ref.detectChanges();
   }

   pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  readFiles(file: any,id: any) {

    const reader = new FileReader();
    reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        this.pformData.append("action","uploadimage");
        this.pformData.append("prodid",id);
        this.pformData.append('file', imgBlob, file.name);
        this.http.post(localStorage.getItem("url")+"/controller/productscontroller.php",this.pformData)
        .subscribe(data=>{
          console.log(data);
          let response:any = data;
        },
        (err)=>{
          console.log(JSON.stringify(err));
        }
        );
    };
    reader.readAsArrayBuffer(file);
  
  }

  //end for selecting pictures functions
  

  //for variations
  closevar(){
    this.checkvariation = false;
    this.variant = [];
    this.varopt0 = [];
    this.varopt1 = [];
    this.varopt = [this.varopt0,this.varopt1];
    this.varstock = [];
  }

  addvariation(){
    this.checkvariation = true;
  }

  onChangeVartype(e){
    console.log(e.target.value);
    this.variant = e.target.value;
  }
  //for adding options in variations
  addvaropt(i){
    this.varopt[i].push({"optvalue":"","opt":"Name"});
    this.varstock = [];
  }
  //for removing options in variations
  removevaropt(i){
    this.varopt[i].splice(this.varopt[i].length-1,1);
    this.varstock = [];
  }
  
  //add value for the option
  varvalue(e,i,oi:any){
    this.varopt[i][oi].optvalue = e.target.value;
    this.varstock = [];
    //console.log("value of index "+i+" and option index "+oi+":"+e.target.value);
    //console.log("after:"+JSON.stringify(this.varopt[i][oi].optvalue));
  }

  //set stock and price
  setstockprice(){
     let varstockopt1 = [];
     let varstockopt2 = [];
     for(let v of this.varopt0){
        varstockopt2 = [];
        if(this.varopt1.length !=0){
          for(let v1 of this.varopt1){
            varstockopt2.push({"optvalue":v1.optvalue,"stock":"","price":""});
          }
        }
        varstockopt1.push({"optvalue":v.optvalue,"stock":"","price":"","varstockopt2":varstockopt2});
     }
     this.varstock = varstockopt1;
  }
   
  //input stock price
  varstockprice(e,i,oi:any,opt:any,set:any){
    if(opt == 1){
      if(set == "stock"){
        this.varstock[i].stock = e.target.value;
      }else{
        this.varstock[i].price = e.target.value;
      }
    }else{
      if(set == "stock"){
        this.varstock[i].varstockopt2[oi].stock = e.target.value;
      }else{
        this.varstock[i].varstockopt2[oi].price = e.target.value;
      }
    }
  }

  stockprice(){
    console.log(JSON.stringify(this.varstock));
  }

  //end for variations
  ngOnInit() {
    this.dispbrand();
    this.dispcategory();
    let prodname,proddesc,brandid,catid,vartype=[];
    let option,option1;
    let varstockopt1 = [];
    let varstockopt2 = [];
    let tempvaropt1 = [];
    this.action = "add";
    //if the update click get the details from the server
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.checkvariation = true;
        let item = this.router.getCurrentNavigation().extras.state.productitem;
        this.title = "Edit Product";
        this.action = "update";
        this.prodid = item.prodid;
        prodname = item.prodname;
        proddesc = item.proddesc;
        brandid = item.brandid;
        catid = item.catid;
        for(let v of item.variation){
             varstockopt2 = [];
             let vtype = v.type;
             vartype = vtype.split(",");
             let options = v.options.split(",");
             if(this.varopt0.length != 0){
                let filter = this.varopt0.filter(item => {
                  return item.optvalue.toLowerCase().indexOf(options[0].toLowerCase()) > -1;
                });
                if(filter.length == 0){
                  this.varopt0.push({"optvalue":options[0],"opt":"Name","stock":v.stock,"price":v.price});
                }
             }else{
              this.varopt0.push({"optvalue":options[0],"opt":"Name","stock":v.stock,"price":v.price});
             }
             if(options.length == 2){
                if(this.varopt1.length != 0){
                  let filter = this.varopt1.filter(item => {
                    return item.optvalue.toLowerCase().indexOf(options[1].toLowerCase()) > -1;
                  });
                  if(filter.length == 0){
                    this.varopt1.push({"optvalue":options[1],"opt":"Name"});
                  }
                }else{
                  this.varopt1.push({"optvalue":options[1],"opt":"Name"});
                }
                tempvaropt1.push({"optvalue":options[1],"stock":v.stock,"price":v.price,"option1":options[0]});
             }             
        }
      }
    });
    this.variant = vartype;
    this.varopt = [this.varopt0,this.varopt1];
    //console.log("Options:"+JSON.stringify(this.varopt));
    if(this.varopt0.length != 0){
      for(let v of this.varopt0){
        varstockopt2 = [];
        if(this.varopt1.length !=0){
          for(let v1 of tempvaropt1){
            if(v1.option1 == v.optvalue){
              varstockopt2.push({"optvalue":v1.optvalue,"stock":v1.stock,"price":v1.price});
            }
          }
        }
        varstockopt1.push({"optvalue":v.optvalue,"stock":v.stock,"price":v.price,"varstockopt2":varstockopt2});
     }
     this.varstock = varstockopt1;
     //console.log("Stock and price"+JSON.stringify(this.varstock));
    }

    //instantiate form 
    this.form = this.formbuilder.group({
      name: new FormControl(prodname,Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])),
      desc: new FormControl(proddesc,Validators.compose([Validators.required])),
      category: new FormControl(catid,Validators.compose([Validators.required])),
      brand: new FormControl(brandid,Validators.compose([Validators.required])),
      price: new FormControl('',null),
      stock: new FormControl('',null),
      vartype: new FormControl(vartype,null)
    });
    
    // for validation messages
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Product name is required.' },
        { type: 'minlength', message: 'Product name must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Product name cannot be more than 100 characters long.' }
      ],
      'desc' : [
        { type: 'required', message: 'Product Description is required.' }
      ],
      'category' : [
        { type: 'required', message: 'Product Category is required.' }
      ],
      'brand' : [
        { type: 'required', message: 'Product Brand is required.' }
      ]
    };
    
    
  }

}
