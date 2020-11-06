import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cartservice/cart.service';
import { BehaviorSubject } from 'rxjs';
import { ProductsService } from 'src/app/services/productservice/products.service';
import { Router,NavigationExtras } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as WC from 'woocommerce-api';
const httpHeader = {
  headers:new HttpHeaders({'Content-Type':'Application/json'})
};

const apiUrl = "http://localhost:8080/wordpress/wp-json/wp/v2/posts";
@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  WooCommerce:any;

  cart = [];
  products = [];
  cartItemCount: BehaviorSubject<number>;
  imageurl = localStorage.getItem("url")+"/files/products/";
  public banneritem = [{img:'assets/banner1.jpg'},{img:'assets/banner2.jpg'},{img:'assets/banner3.jpg'}];
  menuitems = [];
  sampleitem = [];
  users = {"opr_name":"register","email":"register","image":"register"};
  
  constructor(private cartservice:CartService,private productservice:ProductsService,
              private router:Router,private http:HttpClient) 
  { 
    // this.WooCommerce.getAsync("products").then((data)=>{
    //    console.log(data);
    // },(err)=>{

    // });
    //this.getProduct();
  }
  //for woocommerce setup
  /*
  url = 'http://localhost:8080/wordpress';
  consumerKey = 'ck_0c598dbbc1fd549ff63183b932a748e4c4d90318';
  consumerSecret = 'cs_e27303dfe8a1dae8c9a4059787b846fd2284ff08';
  getProduct() {
    return new Promise(resolve => {
      this.http
        .get(
          `${this.url}/wp-json/wc/v3/products/?consumer_key=${
            this.consumerKey
          }&consumer_secret=${this.consumerSecret}`,
          httpHeader
        )
        .subscribe(productData => {
          console.log(productData);
          resolve(productData);
        });
    });
  }

  */
  ionViewWillEnter(){
    let users = JSON.parse(localStorage.getItem("user"));
    this.users.opr_name = users.opr_name;
  }

  ngOnInit() {
    //this.cart = this.cartservice.getCart();
    this.menuitems = this.productservice.getProducts();
    this.cartItemCount = this.cartservice.getCartItemCount();
    //this.getAllProducts();
  }
    
  //go to item details page
  showitemdetails(productitem){
    let navigationExtras: NavigationExtras = {
      state: {
        product: productitem
      }
    };
    this.router.navigate(['item'], navigationExtras);
  }

  //go to cart
  cartpage(){
    this.router.navigateByUrl("/cart");
  }
   
  addToCart(product) {
     this.cartservice.addProduct(product);
  }

}
