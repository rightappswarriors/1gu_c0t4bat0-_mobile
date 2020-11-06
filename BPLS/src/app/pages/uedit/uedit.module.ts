import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UeditPageRoutingModule } from './uedit-routing.module';

import { UeditPage } from './uedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UeditPageRoutingModule
  ],
  declarations: [UeditPage]
})
export class UeditPageModule {}
