import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

@Component({
    selector: 'app-stripe-modal',
    templateUrl: './stripe-modal.page.html',
    styleUrls: ['./stripe-modal.page.scss'],
})
export class StripeModalPage implements OnInit {

    @ViewChild(StripeCardComponent) card: StripeCardComponent;
    @Input() packageData;
    @Input() eventData;

    stripeData;
    expiry_full;
    addressIncomplete;

    cardErrors = {
        number: '',
        expiry: '',
        cvc: ''
    }

    stripeForm: FormGroup;

    cardOptions: StripeCardElementOptions = {
        classes: {
            base: 'form-control mb-3',
        },
        style: {
            base: {
                // textShadow: "0 0 0 0",
                // iconColor: '#666EE8',
                // color: '#31325F',
                fontWeight: '300',
                lineHeight: "38px",
                // fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                // fontSize: '18px',
                // '::placeholder': {
                //     color: '#f00'
                // }
            }
        },
        hidePostalCode: true
    };

    elementsOptions: StripeElementsOptions = {
        locale: 'en'
    };

    constructor(
        private fb: FormBuilder,
        private stripeService: StripeService,
        private rest: RestService,
        private storage: Storage,
        private commonService: CommonService,
        private modalController: ModalController,
        private router: Router,

        // private datePicker: DatePicker
    ) {
        this.stripeForm = this.fb.group({
            name: ['', [Validators.required]],
            address_city: ['', [Validators.required]],
            address_country: ['', [Validators.required]],
            address_line1: ['', [Validators.required]],
            address_line2: ['', [Validators.required]],
            address_state: ['', [Validators.required]],
            address_zip: ['', [Validators.required]],
        });
    }

    createToken(): void {
        this.commonService.showLoader();
        let data = this.stripeForm.value;
        this.stripeService
            .createToken(this.card.element, data)
            .subscribe((result) => {
                this.commonService.hideLoader();
                if (result.token) {
                    // Use the token
                    // console.log(result.token.id);
                    let formData = data
                    formData.stripe_source = result.token.id;
                    if (this.packageData) {
                        this.rest.packagePayment(this.packageData.id, formData).subscribe((response) => {
                            this.commonService.showToast(response.message, true);
                            this.router.navigate(['/package-orders']);
                            this.dismiss();
                        });
                    }
                    if (this.eventData) {
                        this.rest.addEventAttendee(this.eventData.id, formData).subscribe((response) => {
                            this.commonService.showToast(response.message, response.status);
                            this.dismiss();
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        });
                    }
                } else if (result.error) {
                    // Error creating the token
                    console.log(result.error.message);
                }
            });
    }

    /* createOrder() {
    
        if (!this.validateCard()) {
            return false;
        }
        return;
        this.stripe.setPublishableKey(this.stripeData.test_publishable_key);
        this.stripe.createCardToken(this.card)
            .then(token => {
                // console.log(token.id)
                let stripe_source = {
                    'stripe_card_token': token,
                    'stripe_source': token
                }
                this.rest.packagePayment(this.package_id, this.stripeData).subscribe((response) => {
                    // console.log(res);
                    this.router.navigateByUrl('order-details/' + response.data.order_id);
                    this.dismiss();
                });
            })
            .catch(error => console.error(error));
    } */

    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    ionViewWillEnter() {
        // console.log(this.packageData);
        if (this.eventData && this.eventData.joining_fee <= 0) {
            this.rest.addEventAttendee(this.eventData.id, this.stripeForm.value).subscribe((response) => {
                this.commonService.showToast(response.message, response.status);
                this.dismiss();
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            });
        } else if (this.packageData && this.packageData.price <= 0) {
            this.rest.packagePayment(this.packageData.id, this.stripeForm.value).subscribe((response) => {
                this.commonService.showToast(response.message, true);
                this.router.navigate(['/package-orders']);
                this.dismiss();
            });
        } else {
            this.storage.get('BC_PLUS_USER').then((user) => {
                if (user.city == null) {
                    this.addressIncomplete = true;
                    return;
                }
                this.stripeForm.get('address_line1').setValue(user.address_line1);
                this.stripeForm.get('address_line2').setValue(user.address_line2 ?? '');
                this.stripeForm.get('address_city').setValue(user.city);
                this.stripeForm.get('address_state').setValue(user.state ?? '');
                this.stripeForm.get('address_country').setValue(user.country);
                this.stripeForm.get('address_zip').setValue(user.zip ?? '');

            });
        }

    }

    ionViewDidLeave() {
        this.dismiss();
    }

    ngOnInit() {
    }

}
