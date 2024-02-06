import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-error',
    templateUrl: './error.page.html',
    styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {

    constructor(
        public app: AppComponent
    ) { }

    ionViewWillEnter() {
        this.app.setPageTitle('error_page.page_title');
    }

    ngOnInit() {
    }

}
