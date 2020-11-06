import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cartservice/cart.service';
import { BehaviorSubject } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { AuthserviceService } from 'src/app/services/authservice/authservice.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SellerService } from 'src/app/services/sellerservice/seller.service';
@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  cartItemCount: BehaviorSubject<number>;
  loginstatus = false;
  logintype;
  users = {"opr_name":"register","email":"register","image":"register"};
  //for facebook login register
  regsign = {"action":"register","name":"","email":"","number":"","password":"","imageurl":""};
  item = {"item1":false,item2:false};
  //for shop details
  shop = {"action":"get","shop_name":"","uid":"","imageurl":""};
  public appMenu = [{title:'Dashboard',url:'/tabs/tabs/tab1',icon:'home-outline'},
                    {title:'Barangay Clearance',url:'',icon:'apps-outline'},
                    {title:'Settings',url:'shop',icon:'settings-outline'}
                    ];
  constructor(private router:Router,
              private cartservice:CartService,
              private ns:NativeStorage,
              private fb:Facebook,
              private as:AuthserviceService,
              private gp:GooglePlus,
              public alert: AlertController,
              private http:HttpClient,
              private seller:SellerService) 
  { 
   
  }
  
  gotopage(route){
    this.router.navigateByUrl(route);
  }
  //go to login page 
  login(){
     this.router.navigateByUrl("/login");
  }
  //go to sign up page
  signup(){
    this.router.navigateByUrl("/signup");
  }

  //go to cart
  cart(){
    if(this.loginstatus != false){
      this.router.navigateByUrl("/cart");
    }else{
      this.router.navigateByUrl("/login");
    }
  }
  
  //go to another page
 
  //alert message
  

  makerandomstring(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 
  

  
  //logout user
  logout() {
    this.as.removeUser();
    // this.fb.logout()
    //   .then( res => { 
    //     this.loginstatus = false;
    //   })
    //   .catch(e => console.log('Error logout from Facebook', e));  
    // this.gp.trySilentLogin({})
    //     .then(res => {
    //       this.gp.logout()
    //       .then(res =>{
    //         //user logged out so we will remove him from the NativeStorage
    //         this.loginstatus = false;
    //       }, err =>{
    //         console.log('Error logout from Google',err)
    //       })
    //     })
    //     .catch(err => console.error(err));
    this.loginstatus = false;
    this.router.navigateByUrl("/login");     
  }
  //end of logout

  ionViewWillEnter(){
    console.log("ionviewwillenter")
    let users = JSON.parse(localStorage.getItem("user"));
    this.users.opr_name = users.opr_name;
    this.users.email = users.email;
    this.users.image = localStorage.getItem("url")+"/files/users/newuser.jpg";
    //console.log(this.users.opr_name);
    //this.getItems();
    
  }
  
  showitem(icon,i){
    icon.name = icon.name === 'chevron-forward-outline' ? 'chevron-down-outline':'chevron-forward-outline';
    if(i == 1){
      if(this.item.item1 != false){
        this.item.item1 = false;
      }else{
        this.item.item1 = true;
      }
    }else{
      if(this.item.item2 != false){
        this.item.item2 = false;
      }else{
        this.item.item2 = true;
      }
    }
  }
  ngOnInit() {
    let users = JSON.parse(localStorage.getItem("user"));
    this.users.opr_name = users.opr_name;
    this.users.email = users.email;
    this.users.image = localStorage.getItem("url")+"/files/users/newuser.jpg";
  }

}
