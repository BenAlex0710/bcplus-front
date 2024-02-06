import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InviteGuestsModalPageRoutingModule } from './invite-guests-modal-routing.module';
import { InviteGuestsModalPage } from './invite-guests-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        IonicModule,
        ReactiveFormsModule,
        InviteGuestsModalPageRoutingModule
    ],
    declarations: [InviteGuestsModalPage]
})
export class InviteGuestsModalPageModule { }
