import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrendingEventsPageRoutingModule } from './trending-events-routing.module';

import { TrendingEventsPage } from './trending-events.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomComponentsModule,
        TranslateModule,
        TrendingEventsPageRoutingModule
    ],
    declarations: [TrendingEventsPage]
})
export class TrendingEventsPageModule { }
