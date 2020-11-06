import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { HttpClient } from '@angular/common/http';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.page.html',
  styleUrls: ['./certificate.page.scss'],
})
export class CertificatePage implements OnInit {
  pdfobj = null;
  logoData = null;
  elementType = 'canvas';
  qrdata = 'sample';
  qrpic = null;
  constructor(private menu:MenuController,
              private loading:LoadingController,
              private platform:Platform,
              private file:File,
              private prevAny:PreviewAnyFile,
              private http:HttpClient
              ) 
  { 

  }
  
  downloadQR(){
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imagedata = canvas.toDataURL('image/jpeg').toString();
    //console.log("data: ",imagedata);
    this.qrpic = imagedata;
  }

  loadLocalAssetToBase64(){
    this.http.get('./assets/cotabato.png',{responseType : 'blob'})
    .subscribe(res=>{
      const reader = new FileReader();
      reader.onloadend = () =>{
        this.logoData = reader.result;
      }
      reader.readAsDataURL(res);
    });
  }

  create(){
    const docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      content: [
        {
            margin:[0,0,0,10],
            columns: [
                {
                    width: 'auto',
                    stack: [
                        {
                            image: this.logoData,
                            width:160,
                            height:160
                        }    
                    ]
                },
                {
                    width: '*',
                    alignment: 'center',
                    margin:[0,15,0,0],
                    stack: [
                        {
                            style: 'h1',
                            text: 'CITY GOVERNMENT OF COTABATO'
                        },
                        {
                            style: 'h2',
                            text: 'BUSINESS PERMITS & LICENSING OFFICE'
                        },
                        {
                            style: 'h1',
                            text: 'BUSINESS PERMIT'
                        }
                    ]
                }
            ]
        },
        {
          columns: [
            {
                width: 160,
                text:' ',
            },
            {
                width: '*',
                table:{
                  widths: ["*"],
                  body: 
                  [
                    [
                      {text: "OWNER'S NAME",bold: true,alignment: 'center',fontSize: 15}
                    ],
                    [
                      {text: 'BUSINESS ADDRESS',bold: true,alignment: 'center',fontSize: 15}
                    ],
                    [
                      {text: 'BUSINESS/TRADE NAME',bold: true,alignment: 'center',fontSize: 15,margin:[0,8,0,8]}
                    ],
                    [
                      {
                        alignment: 'center',
                        border: [false, true, false, false],
                        text: 'To engage in or operate the above mentioned business/trade activity,specially as;'
                      }
                     
                    ],
                    [
                      {text: 'NATURE OF BUSINESS',bold: true,alignment: 'center',fontSize: 15,margin:[0,8,0,8]}
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        margin:[20,0,20,20],
                        
                        text: [
                          {text: 'The permit is granted is subject to all existing pertinent laws governing the business or trade activity.\n',fontsize:7},
                          {text: 'Any violations of the terms and conditions for which it was granted shall be enough ground for its revocation and closure of the\n'},
                          {text: 'business establishment.\n'},
                          {text: 'The permit is valid until __________________ and renewable not later than __________________ of the succeeding year,unless sooner revoked\n'},
                          {text: 'The permit must be displayed in a conspicious place of the business establishment otherwise, a fine of P 1,000.00 will be levited.\n'},
                        ]
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        columns:[
                          {
                            width:540,
                            alignment:'center',
                            text:[
                              {text:'NAME OF MAYOR\n'},
                              {text:'CITY MAYOR'}
                            ],
                            fontSize: 15,
                            bold:true
                          },
                          {
                            alignment:'right',
                            qr: 'sample business permit', fit: '60'
                            // image: this.qrpic,
                            // width:60,
                            // height:60
                          }
                        ],
                        
                      }
                    ]
                  ]
                }
            }
          ]
        }
    ],
    styles: {
        h1: {
            fontSize: 38,
            bold: true
        },
        h2: {
            fontSize: 30
        }
    }
    };
    this.pdfobj = pdfMake.createPdf(docDefinition);
    
  }



  async print(){

    const loading = await this.loading.create({
      message: 'Please Wait...',
      });
      await loading.present();
      this.create();
      if(this.platform.is('cordova')){
        this.pdfobj.getBuffer((buffer) => {
            let fakename = Date.now();
            let utf8 = new Uint8Array(buffer);
            let binaryArray = utf8.buffer;
            console.log(JSON.stringify(this.file.externalDataDirectory));
            loading.dismiss();
            this.file.writeFile(this.file.externalDataDirectory , fakename+'.pdf', binaryArray, {replace:false});
            this.prevAny.preview(this.file.externalDataDirectory+fakename+'.pdf').then(()=>{
                  console.log("success");
                },(err)=>{
                  console.log(JSON.stringify(err));
                });
        });
        
    }else{
      loading.dismiss();
      this.pdfobj.open();
    }
  }
  
  ionViewWillEnter(){
    this.loadLocalAssetToBase64();
    this.downloadQR();
    this.menu.enable(true,'menu-content');
  }

  ngOnInit() {
    this.menu.enable(true,'menu-content');
  }
  
}
