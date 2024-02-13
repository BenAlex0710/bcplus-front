import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.page.html',
    styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

    messages;
    params = {
        page: 1
    }
    loadOlderspinner: boolean;
    loadMoreStatus = true;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private router: Router,
        private commonService: CommonService,
    ) { }


    sendMessage(chatMsgInput, chatMsgInputWrapper) {
        // console.log(chatMsgInput.value);
        if (chatMsgInput.value.trim() == '') {
            return;
        }
        if (!this.messages) {
            this.messages = [];
        }
        let data = {
            message: chatMsgInput.value
        }
        this.rest.sendSupportMessage(data).subscribe((res) => {
            if (res.status) {
                chatMsgInput.value = '';
                this.textAreaAdjust(chatMsgInput, chatMsgInputWrapper)
                this.messages.push(res.data.message);
                this.autoScroll();
            }
            this.commonService.showToast(res.message, res.status);
        })
    }

    textAreaAdjust(chatMsgInput, chatMsgInputWrapper) {
        let height = chatMsgInput.scrollHeight;
        if (chatMsgInput.value.length == "0") {
            height = 40;
        }
        if (height > 100) {
            height = 100;
        }
        chatMsgInput.style.height = height + "px";
        chatMsgInputWrapper.style.height = height + "px";
    }

    autoScroll() {
        setTimeout(() => {
            let scrollable = document.querySelector('.messages-container');
            scrollable.scrollBy({
                top: scrollable.scrollHeight + 1000, // could be negative value
                left: 0,
                behavior: 'smooth'
            });
        }, 100)
    }

    getConversations() {
        this.loadOlderspinner = true;
        this.rest.getConversations(this.params).subscribe((res) => {
            this.loadOlderspinner = false;
            if (res.status) {
                if (!this.messages) {
                    this.messages = [];
                }
                if (res.data.messages.length < 20) {
                    this.loadMoreStatus = false;
                }
                for (const msg of res.data.messages) {
                    this.messages.unshift(msg);
                }
            } else {
                this.commonService.showToast(res.message, false);
                // this.router.navigate(['/error']);
            }
        });
    }



    loadMore(ele) {
        if (ele.scrollTop == 0 && this.loadMoreStatus) {
            this.params.page++;
            this.getConversations();
        }
    }

    ionViewWillEnter() {
        this.app.setPageTitle('inbox_page.page_title');
        this.getConversations();
    }

    ionViewWillLeave() {
        this.params.page = 1;
        this.loadMoreStatus = true;
    }

    ngOnInit() {
    }

}
