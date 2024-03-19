import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RestService } from 'src/app/Services/rest.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.page.html',
  styleUrls: ['./all-post.page.scss'],
})
export class AllPostPage implements OnInit {
  postList = [];
  postuser;
  constructor(
    public app: AppComponent,
    private rest: RestService,
    private activatedRoute: ActivatedRoute
  ) {}
  like_post = (post_id) => {
    console.log(post_id);
    this.rest
      .likepost(post_id, { user_id: this.app.userinfo.id })
      .subscribe((res) => {
        console.log(res);
        // if (!this.Friendlist.length) {
        // console.log(res.)

        this.getposts();
        // }
      });
  };
  comment_post = (post_id, content) => {
    console.log(post_id,content);
    this.rest
      .commentpost(post_id, { user_id: this.app.userinfo.id, content:content.value })
      .subscribe((res) => {
        console.log(res);
        // if (!this.Friendlist.length) {
        // console.log(res.)

        this.getposts();
        // }
      });
  };
  getposts = () => {
    let user_id = this.activatedRoute.snapshot.paramMap.get('user_id');
    this.rest.getuserposts({ user_id: user_id }).subscribe((res) => {
      console.log(res);
      // if (!this.Friendlist.length) {
      // console.log(res.)

      this.postList = res.posts;
      this.postuser = res.user;
      // }
    });
  };

  ionViewWillEnter() {
    this.app.setPageTitle('friend_list_page.page_title');
    this.getposts();
  }

  ionViewWillLeave() {}

  ngOnInit() {}
}
