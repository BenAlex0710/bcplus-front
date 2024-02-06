import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, SwiperOptions } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
    selector: 'app-index',
    templateUrl: './index.page.html',
    styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

    upcoming_events;
    popular_channels;
    current_language;
    slides

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private translate: TranslateService
    ) {
    }

    config: SwiperOptions = {
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: true,
        pagination: { clickable: true },
        scrollbar: { draggable: true },
    };

    // onSwiper([swiper]) {
    //     console.log(swiper);
    // }
    // onSlideChange() {
    //     console.log('slide change');
    // }

    ionViewWillEnter() {
        this.app.setPageTitle('home_page.page_title');
        this.rest.homePage().subscribe((res) => {
            this.upcoming_events = res.data.upcoming_events
            this.popular_channels = res.data.popular_channels
            this.slides = res.data.slides
        });
        this.current_language = this.translate.getDefaultLang();
        this.translate.onDefaultLangChange.subscribe((res) => {
            this.current_language = res.lang;
        });
    }

    ngOnInit() {
    }

}
