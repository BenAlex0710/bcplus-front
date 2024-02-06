import { Injectable } from '@angular/core';
declare var AgoraRTC;

@Injectable({
    providedIn: 'root'
})

export class AgoraService {

    client;
    cameraAvailable;
    cameraPermission;
    microphoneAvailable;
    microphonePermission;


    localTracks = {
        videoTrack: null,
        audioTrack: null
    };
    options = {
        appid: null,
        channel: null,
        uid: null,
        token: null
    };

    constructor() { }

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

        this.client.on("user-unpublished", (user, mediaType) => {
            this.handleUserUnpublished(user, mediaType)
        });

        /* await Promise.all([
            this.checkForCamera(),
            this.checkForMicrohone()
        ]).then(() => {
            if (this.cameraAvailable && this.cameraPermission && this.microphoneAvailable && this.microphonePermission) {
                this.client.join(this.options.appid, channel, this.options.token || null).then(uid => {
                    this.options.uid = uid;
                    this.localTracks.videoTrack.play('performerPlayer');
                    this.localTracks.videoTrack.on('track-ended', () => {
                    });
                }).catch(error => {

                })
            }
        }); */

        //check camera
        await AgoraRTC.createCameraVideoTrack().then(vidTrack => {
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

                    this.playVideoTrack(uid, this.localTracks.videoTrack);
                    /*  let mainPlayer = document.getElementById('performerPlayer');
                     if (mainPlayer.hasChildNodes()) {
                         const guestPlayersRow = document.getElementById('guestVideosWrapper');
 
                         const playerWrapper = document.createElement('div');
                         playerWrapper.setAttribute("id", `player-wrapper-${uid}`);
                         playerWrapper.setAttribute("class", "col-md-4 col-6");
 
                         const player = document.createElement('div');
                         player.setAttribute("id", `player-${uid}`);
                         player.setAttribute("class", "guest-video-player");
 
                         playerWrapper.appendChild(player);
                         guestPlayersRow.appendChild(playerWrapper);
 
                         this.localTracks.videoTrack.play(`player-${uid}`);
 
                         let guestPlayers = document.getElementsByClassName('guest-video-player');
                         for (let index = 0; index < guestPlayers.length; index++) {
                             const element = <HTMLElement>guestPlayers[index];
                             element.style.height = (element.clientWidth / 1.33333).toFixed() + 'px';
                         }
                     } else {
                         this.localTracks.videoTrack.play('performerPlayer');
                     } */



                    this.localTracks.videoTrack.on('track-ended', () => {

                    });
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

    /*  async checkForCamera() {
         return await AgoraRTC.createCameraVideoTrack().then(vidTrack => {
             this.localTracks.videoTrack = vidTrack;
             this.cameraPermission = true;
             this.cameraAvailable = true;
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
 
     async checkForMicrohone() {
         return await AgoraRTC.createMicrophoneAudioTrack().then(audTrack => {
             this.localTracks.audioTrack = audTrack;
             this.microphoneAvailable = true;
             this.microphonePermission = true
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
     } */



    async publishStream() {
        return await this.client.publish(Object.values(this.localTracks));
    }

    publishOnSocial(url) {
        let liveTranscoding = {
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
        this.client.setLiveTranscoding(liveTranscoding).then(() => {
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

        this.client.on("user-published", (user, mediaType) => {
            this.handleUserPublished(user, mediaType)
        });
        this.client.on("user-unpublished", (user, mediaType) => {
            this.handleUserUnpublished(user, mediaType)
        });

        await this.client.join(this.options.appid, channel, this.options.token || null).then((uid) => {
            this.options.uid = uid
        });
    }

    /* cancelPreview() {
        for (const trackName in this.localTracks) {
            var track = this.localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                this.localTracks[trackName] = undefined;
            }
        }
    } */

    async leave() {
        for (const trackName in this.localTracks) {
            var track = this.localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                this.localTracks[trackName] = undefined;
            }
        }
        await this.client.leave();
    }

    async subscribe(user, mediaType) {
        const uid = user.uid;
        await this.client.subscribe(user, mediaType);
        // console.error('subscribe', mediaType, user);
        if (mediaType === 'video') {
            this.playVideoTrack(uid, user.videoTrack);
            /* let mainPlayer = document.getElementById('performerPlayer');
            if (mainPlayer.hasChildNodes()) {
                const guestPlayersRow = document.getElementById('guestVideosWrapper');

                const playerWrapper = document.createElement('div');
                playerWrapper.setAttribute("id", `player-wrapper-${uid}`);
                playerWrapper.setAttribute("class", "col-md-4 col-6");

                const player = document.createElement('div');
                player.setAttribute("id", `player-${uid}`);
                player.setAttribute("class", "guest-video-player");

                playerWrapper.appendChild(player);
                guestPlayersRow.appendChild(playerWrapper);

                user.videoTrack.play(`player-${uid}`);

                let guestPlayers = document.getElementsByClassName('guest-video-player');
                for (let index = 0; index < guestPlayers.length; index++) {
                    const element = <HTMLElement>guestPlayers[index];
                    element.style.height = (element.clientWidth / 1.33333).toFixed() + 'px';
                }
            } else {
                user.videoTrack.play('performerPlayer');
            } */
        }
        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    }


    playVideoTrack(uid, videoTrack) {
        let mainPlayer = document.getElementById('performerPlayer');
        if (mainPlayer.hasChildNodes()) {
            const guestPlayersRow = document.getElementById('guestVideosWrapper');

            const playerWrapperExists = document.getElementById(`player-wrapper-${uid}`);
            if (playerWrapperExists) {
                console.error(';sdfjsdhfkk');
                return;
            }
            const playerWrapper = document.createElement('div');
            playerWrapper.setAttribute("id", `player-wrapper-${uid}`);
            playerWrapper.setAttribute("class", "col-md-4 col-6");

            const player = document.createElement('div');
            player.setAttribute("id", `player-${uid}`);
            player.setAttribute("class", "guest-video-player");

            playerWrapper.appendChild(player);
            guestPlayersRow.appendChild(playerWrapper);

            videoTrack.play(`player-${uid}`);

            let guestPlayers = document.getElementsByClassName('guest-video-player');
            for (let index = 0; index < guestPlayers.length; index++) {
                const element = <HTMLElement>guestPlayers[index];
                element.style.height = (element.clientWidth / 1.33333).toFixed() + 'px';
            }
        } else {
            videoTrack.play('performerPlayer');
        }
    }

    handleUserPublished(user, mediaType) {
        console.warn('user-published', mediaType, user);
        this.subscribe(user, mediaType);
    }

    handleUserUnpublished(user, mediaType) {
        console.error('user-unpublished', user, mediaType);

        let playerWrapper = document.getElementById(`player-wrapper-${user.uid}`);
        if (playerWrapper) {
            playerWrapper.remove();
        }
    }
}
