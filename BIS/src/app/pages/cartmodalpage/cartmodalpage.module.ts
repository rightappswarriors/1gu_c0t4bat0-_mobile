import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartmodalpagePageRoutingModule } from './cartmodalpage-routing.module';

import { CartmodalpagePage } from './cartmodalpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartmodalpagePageRoutingModule
  ],
  declarations: [CartmodalpagePage]
})
export class CartmodalpagePageModule {}
