import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

declare let gapi: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleService {

    clientId;
    initOptions;
    auth2: any;
    apikey;
    loader = true;

    constructor(
        private storage: Storage,
    ) {
        this.getSettings();
    }

    getSettings() {
        this.storage.get('BC_APP_SETTINGS').then((settings) => {
            // console.log('fb', settings);
            if (settings !== null && settings.social_login && settings.social_login.google_client_id && settings.social_login.google_api_key) {
                this.clientId = settings.social_login.google_client_id;
                this.apikey = settings.social_login.google_api_key;
                this.initialize();

                this.initOptions = {
                    // scope: 'profile email https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.birthday.read',
                    scope: 'profile email https://www.googleapis.com/auth/user.gender.read',
                    clientId: this.clientId
                }
            } else {
                setTimeout(() => {
                    this.getSettings();
                }, 1000);
            }

        })
    }

    initialize() {
        this.loadScript('GOOGLE', 'https://apis.google.com/js/api.js', () => {
            gapi.load('client:auth2', () => {
                gapi.auth2.init(
                    this.initOptions
                ).then((auth2) => {
                    this.auth2 = auth2;
                    // console.log('google init', auth2);
                    this.loader = false;
                });
                // console.log(this.auth2);
            });
        });
    }


    loadClient() {
        gapi.client.setApiKey(this.apikey);
        return gapi.client.load("https://people.googleapis.com/$discovery/rest?version=v1")
            .then(() => {
                console.log("GAPI client loaded for API");
            },
                function (err) { console.error("Error loading GAPI client for API", err); });
    }

    getUserInfo() {
        return gapi.client.people.people.get({
            "resourceName": "people/me",
            "requestMask.includeField": "person.genders"
            // "requestMask.includeField": "person.genders,person.birthdays"
        })
        // .then(function (response) {
        //     // Handle the results here (response.result has the parsed body).
        //     // console.log("Response", response);
        // },
        //     function (err) { console.error("Execute error", err); });
    }

    getLoginStatus(loginStatusOptions) {
        const options = Object.assign(Object.assign({}, this.initOptions), loginStatusOptions);
        return new Promise((resolve, reject) => {
            if (this.auth2.isSignedIn.get()) {
                let user: any;
                const profile = this.auth2.currentUser.get().getBasicProfile();
                const authResponse = this.auth2.currentUser.get().getAuthResponse(true); // get complete authResponse object
                user = {
                    id: profile.getId(),
                    name: profile.getName(),
                    email: profile.getEmail(),
                    photoUrl: profile.getImageUrl(),
                    firstName: profile.getGivenName(),
                    lastName: profile.getFamilyName(),
                    response: authResponse
                }
                const resolveUser = authResponse => {
                    user.authToken = authResponse.access_token;
                    user.idToken = authResponse.id_token;
                    resolve(user);
                };
                if (options.refreshToken) {
                    this.auth2.currentUser.get().reloadAuthResponse().then(resolveUser);
                } else {
                    const authResponse = this.auth2.currentUser.get().getAuthResponse(true);
                    resolveUser(authResponse);
                }
            } else {
                reject(`No user is currently logged in with google`);
            }
        });
    }

    signIn(signInOptions) {
        const options = Object.assign(Object.assign({}, this.initOptions), signInOptions);
        return new Promise((resolve, reject) => {
            const offlineAccess = options && options.offline_access;
            let promise = !offlineAccess ?
                this.auth2.signIn(signInOptions) :
                this.auth2.grantOfflineAccess(signInOptions);
            promise
                .then((response) => {
                    let user: any;
                    if (response && response.code) {
                        user.authorizationCode = response.code;
                    } else {
                        // let profile = this.auth2.currentUser.get().getBasicProfile();
                        let authResponse = this.auth2.currentUser.get().getAuthResponse(true);
                        // console.log(authResponse);
                        // let token = authResponse.access_token;
                        // let backendToken = authResponse.id_token;

                        resolve(authResponse.access_token);

                        /* this.getUserInfo().then((response) => {
                            console.log(JSON.parse(response.body));
                            let meta_data = JSON.parse(response.body);
                            // for (const key in meta_data) {
                            //     if (Object.prototype.hasOwnProperty.call(meta_data, key) && key != 'etag' && key != 'resourceName') {
                            //         user_data[key] = meta_data[key][0].value;
                            //     }
                            // }
                            user = {
                                id: profile.getId(),
                                // name: profile.getName(),
                                email: profile.getEmail(),
                                // photoUrl: profile.getImageUrl(),
                                firstName: profile.getGivenName(),
                                lastName: profile.getFamilyName(),
                                // authToken: token,
                                // idToken: backendToken,
                                // response: authResponse,
                                gender: meta_data['genders'][0].value
                            }
                            resolve(user);
                        }); */

                    }
                }, (closed) => {
                    reject(closed);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    signOut(revoke) {
        return new Promise<void>((resolve, reject) => {
            let signOutPromise;
            if (revoke) {
                signOutPromise = this.auth2.disconnect();
            } else {
                signOutPromise = this.auth2.signOut();
            }
            signOutPromise
                .then((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
                .catch((err) => {
                    reject(err);
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
