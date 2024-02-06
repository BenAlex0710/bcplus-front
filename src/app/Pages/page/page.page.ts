import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-page',
    templateUrl: './page.page.html',
    styleUrls: ['./page.page.scss'],
})
export class PagePage implements OnInit {

    pageData;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ionViewWillEnter() {
        let slug = this.activatedRoute.snapshot.paramMap.get('slug');
        // console.log(slug);
        this.rest.getPageData(slug).subscribe((res) => {
            if (res.status) {
                this.pageData = res.data;
                this.app.setPageTitle(this.pageData.title);
            }
        });
    }

    ngOnInit() {
    }

}
