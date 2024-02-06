import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageOrdersPageRoutingModule } from './package-orders-routing.module';

import { PackageOrdersPage } from './package-orders.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomComponentsModule } from 'src/app/Components/custom-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CustomComponentsModule,
        TranslateModule,
        PackageOrdersPageRoutingModule
    ],
    declarations: [PackageOrdersPage]
})
export class PackageOrdersPageModule { }
