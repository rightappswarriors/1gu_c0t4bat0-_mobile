import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SellerService {


  constructor() { }
  removeSeller(){
    localStorage.removeItem("seller");
  }
  getSeller(){
    return JSON.parse(localStorage.getItem("seller"));
  }

  addSeller(seller){
    console.log("Execute Add Seller");
    localStorage.setItem("seller",JSON.stringify(seller));
  }
}
