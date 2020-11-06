import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //do not use samename of variables if you have services 
  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
  constructor() { }

  getCart() {
    return this.cart;
  }
  
  emptyCart(){
    this.cart = [];
    this.cartItemCount = new BehaviorSubject(0);
  }
  getCartItemCount() {
    console.log("Execute");
    return this.cartItemCount;
  }

  addProduct(product) {
      let countitem = 0;
      let added = false;
      for (let p of this.cart) {
        if (p.ids === product.id) {
          let qty:Number = Number(p.qtys) + 1;
          let total:Number = Number(p.prices) + ( Number(product.price) / Number((p.qtys)) );
          p.prices = total.toString();
          p.qtys = qty.toString();
          console.log("exist cart");
          added = true;
          break;
        }
      }

      if (!added) {
        console.log("new cart");
        this.cart.push(
          {
            ids:product.id,
            names:product.name,
            urls:product.url,
            prices:product.total,
            imgs:product.img,
            solds:product.sold,
            qtys:product.qty,
            varids:product.varid,
            sellerids:product.sellerid
          }
        );
      }

      for (let p of this.cart) {
        let qty:Number = Number(p.qtys);
        countitem = Number(countitem) + Number(qty);
      }
      console.log(countitem);
      this.cartItemCount.next(countitem);
    
  }

  decreaseProduct(product) {
    let countitem = 0;
    for (let [index, p] of this.cart.entries()) {
      if (p.ids === product.id) {
        let total:Number = Number(p.prices) - ( Number(product.price) / Number((p.qtys)) );
        p.qtys -= 1;
        p.prices = total.toString();
        if (p.qtys == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    for (let p of this.cart) {
      let qty:Number = Number(p.qtys);
      countitem = Number(countitem) + Number(qty);
    }

    this.cartItemCount.next(countitem);
  }
 
  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
  }

}
