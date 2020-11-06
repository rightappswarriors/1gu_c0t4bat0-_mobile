import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartmodalpagePage } from './cartmodalpage.page';

const routes: Routes = [
  {
    path: '',
    component: CartmodalpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartmodalpagePageRoutingModule {}
