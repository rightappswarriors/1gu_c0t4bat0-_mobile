import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'editprofile',
    loadChildren: () => import('./pages/editprofile/editprofile.module').then( m => m.EditprofilePageModule)
  },
  {
    path: 'shopedit',
    loadChildren: () => import('./pages/shopedit/shopedit.module').then( m => m.ShopeditPageModule)
  },
  {
    path: 'productsave',
    loadChildren: () => import('./pages/productsave/productsave.module').then( m => m.ProductsavePageModule)
  },
  {
    path: 'cartmodalpage',
    loadChildren: () => import('./pages/cartmodalpage/cartmodalpage.module').then( m => m.CartmodalpagePageModule)
  },
  {
    path: 'appnew',
    loadChildren: () => import('./pages/appnew/appnew.module').then( m => m.AppnewPageModule)
  },
  {
    path: 'print',
    loadChildren: () => import('./pages/print/print.module').then( m => m.PrintPageModule)
  },
  {
    path: 'cpass',
    loadChildren: () => import('./pages/cpass/cpass.module').then( m => m.CpassPageModule)
  },
  {
    path: 'uedit',
    loadChildren: () => import('./pages/uedit/uedit.module').then( m => m.UeditPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
