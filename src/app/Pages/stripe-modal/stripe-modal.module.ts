import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripeModalPageRoutingModule } from './stripe-modal-routing.module';

import { StripeModalPage } from './stripe-modal.page';
import { NgxStripeModule } from 'ngx-stripe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        ReactiveFormsModule,
        StripeModalPageRoutingModule,
        NgxStripeModule
    ],
    declarations: [StripeModalPage]
})
export class StripeModalPageModule { }
