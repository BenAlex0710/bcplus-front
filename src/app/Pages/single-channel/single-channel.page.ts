import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-single-channel',
    templateUrl: './single-channel.page.html',
    styleUrls: ['./single-channel.page.scss'],
})
export class SingleChannelPage implements OnInit {

    performer;
    activeTab = 'about';

    stars = new Array(5);

    reviewLoadMoreBtn = false;
    reviewParams = {
        page: 1
    };

    eventsLoadMoreBtn = false;
    eventsParams = {
        page: 1
    }

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute,
    ) {

    }

    loadMoreReviews() {
        this.reviewParams.page++;
        this.rest.getPerformerReviewList(this.performer.username, this.reviewParams).subscribe((res) => {
            if (res.status) {
                if (res.data.reviews.length == 20) {
                    this.reviewLoadMoreBtn = true;
                } else {
                    this.reviewLoadMoreBtn = false;
                }
                for (const review of res.data.reviews) {
                    this.performer.reviews.push(review);
                }
            }
        });
    }

    loadMoreEvents() {
        this.eventsParams.page++;
        this.rest.getPerformerEventsList(this.performer.username, this.eventsParams).subscribe((res) => {
            if (res.status) {
                if (res.data.events.length == 12) {
                    this.eventsLoadMoreBtn = true;
                } else {
                    this.eventsLoadMoreBtn = false;
                }
                for (const event of res.data.events) {
                    this.performer.events.push(event);
                }
            }
        });
    }

    ionViewWillEnter() {
      let username = this.activatedRoute.snapshot.paramMap.get('username');
      this.rest.getPerformerProfile(username).subscribe((res) => {
        if (res.status) {
          this.performer = res.data.performer;
          this.performer.social_profiles = JSON.parse(this.performer.social_profiles);
          if (this.performer.reviews.length == 20) {
            this.reviewLoadMoreBtn = true;
          }

          if (this.performer.events.length == 12) {
            this.eventsLoadMoreBtn = true;
          }
        }
      })
    }


    isVideo(file: string): boolean {
      if (!file) {
        return false;
      }
      return file.endsWith('.mp4');
    }


    ngOnInit() {
    }

}
