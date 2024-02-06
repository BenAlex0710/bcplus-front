import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-package-orders',
    templateUrl: './package-orders.page.html',
    styleUrls: ['./package-orders.page.scss'],
})
export class PackageOrdersPage implements OnInit {

    orders;
    language: any;

    loadMoreBtn = false;
    params = {
        page: 1
    }
    constructor(
        public app: AppComponent,
        private rest: RestService,
        private storage: Storage,
        private commonService: CommonService,
    ) { }

    loadMore() {
        this.params.page++;
        this.getPackageOrders();
    }

    activatePackage(order_id) {
        this.rest.activatePackage(order_id).subscribe((res) => {
            if (res.status) {
                this.commonService.showToast(res.message, true);
                this.orders = undefined;
                this.params.page = 1;
                this.getPackageOrders();
            }
        });
    }

    getPackageOrders() {
        this.rest.getPackageOrders(this.params).subscribe((res) => {
            if (!this.orders) {
                this.orders = res.data.package_orders;
            } else {
                for (const event of res.data.package_orders) {
                    this.orders.push(event);
                }
            }
            if (res.data.package_orders.length == 20) {
                this.loadMoreBtn = true
            } else {
                this.loadMoreBtn = false
            }
        });
    }

    ionViewWillEnter() {
        this.app.setPageTitle('package_orders.page_title');
        this.storage.get('BCPLUS_APP_LANG').then((lang) => {
            if (lang == null) {
                lang = 'en';
            }
            this.language = lang;
        })
        this.getPackageOrders();
    }

    ionViewWillLeave() {
        this.orders = undefined;
        this.params.page = 1;
    }


    ngOnInit() {
    }

}
