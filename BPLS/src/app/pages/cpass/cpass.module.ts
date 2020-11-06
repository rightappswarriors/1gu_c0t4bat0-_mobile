import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CpassPageRoutingModule } from './cpass-routing.module';

import { CpassPage } from './cpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CpassPageRoutingModule
  ],
  declarations: [CpassPage]
})
export class CpassPageModule {}
