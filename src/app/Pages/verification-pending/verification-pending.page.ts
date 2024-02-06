import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';


@Component({
    selector: 'app-verification-pending',
    templateUrl: './verification-pending.page.html',
    styleUrls: ['./verification-pending.page.scss'],
})
export class VerificationPendingPage implements OnInit {

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private storage: Storage,
        private router: Router,
        private commonService: CommonService,
    ) { }

    resendVerificationEmail() {
        this.rest.resendVerificationEmail().subscribe((res) => {
            // if (res.status) {
            // }
            this.commonService.showToast(res.message);
        });
    }

    ionViewWillEnter() {
        this.app.setPageTitle('verification_pending.page_title');
        this.storage.get('BC_PLUS_USER').then((user) => {
            if (user.status == '0') {
                this.rest.getProfile().subscribe((res) => {
                    if (res.status) {
                        this.app.setAuthUser(res.data.user);
                        if (res.data.user.status !== '0') {
                            this.router.navigate(['/index']);
                        }
                    }
                });
            } else {
                this.router.navigate(['/index']);
            }
        })
    }

    ngOnInit() {
    }

}
