import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
  selector: 'app-single-channel',
  imports: [CommonModule],
  templateUrl: './single-channel.page.html',
  styleUrls: ['./single-channel.page.scss'],
})
export class SingleChannelPage implements OnInit {
  performer;
  activeTab = 'about';

  stars = new Array(5);

  reviewLoadMoreBtn = false;
  reviewParams = {
    page: 1,
  };

  eventsLoadMoreBtn = false;
  friendRequestPending = false;
  friendRequestAccepted = false;
  eventsParams = {
    page: 1,
  };

  constructor(
    public app: AppComponent,
    private rest: RestService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {}

  loadMoreReviews() {
    this.reviewParams.page++;
    this.rest
      .getPerformerReviewList(this.performer.username, this.reviewParams)
      .subscribe((res) => {
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
  addFriend() {
    let obj = {
      user_id: this.app.userinfo.id,
      friend_id: this.performer.id,
      status: 'pending',
    };
    console.log(this.performer, this.app.userinfo, obj);

    this.rest.sendFriendRequest(obj).subscribe((res) => {
      if (res.friend_request) {
        this.checkFriendStatus()
      }
    });
  }
  checkFriendStatus() {
    let obj = {
      user_id: this.app.userinfo.id,
      friend_id: this.performer.id,
    };
    this.rest
      .checkFriendStatus(obj.user_id, obj.friend_id)
      .subscribe((data) => {
        if (data?.status === 'pending') {
          this.friendRequestPending = true;
          this.friendRequestAccepted = false;
        } else if (data?.status === 'accepted') {
          this.friendRequestPending = false;
          this.friendRequestAccepted = true;
        } else {
        console.log(data?.status,"dsakjdklsakd");
        this.friendRequestPending = false;
          this.friendRequestAccepted = false;
        }
      });
  }
  loadMoreEvents() {
    this.eventsParams.page++;
    this.rest
      .getPerformerEventsList(this.performer.username, this.eventsParams)
      .subscribe((res) => {
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
        this.performer.social_profiles = JSON.parse(
          this.performer.social_profiles
        );
        this.checkFriendStatus();
        if (this.performer.reviews.length == 20) {
          this.reviewLoadMoreBtn = true;
        }

        if (this.performer.events.length == 12) {
          this.eventsLoadMoreBtn = true;
        }
      }
    });
  }

  isVideo(file: string): boolean {
    if (!file) {
      return false;
    }
    return file.endsWith('.mp4');
  }

  ngOnInit() {}
}
