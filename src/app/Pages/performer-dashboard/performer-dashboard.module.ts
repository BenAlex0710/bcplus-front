import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerformerDashboardPageRoutingModule } from './performer-dashboard-routing.module';

import { PerformerDashboardPage } from './performer-dashboard.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        PerformerDashboardPageRoutingModule
    ],
    declarations: [PerformerDashboardPage]
})
export class PerformerDashboardPageModule { }
