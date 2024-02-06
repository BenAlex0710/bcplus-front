import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Storage } from '@ionic/storage';
import { filter, pairwise } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { CommonService } from './Services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from './Services/rest.service';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {

    appName;
    userinfo;
    sideMenu = false;
    accountMenu = false;
    settingsOptions;
    websiteSettings;
    pagesToShow;
    eventsTimeOptions;
    searchKeywords = "";
    language;
    languageList = {
        en: 'English',
        zh: 'Chainese'
    };
    languageAlertOptions;
    currentUrl: string;
    mobileSearch = false;

    private notify = new Subject<any>();
    notifyObservable = this.notify.asObservable();

    constructor(
        public translate: TranslateService,
        private storage: Storage,
        private router: Router,
        public location: Location,
        public rest: RestService,
        private titleService: Title,
        private commonService: CommonService,
    ) {
        this.initStorage();
        this.setLanguage();
        this.getLoggedInUser();
        this.getSettings();

        this.router.events
            .pipe(filter((event: any) => event instanceof RoutesRecognized), pairwise())
            .subscribe((events: RoutesRecognized[]) => {
                // console.log(events[1]);
                // this.previousUrl = events[0].urlAfterRedirects.split(';')[0];
                this.currentUrl = events[1].urlAfterRedirects.split(';')[0];
                // console.log('route_changed', this.currentUrl);
                this.sideMenu = false;
                this.accountMenu = false;
                this.commonService.closePopovers();
            });
        let searchKeywords = new URLSearchParams(window.location.search).get('keywords');
        if (searchKeywords) {
            this.searchKeywords = searchKeywords;
        }
        this.currentUrl = window.location.pathname;
    }

    notifySearchPage(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }

    setLanguage() {
        this.storage.get('BCPLUS_APP_LANG').then((lang) => {
            // console.log('lang', lang);
            if (lang == null) {
                lang = 'en';
            }
            this.language = lang;
            this.translate.setDefaultLang(lang);

            this.translate.get('languages').subscribe((res) => {
                this.languageAlertOptions = {
                    header: res,
                    // subHeader: 'Select your toppings',
                    // message: '$1.00 per topping',
                    // translucent: true
                }
            });

        })
    }

    switchLanguage(event) {
        let lang = event.detail.value;
        // console.log(event.detail, lang);
        this.storage.set('BCPLUS_APP_LANG', lang).then(() => {

            this.setLanguage();
        });
        // this.language = lang;
        // this.translate.setDefaultLang(lang);
    }

    getLoggedInUser() {
        this.storage.get('BC_PLUS_USER').then((user) => {
            // console.log('lang', lang);
            if (user == null) {
                // this.logout();
                return;
            }
            this.userinfo = user;
        })
    }

    setPageTitle(page_title) {
        this.translate.get('app_title').subscribe(app_title => {
            this.translate.get(page_title).subscribe(page_title => {
                this.titleService.setTitle(page_title + ' - ' + app_title);
            });
        });
    }

    toggleMobileSearchForm() {
        this.mobileSearch = !this.mobileSearch;
    }

    searchEvent(key, value, removeOtherParams = true) {
        let paramsObj = {};
        if (this.currentUrl != '/search') {
            paramsObj[key] = value;
            this.router.navigateByUrl(this.commonService.setParams('/search', paramsObj))
        } else {
            if (!removeOtherParams) {
                let params = new URLSearchParams(window.location.search);
                if (value.length == 0) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
                history.replaceState(null, null, '/search?' + params.toString());
                // console.log(params);
                params.toString().split('&').forEach((item) => {
                    paramsObj[item.split('=')[0]] = item.split('=').pop();
                });
            } else {
                history.replaceState(null, null, '/search?' + key + '=' + value);
                paramsObj[key] = value;
            }
            this.notifySearchPage(paramsObj);
        }
        this.sideMenu = false;
        this.mobileSearch = false;
        return false;
    }

    setAuthUser(user) {
        this.userinfo = user;
        this.storage.set('BC_PLUS_USER', user);
    }

    getSettings() {
        // this.storage.remove('BC_APP_SETTINGS');
        this.storage.get('BC_APP_SETTINGS').then((settings) => {
            // console.log(settings);
            if (settings !== null) {
                this.pagesToShow = settings.pages_to_show_on_website;
                this.settingsOptions = settings.options;
                this.websiteSettings = settings.website_settings;
                this.eventsTimeOptions = settings.events_time_options;
            } else {
                this.rest.getSettings().subscribe((res) => {
                    if (res.status) {
                        this.storage.set('BC_APP_SETTINGS', res.data);
                        this.pagesToShow = res.data.pages_to_show_on_website;
                        this.settingsOptions = res.data.options;
                        this.websiteSettings = res.data.website_settings;
                        this.eventsTimeOptions = res.data.events_time_options;
                    }
                });
            }
        });

    }

    showSideMenu() {
        this.sideMenu = true;
    }

    showAccountMenu() {
        this.accountMenu = true;
    }


    logout() {
        this.userinfo = false;
        this.storage.remove("ACCESS_TOKEN");
        this.storage.remove("BC_PLUS_USER");
        this.router.navigate(['/login']);
    }

    async initStorage() {
        // If using a custom driver:
        // await this.storage.defineDriver(MyCustomDriver)
        // await this.storage.defineDriver(localStorage);
        await this.storage.create();
    }

}
