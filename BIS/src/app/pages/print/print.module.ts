import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintPageRoutingModule } from './print-routing.module';

import { PrintPage } from './print.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [PrintPage]
})
export class PrintPageModule {}
