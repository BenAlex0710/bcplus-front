import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoLivePage } from './go-live.page';

const routes: Routes = [
  {
    path: '',
    component: GoLivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoLivePageRoutingModule {}
