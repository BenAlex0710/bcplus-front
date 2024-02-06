import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

declare let FB: any;

@Injectable({
    providedIn: 'root'
})

export class FacebookService {

    initOptions;
    appId;
    loader = true;

    constructor(
        private storage: Storage
    ) {
        this.initOptions = {
            scope: 'email, public_profile, user_gender',
            locale: 'en_US',
            fields: 'first_name, last_name, email, gender',
            version: 'v12.0',
        };
        this.getSettings();
    }

    getSettings() {
        this.storage.get('BC_APP_SETTINGS').then((settings) => {
            // console.log('fb', settings);
            if (settings !== null && settings.social_login && settings.social_login.facebook_client_id) {
                this.appId = settings.social_login.facebook_client_id;
                this.initialize();
            } else {
                setTimeout(() => {
                    this.getSettings();
                }, 1000);
            }
        })
    }

    initialize() {
        this.loadScript('FACEBOOK', `https://connect.facebook.net/${this.initOptions.locale}/sdk.js`, () => {
            this.loader = false;
            // console.log('FB', FB, FB.getAccessToken())
            FB.init({
                appId: this.appId,
                autoLogAppEvents: true,
                cookie: true,
                xfbml: true,
                version: this.initOptions.version,
            });
        });
    }

    getLoginStatus() {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${this.initOptions.fields}`, (fbUser) => {
                        let user: any;
                        user = {
                            id: fbUser.id,
                            // name: fbUser.name,
                            email: fbUser.email,
                            // photoUrl: 'https://graph.facebook.com/' + fbUser.id + '/picture?typenormal',
                            firstName: fbUser.first_name,
                            lastName: fbUser.last_name,
                            // authToken: authResponse.accessToken,
                            // response: fbUser,
                            gender: fbUser.gender,
                        }
                        resolve(user);
                    });
                } else {
                    reject(`No user is currently logged in with FACEBOOK`);
                }
            });
        });
    }

    signIn(signInOptions) {
        const options = Object.assign(Object.assign({}, this.initOptions), signInOptions);
        return new Promise((resolve, reject) => {
            FB.login((response) => {
                // console.log('FB.login', response)
                if (response.authResponse) {
                    let authResponse = response.authResponse;
                    resolve(authResponse.accessToken)
                    /* FB.api(`/me?fields=${options.fields}`, (fbUser) => {
                        let user: any;
                        user = {
                            id: fbUser.id,
                            // name: fbUser.name,
                            email: fbUser.email,
                            // photoUrl: 'https://graph.facebook.com/' + fbUser.id + '/picture?typenormal',
                            firstName: fbUser.first_name,
                            lastName: fbUser.last_name,
                            // authToken: authResponse.accessToken,
                            // response: fbUser,
                            gender: fbUser.gender,
                        }
                        resolve(user);
                    }); */
                } else {
                    reject('User cancelled login or did not fully authorize.');
                }
            }, options);
        });
    }

    signOut() {
        return new Promise<void>((resolve, reject) => {
            FB.logout((response) => {
                resolve();
            });
        });
    }

    loadScript(id, src, onload, parentElement = null) {
        if (typeof document !== 'undefined' && !document.getElementById(id)) {
            let signInJS = document.createElement('script');
            signInJS.async = true;
            signInJS.src = src;
            signInJS.onload = onload;
            if (!parentElement) {
                parentElement = document.head;
            }
            parentElement.appendChild(signInJS);
        }
    }
}
