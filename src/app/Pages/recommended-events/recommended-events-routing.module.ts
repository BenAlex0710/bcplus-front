import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecommendedEventsPage } from './recommended-events.page';

const routes: Routes = [
  {
    path: '',
    component: RecommendedEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecommendedEventsPageRoutingModule {}
