import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrendingEventsPage } from './trending-events.page';

const routes: Routes = [
  {
    path: '',
    component: TrendingEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrendingEventsPageRoutingModule {}
