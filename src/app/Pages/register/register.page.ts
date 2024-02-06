import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { FacebookService } from 'src/app/Services/facebook.service';
import { GoogleService } from 'src/app/Services/google.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    form: FormGroup;
    query_params;

    constructor(
        public app: AppComponent,
        private formBuilder: FormBuilder,
        private rest: RestService,
        public facebook: FacebookService,
        public google: GoogleService,
        private commonService: CommonService,
        private storage: Storage,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.form = this.formBuilder.group({
            email: [''],
            confirm_email: [''],
            first_name: [''],
            last_name: [''],
            password: ['']
        });
    }

    submitForm() {
        this.rest.register(this.form.value).subscribe((res) => {
            if (!res.status) {
                this.commonService.setFormErrors(this.form, res);
            } else {
                this.app.setAuthUser(res.data.user)
                this.storage.set("ACCESS_TOKEN", res.data.token);
                this.router.navigate(['/account']);
            }
        });
    }

    get formControls() {
        return this.form.controls;
    }


    signupWithFacebook(): void {
        // console.log('facebook');
        if (this.facebook.loader) {
            return;
        }
        this.facebook.signIn({}).then((token: string) => {
            // console.log('success', data);
            this.socialLogin('facebook', token);
        }).catch((err) => {
            console.log(err);
        });
    }

    signupWithGoogle(): void {
        if (this.google.loader) {
            return;
        }
        this.google.signIn({}).then((token: string) => {
            this.socialLogin('google', token);
        }).catch((errors) => {
            console.log('error', errors)
        });
    }

    socialLogin(provider, token) {
        let data = {
            provider: provider,
            provider_token: token
        }
        this.rest.socialLogin(data).subscribe((res) => {
            if (res.status) {
                if (res.data.not_registerd) {
                    this.router.navigateByUrl(this.commonService.setParams('/register', {
                        first_name: res.data.user_info.first_name,
                        last_name: res.data.user_info.last_name,
                        email: res.data.user_info.email,
                    }));
                } else {
                    this.app.setAuthUser(res.data.user);
                    this.storage.set("ACCESS_TOKEN", res.data.token);
                    this.router.navigate(['/account']);
                }
            } else {
                this.commonService.showToast(res.message, false);
            }
        });
    }

    ionViewWillEnter() {
        this.app.setPageTitle("register.page_title");
        this.query_params = this.activatedRoute.snapshot.queryParams;
        // console.log(this.query_params);
        this.form.patchValue(this.query_params);
    }

    ngOnInit() {
    }

}
