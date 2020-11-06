import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductsService } from 'src/app/services/productservice/products.service';
import { CartService } from 'src/app/services/cartservice/cart.service';

@Component({
  selector: 'app-cartmodalpage',
  templateUrl: './cartmodalpage.page.html',
  styleUrls: ['./cartmodalpage.page.scss'],
})
export class CartmodalpagePage implements OnInit {
  color="varitem";
  buttonColor: string = "";
  colorVar = "#498525";
  bpx = '5px';
  productitem;
  variation;
  productoptions = [];
  choose = {"option1":"","option2":""};
  varstockprice = [];
  pitem = {id:'',name:'',url:'/item',price:'0',img:'',sold:'1 sold',qty:'1',stock:'0',total:'0',option:'',varid:'',sellerid:''}
  price = 1000;
  stock = 10;
  constructor(private modal:ModalController,private product:ProductsService,
              private cartservice:CartService) { 
  }

  chooseoption(index1,index2,value){
    if(index1 == 0){
       for(let o of this.productoptions[index1].options){
           o.color = '';
       }
       this.choose.option1 = value.option;
    }else{
       for(let o of this.productoptions[index1].options){
        o.color = '';
       }
       this.choose.option2 = value.option;
    }
    this.productoptions[index1].options[index2].color = 'custom';
    this.setstockprice(this.choose.option1,this.choose.option2);
  }

  setstockprice(option1,option2){
    for(let sp of this.varstockprice){
      if(sp.option1 == option1 && sp.option2 == option2){
         console.log(sp);
         this.pitem.varid = sp.varid;
         this.pitem.price = sp.price;
         this.pitem.stock = sp.stock;
         if(this.pitem.total == '0'){
           this.pitem.total = sp.price;
         }
         break;
      }
    }
  }

  close(){
    this.modal.dismiss();
  }

  ngOnInit() {
    let option;
    let option1 = [];
    let option2 = [];
    this.productitem = this.product.getProductOptions();
    this.pitem.id = this.productitem.prodid;
    this.pitem.name = this.productitem.prodname;
    this.pitem.img = this.productitem.image;
    this.pitem.sellerid = this.productitem.sellerid;
    console.log(this.productitem);
    this.variation = this.productitem.variation;
    for(let v of this.productitem.variation)
    {
      let options = v.options.split(",");
      //insert first option
      if(option1.length != 0){
        let filter = option1.filter(item => {
          return item.option.toLowerCase().indexOf(options[0].toLowerCase()) > -1;
        });
        if(filter.length == 0){
          option1.push({"option":options[0],"color":""});
        }
      }else{
        option1.push({"option":options[0],"color":""});
      }
      //insert second option
      if(options.length == 2){
        if(option2.length != 0){
          let filter = option2.filter(item => {
            return item.option.toLowerCase().indexOf(options[1].toLowerCase()) > -1;
          });
          if(filter.length == 0){
            option2.push({"option":options[1],"color":""});
          }
        }else{
          option2.push({"option":options[1],"color":""});
        }
        this.varstockprice.push({"varid":v.variantid,"option1":options[0],"option2":options[1],"stock":v.stock,"price":v.price});
      }else{
        this.varstockprice.push({"varid":v.variantid,"option1":options[0],"option2":"","stock":v.stock,"price":v.price}); 
      } 
      
    }
    
    if(option1.length != 0){
      this.productoptions.push({"type":"Color","options":option1});
    }
    if(option2.length != 0){
      this.productoptions.push({"type":"Size","options":option2});
    }

    console.log(JSON.stringify(this.varstockprice));
    //console.log(JSON.stringify(option2));
    //this.option1 = 
  }

  add(){
    let qty = Number(this.pitem.qty) + 1;
    let price = Number(this.pitem.price);
    this.pitem.total = (price * qty).toString();
    if(this.pitem.stock != this.pitem.qty){
      this.pitem.qty = qty.toString();
    }
  }
  
  remove(){
    let qty = Number(this.pitem.qty) - 1;
    let price = Number(this.pitem.price);
    this.pitem.qty = qty.toString();
    this.pitem.total = (price * qty).toString();
    if(qty == 0){
      this.pitem.qty = '1';
      this.pitem.total = this.pitem.price;
    }
  }

  addtocart(){
    console.log(this.pitem);
    if(this.pitem.price != '0'){
       this.cartservice.addProduct(this.pitem);
       this.close();
    } 
  }

}
