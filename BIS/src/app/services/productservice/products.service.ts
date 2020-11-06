import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // products = [{id:'0',name:'Smartphones',url:'/item',price:'10990',img:'assets/banner1.jpg',sold:'1 sold',qty:'1'},
  //                     {id:'1',name:'Smartphone',url:'',price:'11990',img:'assets/banner2.jpg',sold:'1 sold',qty:'1'},
  //                     {id:'2',name:'Smartphone',url:'',price:'12990',img:'assets/banner3.jpg',sold:'1 sold',qty:'1'},
  //                     {id:'3',name:'Smartphone',url:'',price:'13990',img:'assets/banner1.jpg',sold:'1 sold',qty:'1'}
  //                   ];
  products = [];                  
  productitem = [];    
  option;              
  constructor(private http:HttpClient) 
  { 
    
  }

  getAllProducts(){
    let products = {"action":"getallproducts"}
    this.http.post(localStorage.getItem("url")+"/controller/productscontroller.php",JSON.stringify(products))
    .subscribe(data=>{
       let res:any = data;
       this.products = res.product;
    },
    (err)=>{
      console.log(JSON.stringify(err));
    }
    );
  }

  setproductoptions(option){
    console.log('execute product optins');
    this.option = option;
 }

 getProductOptions(){
   return this.option;    
 }

  getProducts() {
    this.getAllProducts();
    return this.products;
  }





}
