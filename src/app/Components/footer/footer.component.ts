import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    // pagesToShow;
    constructor(
        public app: AppComponent,
    ) { }

    ngOnInit() {
        // console.log(this.app.pagesToShow);
        // this.pagesToShow = this.app.pagesToShow;
    }

}
