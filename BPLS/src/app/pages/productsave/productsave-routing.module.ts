import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsavePage } from './productsave.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsavePageRoutingModule {}
