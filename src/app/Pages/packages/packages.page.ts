import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { StripeModalPage } from '../stripe-modal/stripe-modal.page';

@Component({
    selector: 'app-packages',
    templateUrl: './packages.page.html',
    styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {

    packages;

    constructor(
        public app: AppComponent,
        private router: Router,
        private rest: RestService,
        private commonService: CommonService,
        private modalController: ModalController
    ) { }

    async openStripeCCModal(packageData) {
        // let stripedata = this.cartData.payment_gateways['stripe'];
        // let formData = this.checkoutForm.value;
        const myModal = await this.modalController.create({
            component: StripeModalPage,
            cssClass: 'stripe-cc-form',
            componentProps: {
                packageData: packageData
            }
        });
        return await myModal.present();
    }

    activateTrialPackage() {
        this.rest.activateTrialPackage().subscribe((res) => {
            if (res.status) {
                this.commonService.showToast(res.message, true);
                this.router.navigate(['/package-orders']);
            }
        });
    }

    payWithStripe() {
        let card = {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2022,
            cvc: '220'
        }
    }

    ionViewWillEnter() {
        this.app.setPageTitle('packages.page_title');
        this.rest.getPackages(this.app.userinfo.role_label).subscribe((res) => {
            if (res.status) {
                this.packages = res.data.packages;
            }
        })
    }

    ngOnInit() {
    }

}
