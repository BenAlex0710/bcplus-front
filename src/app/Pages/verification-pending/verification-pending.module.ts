import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerificationPendingPageRoutingModule } from './verification-pending-routing.module';
import { VerificationPendingPage } from './verification-pending.page';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CustomComponentsModule,
        TranslateModule,
        IonicModule,
        VerificationPendingPageRoutingModule
    ],
    declarations: [VerificationPendingPage]
})
export class VerificationPendingPageModule { }
