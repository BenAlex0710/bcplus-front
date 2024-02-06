import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventInvitationsPageRoutingModule } from './event-invitations-routing.module';

import { EventInvitationsPage } from './event-invitations.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        EventInvitationsPageRoutingModule
    ],
    declarations: [EventInvitationsPage]
})
export class EventInvitationsPageModule { }
