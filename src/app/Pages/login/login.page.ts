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
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    form: FormGroup;

    activeScreen = 'login';
    redirect: string;

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
            password: ['']
        });
    }

    submitForm() {
        this.rest.login(this.form.value).subscribe((res) => {
            if (!res.status) {
                this.commonService.setFormErrors(this.form, res);
            } else {
                this.app.setAuthUser(res.data.user)
                this.storage.set("ACCESS_TOKEN", res.data.token);
                this.form.reset();
                if (!this.redirect) {
                    this.router.navigate(['/index']);
                } else {
                    this.router.navigateByUrl(this.redirect)
                }
            }
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

    get formControls() {
        return this.form.controls;
    }

    signinWithFacebook() {
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

    signinWithGoogle() {
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
                        email: res.data.user_info.email
                    }));
                } else {
                    this.app.setAuthUser(res.data.user);
                    this.storage.set("ACCESS_TOKEN", res.data.token);
                    if (!this.redirect) {
                        this.router.navigate(['/index']);
                    } else {
                        this.router.navigateByUrl(this.redirect)
                    }
                }
            } else {
                this.commonService.showToast(res.message, false);
            }
        });
    }

    ionViewWillEnter() {
        this.redirect = this.activatedRoute.snapshot.queryParamMap.get('redirect');
        this.app.setPageTitle("login.page_title");
    }

    ngOnInit() {
    }

}
