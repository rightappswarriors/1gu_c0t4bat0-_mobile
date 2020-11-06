import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
  import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cartservice/cart.service';
import { AuthserviceService } from 'src/app/services/authservice/authservice.service';
@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  cartItemCount: BehaviorSubject<number>;
  public notifyitem=[{title:'Header Title',message:'Message Details'},
  {title:'Header Title',message:'Message Details'},
  {title:'Header Title',message:'Message Details'},
  {title:'Header Title',message:'Message Details'}];
  constructor(private router:Router,private cartservice:CartService,private as:AuthserviceService) { }

  //go to cart
  cartpage(){
    this.router.navigateByUrl("/cart");
  }
  
  ionViewWillEnter(){
    this.cartItemCount = this.cartservice.getCartItemCount();
  }

  ngOnInit() {
    this.cartItemCount = this.cartservice.getCartItemCount();
  }

}
