import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopeditPage } from './shopedit.page';

const routes: Routes = [
  {
    path: '',
    component: ShopeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopeditPageRoutingModule {}
