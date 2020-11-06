import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppnewPageRoutingModule } from './appnew-routing.module';

import { AppnewPage } from './appnew.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AppnewPageRoutingModule
  ],
  declarations: [AppnewPage]
})
export class AppnewPageModule {}
