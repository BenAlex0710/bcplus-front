import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotpasswordPageRoutingModule } from './forgotpassword-routing.module';
import { ForgotpasswordPage } from './forgotpassword.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        CustomComponentsModule,
        ForgotpasswordPageRoutingModule
    ],
    declarations: [ForgotpasswordPage]
})
export class ForgotpasswordPageModule { }
