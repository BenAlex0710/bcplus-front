import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { CommonService } from '../../Services/common.service';
import { RestService } from '../../Services/rest.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    form: FormGroup;

    constructor(
        public app: AppComponent,
        private formBuilder: FormBuilder,
        private rest: RestService,
        private commonService: CommonService,
    ) {
        this.form = this.formBuilder.group({
            new_password: [''],
            confirm_password: [''],
            password: ['']
        });
    }

    submitForm() {
        this.rest.changePassword(this.form.value).subscribe((res) => {
            if (!res.status) {
                this.commonService.setFormErrors(this.form, res);
            } else {
                this.form.reset();
                this.commonService.showToast(res.message, true);
                this.app.logout();
            }
        });
    }

    get formControls() {
        return this.form.controls;
    }

    ionViewWillEnter() {
        this.app.setPageTitle("change_password_page.page_title");
    }

    ngOnInit() {
    }

}
