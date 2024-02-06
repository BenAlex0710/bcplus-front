import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackagesPageRoutingModule } from './packages-routing.module';

import { PackagesPage } from './packages.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CustomComponentsModule,
        ReactiveFormsModule,
        PackagesPageRoutingModule
    ],
    declarations: [PackagesPage]
})
export class PackagesPageModule { }
