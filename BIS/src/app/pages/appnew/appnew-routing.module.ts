import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppnewPage } from './appnew.page';

const routes: Routes = [
  {
    path: '',
    component: AppnewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppnewPageRoutingModule {}
