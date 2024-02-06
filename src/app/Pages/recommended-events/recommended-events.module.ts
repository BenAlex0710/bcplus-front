import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecommendedEventsPageRoutingModule } from './recommended-events-routing.module';

import { RecommendedEventsPage } from './recommended-events.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomComponentsModule,
        TranslateModule,
        RecommendedEventsPageRoutingModule
    ],
    declarations: [RecommendedEventsPage]
})
export class RecommendedEventsPageModule { }
