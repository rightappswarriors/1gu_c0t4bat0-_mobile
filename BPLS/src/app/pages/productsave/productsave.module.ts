import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsavePageRoutingModule } from './productsave-routing.module';

import { ProductsavePage } from './productsave.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductsavePageRoutingModule
  ],
  declarations: [ProductsavePage]
})
export class ProductsavePageModule {}
