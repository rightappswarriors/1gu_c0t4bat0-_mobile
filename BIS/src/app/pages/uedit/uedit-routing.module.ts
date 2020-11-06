import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UeditPage } from './uedit.page';

const routes: Routes = [
  {
    path: '',
    component: UeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UeditPageRoutingModule {}
