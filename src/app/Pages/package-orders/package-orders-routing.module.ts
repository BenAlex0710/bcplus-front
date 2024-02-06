import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageOrdersPage } from './package-orders.page';

const routes: Routes = [
  {
    path: '',
    component: PackageOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageOrdersPageRoutingModule {}
