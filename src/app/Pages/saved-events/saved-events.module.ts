import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SavedEventsPageRoutingModule } from './saved-events-routing.module';
import { SavedEventsPage } from './saved-events.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        SavedEventsPageRoutingModule
    ],
    declarations: [SavedEventsPage]
})
export class SavedEventsPageModule { }
