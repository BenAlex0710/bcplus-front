import { Injectable } from '@angular/core';
import { publish } from 'rxjs/operators';
import { CommonService } from './common.service';
declare var AgoraRTC;
declare const AGORA_APP_ID;

@Injectable({
    providedIn: 'root'
})
export class AgoraService {

    client;

    localTracks = {
        videoTrack: null,
        audioTrack: null
    };

    cameraAvailable;
    cameraPermission;
    microphoneAvailable;
    microphonePermission;
    playerID;

    remoteUsers = {};

    options = {
        appid: null,
        channel: null,
        uid: null,
        token: null
    };

    constructor(
        private commonService: CommonService
    ) {

    }

    /* checkDevicePermissions() {
        AgoraRTC.getCameras().then(devices => {
            this.cameraAvailable = true;
        }).catch(e => {
            console.log("camera error!", e);
            if (e.code == 'PERMISSION_DENIED') {
                this.cameraAvailable = true;
                this.cameraPermission = false;
            } else {
                this.cameraAvailable = false;
                this.cameraPermission = false;
            }
        });

        AgoraRTC.getMicrophones().then(devices => {
            this.microphoneAvailable = true;
        }).catch(e => {
            console.log("microphone error!", e);
            if (e.code == 'PERMISSION_DENIED') {
                this.microphoneAvailable = true;
                this.microphonePermission = false;
            } else {
                this.microphoneAvailable = true;
                this.microphonePermission = false;
            }
        });
    } */

    setAppId(appid) {
        this.options.appid = appid;
    }

    async startVideoStream(token, channel) {
        this.options.token = token;
        this.client = AgoraRTC.createClient({ mode: "live", codec: "h264", role: "host" });

        // add event listener to play remote tracks when remote user publishs.
        this.client.on("user-published", (user, mediaType) => {
            this.handleUserPublished(user, mediaType)
        });
        this.client.on("user-unpublished", (user) => {
            this.handleUserUnpublished(user)
        });

        //check camera
        AgoraRTC.createCameraVideoTrack().then(vidTrack => {
            this.localTracks.videoTrack = vidTrack;
            this.cameraPermission = true;
            this.cameraAvailable = true;

            //check microphone 
            AgoraRTC.createMicrophoneAudioTrack().then(audTrack => {
                this.localTracks.audioTrack = audTrack;
                this.microphoneAvailable = true;
                this.microphonePermission = true;
                //join
                this.client.join(this.options.appid, channel, this.options.token || null).then(uid => {
                    this.options.uid = uid;

                    this.localTracks.videoTrack.play(this.playerID);
                    // console.log(this.localTracks.videoTrack);
                    this.adjustVideoPlayer();

                    this.localTracks.videoTrack.on('track-ended', () => {
                        // console.log('jhj');
                    });
                    // console.log("publish success");
                }).catch(error => {

                })
            }).catch(error => {
                console.log(error);
                if (error.code == 'PERMISSION_DENIED') {
                    this.microphoneAvailable = true;
                    this.microphonePermission = false;
                } else {
                    this.microphoneAvailable = false;
                    this.microphonePermission = false;
                }
            });
        }).catch(error => {
            console.log(error);
            if (error.code == 'PERMISSION_DENIED') {
                this.cameraAvailable = true;
                this.cameraPermission = false;
            } else {
                this.cameraAvailable = false;
                this.cameraPermission = false;
            }
        });
    }

    adjustVideoPlayer() {
        let newHeight, newWidth, videoHCf, videoHeight, videoWidth;
        let videoEle = document.getElementById(this.playerID);
        let parentEle = document.getElementById('stream-player-wrapper');
        let bodyEle = document.querySelector('body');

        parentEle.style.height = (bodyEle.clientHeight / 2).toFixed() + 'px';

        if (this.localTracks.videoTrack) {
            videoHeight = this.localTracks.videoTrack._videoHeight;
            videoWidth = this.localTracks.videoTrack._videoWidth;
            // console.log(videoHeight, videoWidth);
        } else {
            //portrait mode
            if (window.innerWidth <= window.innerHeight) {
                videoHeight = '640';
                videoWidth = '480';
            } else {
                videoHeight = '480';
                videoWidth = '640';
            }
        }

        videoHCf = this.commonService.findHCF(videoWidth, videoHeight);
        // console.log(videoHCf);
        if (parentEle.clientWidth < parentEle.clientHeight) {
            newWidth = parentEle.clientWidth;
            newHeight = ((newWidth / (videoWidth / videoHCf)) * (videoHeight / videoHCf)).toFixed();
            parentEle.style.height = newHeight + 'px';
        } else {
            newHeight = parentEle.clientHeight;
            newWidth = ((newHeight / (videoHeight / videoHCf)) * (videoWidth / videoHCf)).toFixed();
        }
        console.log(newWidth, newHeight);
        videoEle.style.width = newWidth + 'px';
        videoEle.style.height = newHeight + 'px';
    }

    async publishStream() {
        return await this.client.publish(Object.values(this.localTracks));
    }

    publishOnSocial(uid, url) {

        let LiveTranscoding = {
            // Width of the video (px). The default value is 640.
            width: 640,
            // Height of the video (px). The default value is 360.
            height: 360,
            // Bitrate of the video (Kbps). The default value is 400.
            videoBitrate: 400,
            // Frame rate of the video (fps). The default value is 15. Agora adjusts all values over 30 to 30.
            videoFramerate: 15,
            audioSampleRate: AgoraRTC.AUDIO_SAMPLE_RATE_48000,
            audioBitrate: 48,
            audioChannels: 1,
            videoGop: 30,
            // Video codec profile. Choose to set as Baseline (66), Main (77), or High (100). If you set this parameter to other values, Agora adjusts it to the default value of 100.
            videoCodecProfile: AgoraRTC.VIDEO_CODEC_PROFILE_HIGH,
            userCount: 1,
            userConfigExtraInfo: 'this is test',
            backgroundColor: 0x000000,
            // Sets the output layout for each user.
            transcodingUsers: [{
                x: 0,
                y: 0,
                width: 640,
                height: 360,
                zOrder: 0,
                alpha: 1.0,
                // The uid must be identical to the uid used in Client.join.
                // uid: uid,
                uid: this.options.uid,
            }],
        };

        this.client.setLiveTranscoding(LiveTranscoding).then(() => {
            console.log("set live transcoding success");
            // this.client.startLiveStreaming(rtmp_url_youtube, false).then(() => {
            //     console.log("start live streaming success");
            // })
            this.client.startLiveStreaming(url, false).then(() => {
                console.log("start live streaming success");
            })
        });
    }

    stopPublishOnSocial(url) {
        this.client.stopLiveStreaming(url)
    };


    async join(token, channel) {
        this.options.token = token;
        this.client = AgoraRTC.createClient({ mode: "live", codec: "h264", role: 'audience' });


        // add event listener to play remote tracks when remote user publishs.
        this.client.on("user-published", (user, mediaType) => {
            this.handleUserPublished(user, mediaType)
        });
        this.client.on("user-unpublished", (user) => {
            this.handleUserUnpublished(user)
        });

        // join a channel and create local tracks, we can use Promise.all to run them concurrently
        [this.options.uid] = await Promise.all([
            // join the channel
            this.client.join(this.options.appid, channel, this.options.token || null),
            // create local tracks, using microphone and camera
            /* AgoraRTC.createMicrophoneAudioTrack(),
            AgoraRTC.createCameraVideoTrack() */
        ]);

        // play local video track
        /*  this.localTracks.videoTrack.play(this.playerID);
         document.getElementById("local-player-name").innerHTML = `localVideo(${this.options.uid})`; */

        // publish local tracks to channel
        /* await this.client.publish(Object.values(this.localTracks)); */
        console.error("join success");
    }

    cancelPreview() {
        for (const trackName in this.localTracks) {
            var track = this.localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                this.localTracks[trackName] = undefined;
            }
        }
        let parentEle = document.getElementById('stream-player-wrapper');
        parentEle.style.height = 'unset';
    }

    async leave() {
        for (const trackName in this.localTracks) {
            var track = this.localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                this.localTracks[trackName] = undefined;
            }
        }

        // remove remote users and player views
        this.remoteUsers = {};
        // $("#remote-playerlist").html("");

        // leave the channel
        await this.client.leave();

        // $("#local-player-name").text("");
        // $("#join").attr("disabled", false);
        // $("#leave").attr("disabled", true);
        console.error("client leaves channel success");
    }

    async subscribe(user, mediaType) {
        const uid = user.uid;
        // subscribe to a remote user
        await this.client.subscribe(user, mediaType);
        console.error("subscribe success");
        if (mediaType === 'video') {
            const playerWrapper = document.getElementById('stream-player-wrapper');
            const player = document.createElement('div');
            player.setAttribute("id", `player-${uid}`);
            player.setAttribute("class", "player");
            playerWrapper.appendChild(player);


            user.videoTrack.play(`player-${uid}`);
            // console.log('this.playerID', this.playerID);
            // user.videoTrack.play(this.playerID);
            // console.log(user.videoTrack);

            this.adjustVideoPlayer();
        }
        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    }

    handleUserPublished(user, mediaType) {
        console.error('user-published', this.remoteUsers, mediaType, user);
        const id = user.uid;
        this.remoteUsers[id] = user;
        this.subscribe(user, mediaType);
    }

    handleUserUnpublished(user) {
        const id = user.uid;
        delete this.remoteUsers[id];
        console.error('user-published', this.remoteUsers, user);
        // $(`#player-wrapper-${id}`).remove();
    }
}
