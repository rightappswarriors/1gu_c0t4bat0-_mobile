import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {
  
  blist = {"action":"getallapp","uid":""};
  bitems;
  // bitems = [{blocks: "block11",brgy: "Bagua II",city: "Cotabato",date_of_app: "2020-10-26",first_name: "Ranz",house_no: "house11"
  // ,last_name: "Padoga",middle_name: "Luzon",purpose: "testing only",status: "On Process",street: "N Bacalso",uid: "yando431"}];
  logoData = null;
  qrpic = null;
  userpic = null;
  pdfobj = null;
  qrdata = 'sample';
  elementType = 'canvas';
  scancode = null;
  viewqr = false;
  constructor(private router:Router,private http:HttpClient,
              private loading:LoadingController,private document:DocumentViewer,
              private file:File,private platform:Platform,private fileopener:FileOpener,
              private ft:FileTransfer,private prevAny:PreviewAnyFile) { }

  backtotab3(){
    this.router.navigateByUrl("/tabs/tabs/tab3");
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

  create(data){
    var name = data.first_name+' '+data.last_name;
    var addr = data.street + ' '+ data.brgy + ' '+ data.city;
    const docDefinition = {
      content: [
        // { qr: 'sample' },
        {
          pageSize: 'A4',
          columns: [
            {
              image: this.logoData,
              width:100
            },
            {
              text: 'REPUBLIC OF THE PHILIPPINES\nCOTABATO CITY',
              style: 'headertitle',
              width:275,
              alignment: 'center'
            }
            // {
            //   image: this.logoData,
            //   width:100
            // }
          ]
        },
        { 
          alignment: 'center',
          text: 'BARANGAY CLEARANCE\n', style: 'header',decoration: 'underline',
          margin: [0,0,0,20]
        },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: [ 120,376],
            body: 
            [
              [ 
                {
                  border: [false, true, false, false],
                  alignment: 'center',
                  width:120,
                  text: [
                    {text: '\nSANGUNNIANG BARANGAY\n\n\n\n',bold: true},
                    {text: 'MARK DELA ROSA\n',bold: true},
                    {text: 'BARANGAY CHAIRMAN',bold: true}
                  ],
                  fontSize: 11
                }, 
                {
                  border: [true, true, false, false],
                  columns: [
                    {
                      alignment: 'left',
                      width:'*',
                      text: 'TO WHOM IT MAY CONCERN:',
                      margin: [0,50,50,50]
                    },
                    {
                      width:100,
                      height:100,
                      image: data.user_image
                    }
                  ],
                  
              }],
              [ 
                {
                  border: [false, false, false, false],
                  rowSpan: 3,
                  alignment: 'center',
                    width:120,
                    text: [
                      {text: 'KAGAWAD\n',bold: true},
                      {text: 'JOEMAR M LOGARTO\n',bold: true}
                    ],
                    fontSize: 11
                }
                , 
                {
                  border: [true, false, false, false],
                  text: [
                    {text: '\u200B\t\t\THIS IS TO CERTIFY that  '},
                    {text: name,bold: true,decoration: 'underline'},
                    '  of legal age, married/single, Filipino, is a bonafide resident of  ',
                    {text: addr,bold: true,decoration: 'underline'},
                    '  Barangay Cotabato City, and that he/she has no derogatory / criminal records filed in this Barangay.'
                  ],
                  fontSize: 15,
                  lineHeight: 1.5,
                  margin: [0,0,0,50]
                }
              ],
              ['',
                {
                  border: [true, false, false, false],
                  text: [
                    {text: '\u200B\t\t\ISSUED THIS  '},
                    {text: '11th',bold: true,decoration: 'underline'},
                    '  day of  ',
                    {text: 'FEBRUARY 2020',bold: true,decoration: 'underline'}
                  ],
                  fontSize: 15
                } 
              ],
              ['',
                {
                  border: [true, false, false, false],
                  columns: [
                    {
                      alignment: 'center',
                      width:150,
                      text: [
                        {text: name+'\n',bold: true,decoration: 'underline'},
                        {text: 'SIGNATURE\n',bold: true}
                      ]
                    },
                    {
                      alignment: 'center',
                      width:'auto',
                      text: [
                        {text: 'MARK DELA ROSA\n',bold: true,decoration: 'underline'},
                        {text: 'BARANGAY CAPTAIN\n',bold: true}
                      ]
                    }
                  ],
                  margin: [20,100,20,0],
                  fontSize: 15
                }
              ],
              [
                {
                  border: [false, false, false, true],
                  alignment: 'center',
                    width:120,
                    text: [
                      {text: 'FELY UY\n',bold: true},
                      {text: 'SK CHAIRMAN',bold: true}
                    ],
                    fontSize: 11
                }
                ,
                {
                  border: [true, false, false, true],
                  columns: [
                    {
                      width:255,
                      text:'',
                      // margin: [50,35,0,0],
                      // bold: true
                      // text: [
                      //   {text: name+'\n',bold: true,decoration: 'underline'},
                      //   {text: 'SIGNATURE\n',bold: true}
                      // ]
                    },
                    [
                      {
                        // alignment:'right',
                        // qr: 'text in QR', 
                        // fit: '83'
                        width:100,
                        height:100,
                        image: this.qrpic,
                      },
                      {
                        text:'R0700120',
                        bold:true,
                        margin: [15,0,0,0]
                      }
                    ]
                  ],
                  fontSize: 15,
                  margin: [0,20,0,0]
                } 
              ]
            ]
          }
        }
      ],
      styles:{
        headertitle:{
          bold: true,
          fontSize: 12,
          margin: [0,0,0,0]
        },
        header:{
          fontSize: 18,
          bold: true,
          margin: [0,0,0,0]
        },
        subheader:{
          fontSize: 14,
          bold: true,
          margin: [0,15,0,0]
        }
      },
      defaultStyle: {
        columnGap: 20
      }
    };
    this.pdfobj = pdfMake.createPdf(docDefinition);
    
  }

  createv1(data){
    var name = data.first_name+' '+data.last_name;
    var addr = data.street + ' '+ data.brgy + ' '+ data.city;
    const docDefinition = {
      content: [
        {
          pageSize: 'A4',
          columns: [
            {
              image: this.logoData,
              width:100
            },
            {
              text: 'REPUBLIC OF THE PHILIPPINES\nCOTABATO CITY',
              style: 'headertitle',
              width:275,
              alignment: 'center'
            }
            // {
            //   image: this.logoData,
            //   width:100
            // }
          ]
        },
        { 
          alignment: 'center',
          text: 'BARANGAY CLEARANCE', style: 'header',decoration: 'underline'
        },
        {
          columns: [
            {
              alignment: 'left',
              width:375,
              text: 'TO WHOM IT MAY CONCERN:',
              margin: [20,50,50,50]
            },
            {
              width:100,
              height:100,
              image: this.userpic
              // image: data.user_image
            }
          ]
        },
        {
          text: [
            {text: '\u200B\t\t\THIS IS TO CERTIFY that  '},
            {text: name,bold: true,decoration: 'underline'},
            '  of legal age, married/single, Filipino, is a bonafide resident of  ',
            {text: addr,bold: true,decoration: 'underline'},
            '  Barangay Cotabato City, and that he/she has no derogatory / criminal records filed in this Barangay.'
          ],
          fontSize: 15,
          lineHeight: 1.5,
          margin: [0,0,0,50]
        },
        {
          text: [
            {text: '\u200B\t\t\ISSUED THIS  '},
            {text: '11th          ',bold: true,decoration: 'underline'},
            '  day of  ',
            {text: 'FEBRUARY 2020           ',bold: true,decoration: 'underline'}
          ],
          fontSize: 15
        },
        {
          columns: [
            {
              alignment: 'center',
              width:238,
              text: [
                {text: name+'\n',bold: true,decoration: 'underline'},
                {text: 'SIGNATURE\n',bold: true}
              ]
            },
            {
              alignment: 'center',
              width:238,
              text: [
                {text: 'MARK DELA ROSA\n',bold: true,decoration: 'underline'},
                {text: 'BARANGAY CAPTAIN\n',bold: true}
              ]
            }
          ],
          margin: [20,100,20,0],
          fontSize: 15
        }
        // {
        //   table: {
        //     widths: [170, 330],
        //     body: [
        //       ['SANGGUINIANG BARANGAY', 
        //       {text:'No. 14095',alignment: 'right'}],
        //       ['One value goes here', 'CERTIFICATION']
        //     ]
        //   }
        // }
      ],
      styles:{
        headertitle:{
          bold: true,
          fontSize: 12,
          margin: [0,0,0,0]
        },
        header:{
          fontSize: 18,
          bold: true,
          margin: [0,0,0,0]
        },
        subheader:{
          fontSize: 14,
          bold: true,
          margin: [0,15,0,0]
        }
      },
      defaultStyle: {
        columnGap: 20
      }
    };
    this.pdfobj = pdfMake.createPdf(docDefinition);
    
  }

  viewpdf(){
    let filepath = this.file.applicationDirectory + "www/assets";
    let downloadurl = 'https://cityofsanfernando.gov.ph/files/lbod/accessory-permit-forms-(fencing-demoliton-sign-permit)/demolition-permit/3-Brgy-Clearance.pdf';
    let path = this.file.dataDirectory;

    //const options: DocumentViewerOptions = { title:'My PDF'}
    //this.document.viewDocument(filepath+'/brgy.pdf','application/pdf',options);
    
    if(this.platform.is('ios')){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.dataDirectory;
    }
    
    this.prevAny.preview(downloadurl).then(()=>{
      console.log("success");
    },(err)=>{
      console.log(JSON.stringify(err));
    });
  
  }

  
  async print(data){
    console.log(data);
    const loading = await this.loading.create({
      message: 'Please Wait...',
      });
      await loading.present();
    this.create(data);
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
      this.pdfobj.download();
    }
  }

  async getdispblist(){
    let users = JSON.parse(localStorage.getItem("user"));
    this.blist.uid = users.uid;
    const loading = await this.loading.create({
      message: 'Pleaste Wait...',
      });
      await loading.present();
        this.http.post(localStorage.getItem("url")+"/controller/brgycontroller.php",JSON.stringify(this.blist))
        .subscribe(data=>{
          console.log(data);
          let response:any = data;
          this.bitems = response.brgy;
          console.log(this.bitems);
          loading.dismiss();
        },
        (err)=>{
          console.log(JSON.stringify(err));
        }
        );
  }

  downloadQR(){
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imagedata = canvas.toDataURL('image/jpeg').toString();
    //console.log("data: ",imagedata);
    this.qrpic = imagedata;
    this.userpic = imagedata;
  }
  ionViewWillEnter(){
     this.getdispblist();
     this.downloadQR();
     this.loadLocalAssetToBase64();
  }

  ngOnInit() {
    //this.getdispblist();
  }

}
