import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestsListPage } from './guests-list.page';

const routes: Routes = [
  {
    path: '',
    component: GuestsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestsListPageRoutingModule {}
