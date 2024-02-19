import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { SocketService } from 'src/app/Services/socket.service';
import Peer from 'peerjs';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  peerId;
  peer;
  messages;
  chatwith = 'Admin';
  acceptCall = false;
  waiting = false;
  callerObj;
  params = {
    page: 1,
  };
  peerIdShare;
  room;
  loadOlderspinner: boolean;
  loadMoreStatus = true;
  accepted = true;
  messageSubscriptions;
  lazyStream;
  peerList = [];
  currentPeer;
  videoCall = false;
  constructor(
    // private peer: Peer,
    public app: AppComponent,
    private rest: RestService,
    private router: Router,
    private commonService: CommonService,
    private socketService: SocketService,
    private activatedRoute: ActivatedRoute
  ) {}

  sendMessage(chatMsgInput, chatMsgInputWrapper) {
    // console.log(chatMsgInput.value);
    if (chatMsgInput.value.trim() == '') {
      return;
    }
    if (!this.messages) {
      this.messages = [];
    }
    let data = {
      message: chatMsgInput.value,
    };
    if (this.chatwith === 'admin') {
      this.rest.sendSupportMessage(data).subscribe((res) => {
        if (res.status) {
          chatMsgInput.value = '';
          this.textAreaAdjust(chatMsgInput, chatMsgInputWrapper);
          this.messages.push(res.data.message);
          this.autoScroll();
        }
        this.commonService.showToast(res.message, res.status);
      });
    } else {
      let message_data = {
        id: '',
        receiver: this.chatwith,
        sender: this.app.userinfo.id,
        message: chatMsgInput.value,
        room: this.room,
        room_id: this.room,
        user: this.app.userinfo,
      };
      this.rest.sendUserMessage(message_data).subscribe((res) => {
        chatMsgInput.value = '';

        this.socketService.sendChatMessage(message_data);
        this.messages.push(message_data);
        this.autoScroll();
      });
    }
  }

  textAreaAdjust(chatMsgInput, chatMsgInputWrapper) {
    let height = chatMsgInput.scrollHeight;
    if (chatMsgInput.value.length == '0') {
      height = 40;
    }
    if (height > 100) {
      height = 100;
    }
    chatMsgInput.style.height = height + 'px';
    chatMsgInputWrapper.style.height = height + 'px';
  }

  autoScroll() {
    setTimeout(() => {
      let scrollable = document.querySelector('.messages-container');
      scrollable.scrollBy({
        top: scrollable.scrollHeight + 1000, // could be negative value
        left: 0,
        behavior: 'smooth',
      });
    }, 100);
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
  getUserConversations() {
    let obj = {
      friend_id: this.chatwith,
      user_id: this.app.userinfo.id,
    };
    this.rest.getUserConversations(this.params, obj).subscribe((res) => {
      this.messages = res.messages;
      if (this.messages.length) {
        console.log(res);
        this.room = res.messages[0].room_id;
      } else {
        this.room = obj.friend_id + obj.user_id;
      }
      this.socketService.joinEvent(
        {
          user_id: this.app.userinfo.id.toString(),
          room: this.room || obj.friend_id + obj.user_id,
          peerID: this.peerId,
        },
        (data, error) => {
          console.log(data);

          this.subscribeMessage();
        }
      );
    });
  }
  subscribeMessage() {
    this.messageSubscriptions = this.socketService
      .onNewMessage()
      .subscribe((message: any) => {
        // message.user = message.username;
        // delete message.username;
        console.log('onNewMessage', message);

        if (message.room != this.room) {
          return;
        }
        // return;
        this.messages.push(message);
        this.autoScroll();
      });
  }
  getFriendPeerId() {
    this.socketService.onFriendPeerId().subscribe((message: any) => {
      // message.user = message.username;
      // delete message.username;
      console.log('friendPeerId', message);

      if (message.room != this.room) {
        return;
      }
      // return;
      this.peerIdShare = message.peerID;
      this.videoCall = message.videoCall;
      this.callPeer(message.peerID, message.videoCall);
      this.autoScroll();
    });
  }
  getFriendPeerIdOnCall() {
    this.socketService.requestForPeerId().subscribe((message: any) => {
      if (message.room != this.room) {
        return;
      }
      this.videoCall = message.videoCall;

      // return;
      this.getRequestonCall(message);
    });
    this.socketService.requestForendCall().subscribe((message: any) => {
      if (message.room != this.room) {
        return;
      }
      // if(message.user_id !== this.app.userinfo.id.toString()){
      this.acceptCall = false;
      this.waiting = false;
      this.accepted = false;
      this?.callerObj?.close();
      this.lazyStream.getTracks().forEach(t => t.stop())
      // }
    });
  }
  loadMore(ele) {
    if (ele.scrollTop == 0 && this.loadMoreStatus) {
      this.params.page++;
      this.getConversations();
    }
  }

  ionViewWillEnter() {
    this.getFriendPeerId();
    this.app.setPageTitle('inbox_page.page_title');
    let user_id = this.activatedRoute.snapshot.paramMap.get('user_id');
    if (user_id === 'admin') {
      this.getConversations();
    } else {
      this.chatwith = user_id;
      this.getUserConversations();
      console.log('hellooo', user_id);
    }
  }
  ionViewWillLeave() {
    this.messageSubscriptions.unsubscribe();
    this.params.page = 1;
    this.loadMoreStatus = true;
  }
  acceptCallFn() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.lazyStream = stream;

        this.callerObj.answer(stream);
        this.callerObj.on('stream', (remoteStream) => {
          // if (!this.peerList.includes(this.callerObj.peer)) {
            this.acceptCall = true;
            this.waiting = false;
            this.accepted = true;

            if (this.videoCall) {
              this.streamRemoteVideo(remoteStream);
            }
            this.currentPeer = this.callerObj.peerConnection;
            // this.peerList.push(this.callerObj.peer);
          // }
        });
      })
      .catch((err) => {
        console.log(err + 'Unable to get media');
      });
  }
  DeclineCallFn() {
    console.log(this.callerObj);
    // this.callerObj.reject();

    this.acceptCall = false;
    this.waiting = false;
    this.accepted = false;
    this?.callerObj?.close();
    this.lazyStream.getTracks().forEach(t => t.stop())

    this.socketService.sendEndCallRequest(
      {
        user_id: this.app.userinfo.id.toString(),
        room: this.room,
        peerID: this.peerId,
        videoCall: this.videoCall,
      },
      (data, error) => {}
    );
    // document.getElementsByClassName('video')[0].remove()
  }
  getRequestonCall = (message) => {
    this.socketService.sendPeerId(
      {
        user_id: this.app.userinfo.id.toString(),
        room: this.room,
        peerID: this.peerId,
        videoCall: message.videoCall,
      },
      (data, error) => {}
    );
  };
  private getPeerId = () => {
    //Generate unique Peer Id for establishing connection
    this.peer = new Peer();
    const conn = this.peer;
    conn.on('open', (id) => {
      console.log({ id });
      this.peerId = id;
      // conn.send("hi!");
      // this.getRequestonCall()
    });
    // Peer event to accept incoming calls

    this.peer.on('call', (call) => {
      console.log('kdjsakjdklsajkld');
      this.acceptCall = true;
      this.waiting = true;
      this.accepted = false;

      this.callerObj = call;
      call.on('close', () => {
        console.log('conn close event');
        // this.handlePeerDisconnect();
      });
    });
    this.peer.on('connection', (connn) => {
      console.log({ connn });
    });
  };
  connectWithPeer(video) {
    this.acceptCall = true;
    this.waiting = true;
    this.accepted = true;
    this.videoCall = video;
    this.socketService.sendPeerIdOnCall(
      {
        user_id: this.app.userinfo.id.toString(),
        room: this.room,
        peerID: this.peerId,
        videoCall: video,
      },
      (data, error) => {}
    );
  }
  private callPeer(id: string, video: boolean): void {
    console.log({ id }, 'for calll');
    navigator.mediaDevices
      .getUserMedia({
        video: video,
        audio: true,
      })
      .then((stream) => {
        this.lazyStream = stream;

        const call = this.peer.call(id, stream);
        call.on('stream', (remoteStream) => {
          // if (!this.peerList.includes(call.peer)) {
            this.acceptCall = true;
            this.waiting = false;
            if (this.videoCall) {
              this.streamRemoteVideo(remoteStream);
            }
            this.currentPeer = call.peerConnection;
            // this.peerList.push(call.peer);
          // }
        });
        call.on('close', (ab) => {
          console.log('abbbc close', ab);
        });
      })
      .catch((err) => {
        console.log(err + 'Unable to connect');
      });
  }
  private streamRemoteVideo(stream) {
    const video = document.createElement('video');
    video.classList.add('video');

    video.srcObject = stream;
    video.play();

    document.getElementById('remote-video').append(video);
  }
  ngOnInit() {
    this.getPeerId();

    this.getFriendPeerIdOnCall();
  }
}
