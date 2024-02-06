import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.page.html',
    styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

    form: FormGroup;

    activeScreen = 'login';
    redirect: string;

    constructor(
        public app: AppComponent,
        private formBuilder: FormBuilder,
        private rest: RestService,
        private commonService: CommonService,
        private storage: Storage,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.form = this.formBuilder.group({
            email: [''],
            password: ['']
        });
    }

    resetPassword(emailInput, messageElement) {
        // console.log(emailInput.value);
        messageElement.classList.remove('text-danger');
        messageElement.classList.remove('text-success');

        let data = {
            email: emailInput.value
        };

        this.rest.resetPassword(data).subscribe((res) => {
            if (!res.status) {
                messageElement.innerHTML = res.errors.email;
                messageElement.classList.add('text-danger');
                // messageElement.
                // console.log(messageElement, res.errors.email);
            } else {
                messageElement.innerHTML = res.message;
                messageElement.classList.add('text-success');
            }
        })
    }

    ionViewWillEnter() {
        this.redirect = this.activatedRoute.snapshot.queryParamMap.get('redirect');
        this.app.setPageTitle("login.page_title");
    }


    ngOnInit() {
    }

}
