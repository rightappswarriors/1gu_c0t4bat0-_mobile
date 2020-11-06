import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  menus = [
          {name:"Apply",icon:"checkmark-circle-outline",url:"/apply"},
          {name:"Upload",icon:"cloud-upload-outline",url:"/upload"},
          {name:"Payment",icon:"wallet-outline",url:"/payment"},
          {name:"Certificate",icon:"medal-outline",url:"/certificate"}
          ];
  constructor(private menu:MenuController,private http:HttpClient,private router:Router) { }


  gotoPage(url){
    this.router.navigateByUrl(url);
  }
  
  ionViewWillEnter(){
    this.menu.enable(true,'menu-content');
  }
  ngOnInit() {
    this.menu.enable(true,'menu-content');
  }

}
