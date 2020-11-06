import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
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
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ns:NativeStorage,
    private router:Router,
    private as:AuthserviceService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      //this.splashScreen.hide();
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
      //http://wecompra.rightapps.tech/
      //localStorage.setItem("url","http://192.168.0.104:8080/newproject");
      localStorage.setItem("url","http://clients.rightapps.tech/cotabato/mobile");
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
    });
  }
}
