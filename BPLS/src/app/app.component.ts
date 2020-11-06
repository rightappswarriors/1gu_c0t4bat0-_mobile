import { Component } from '@angular/core';

import { LoadingController, MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { AuthserviceService } from './services/authservice/authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  item = {"item1":false,item2:false};
  public appMenu = [
                    {title:'Dashboard',url:'/main',icon:'speedometer'},
                    {title:'Apply',url:'/apply',icon:'speedometer'},
                    {title:'Upload',url:'/upload',icon:'person'},
                    {title:'Payment',url:'/payment',icon:'person-add'},
                    {title:'Certificate',url:'/certificate',icon:'person-add'}
                    ];

  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ns:NativeStorage,
    private router:Router,
    private as:AuthserviceService,
    private menu:MenuController,
    private loading:LoadingController
  ) {
    this.initializeApp();
  }
   
 
  async initializeApp() {
    // const loading = await this.loading.create({
    //   message: 'Please Wait...',
    //   }); 
    localStorage.setItem("url","http://clients.rightapps.tech/cotabato/cotabato_bpls");
    let users = JSON.parse(localStorage.getItem("user"));
    if(users == null){
      this.router.navigateByUrl("/login");
    }else{
      this.router.navigateByUrl("/main");
    }
    this.platform.ready().then(() => {
      
      //this.splashScreen.hide();
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
      //http://wecompra.rightapps.tech/
      //localStorage.setItem("url","http://192.168.0.104:8080/newproject");
      
     
      console.log(users);
      //localStorage.setItem("url","http://192.168.43.107:8080/newproject");
      this.ns.getItem('gp_user')
      .then( data =>{
        // user is previously logged and we have his data
        // we will let him access the app
        //this.router.navigate(["/tabs/tabs/tab3"]);
        //this.splashScreen.hide();
      }, error =>{
        // /this.router.navigate(["/login"]);
        this.splashScreen.hide();
      });
     
      this.statusBar.styleDefault();
      //loading.dismiss();
    });
  }

  ionViewWillEnter(){
    console.log("execute");
  }

  gotopage(route){
    this.router.navigateByUrl(route);
    this.menu.close();
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

  logout(icon){
    icon.name = 'chevron-forward-outline';
    localStorage.removeItem("user");
    this.item.item1 = false;
    this.router.navigateByUrl("/login");
    //this.menu.close();
  }
}
