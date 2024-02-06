import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AttendeesListPageRoutingModule } from './attendees-list-routing.module';
import { AttendeesListPage } from './attendees-list.page';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CustomComponentsModule,
        TranslateModule,
        IonicModule,
        AttendeesListPageRoutingModule
    ],
    declarations: [AttendeesListPage]
})
export class AttendeesListPageModule { }
