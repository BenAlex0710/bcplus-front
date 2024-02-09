import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

    imageChangedEvent: any = '';
    croppedImage: any = '';

    userinfo;
    form: FormGroup;
    @ViewChild('previewVideoBanner') previewVideoBanner: ElementRef;
    @ViewChild('previewImgBanner') previewImgBanner: ElementRef;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private commonService: CommonService,
        private renderer: Renderer2,
        private sanitizer: DomSanitizer
    ) {
        this.form = this.formBuilder.group({
            first_name: [''],
            last_name: [''],
            email: [''],
            username: [''],
            headline: [''],
            bio: [''],
            photo: [''],
            banner: [''],
            facebook_url: [''],
            google_url: [''],
            instagram_url: [''],
            linkedin_url: [''],
            tiktok_url: [''],
            snapchat_url: [''],
            whatsapp_url: [''],
            become_perfomer: [false],
            performer_type: [],
            organization_name: [''],
            organization_email: [''],
            city: [''],
            country: [''],
            address_line1: [''],
            address_line2: [''],
            state: [''],
            zip: [''],
        });
    }

    get formControls() {
        return this.form.controls;
    }

    submitForm() {
        this.rest.updateProfile(this.form.value).subscribe((res) => {
            if (!res.status) {
                this.commonService.setFormErrors(this.form, res);
            } else {
                this.app.setAuthUser(res.data.user);
                this.commonService.showToast(res.message, true);
            }
        });
    }


    // animate(elem, style, unit, from, to, time, prop) {
    //     if (!elem) {
    //         return;
    //     }
    //     var start = new Date().getTime(),
    //         timer = setInterval(function () {
    //             var step = Math.min(1, (new Date().getTime() - start) / time);
    //             if (prop) {
    //                 elem[style] = (from + step * (to - from)) + unit;
    //             } else {
    //                 elem.style[style] = (from + step * (to - from)) + unit;
    //             }
    //             if (step === 1) {
    //                 clearInterval(timer);
    //             }
    //         }, 25);
    //     if (prop) {
    //         elem[style] = from + unit;
    //     } else {
    //         elem.style[style] = from + unit;
    //     }
    // }



    showPhotoPreview(event, previewImg) {
        if (event.target.files.length) {
            let invalid_image_error = "";
            this.translate.get('invalid_image_error').subscribe((res) => {
                invalid_image_error = res;
            });

            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                var image = new Image();
                image.setAttribute('src', e.target.result.toString());
                // console.log(image.naturalHeight, image.naturalWidth);
                image.onload = (imgEvent) => {
                    // console.log(this)
                    // console.log(e);
                    let imgObj = <HTMLImageElement>imgEvent.target;
                    if (imgObj.naturalHeight > 0 && imgObj.naturalWidth > 0) {
                        previewImg.src = e.target.result;
                        this.form.get('photo').setValue(e.target.result);
                        // this.form.get('post_image_name').setValue(file.name);
                    }
                };
                image.onerror = (error) => {
                    this.commonService.showToast(invalid_image_error, false);
                    return false;
                }
            }
            reader.onerror = (error) => {
            }
        }
    }

    showBannerPreview(event) {
        if (event.target.files.length) {
            const file = event.target.files[0];

            if (this.isVideo(file.name)) {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = (e) => {
                    const videoUrl = e.target.result.toString();
                    this.renderer.setStyle(this.previewVideoBanner.nativeElement, 'display', 'initial');
                    this.renderer.setStyle(this.previewImgBanner.nativeElement, 'display', 'none');
                    this.previewVideoBanner.nativeElement.src = videoUrl;
                    this.form.get('banner').setValue(e.target.result);
                }
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = (e) => {
                    this.renderer.setStyle(this.previewVideoBanner.nativeElement, 'display', 'none');
                    this.renderer.setStyle(this.previewImgBanner.nativeElement, 'display', 'initial');
                    this.previewImgBanner.nativeElement.src = e.target.result.toString();
                    this.form.get('banner').setValue(e.target.result);
                };
            }
        }
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.form.get('banner').setValue(this.sanitizer.bypassSecurityTrustUrl(event.objectUrl))
      // event.blob can be used to upload the cropped image
    }
    imageLoaded(image: LoadedImage) {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    isVideo(file: string): boolean {
        if (!file) {
            return false;
        }
        return file.endsWith('.mp4') || file.endsWith('.webm');
    }

    ionViewWillEnter() {
        console.log(this.app.settingsOptions);
        this.app.setPageTitle('account_page.page_title');
        this.rest.getProfile().subscribe((res) => {
            if (res.status) {
                this.userinfo = res.data.user
                this.app.setAuthUser(res.data.user);
                this.form.patchValue(JSON.parse(this.userinfo.social_profiles));
                this.form.patchValue(this.userinfo);
                this.form.get('photo').setValue('');
                this.form.get('banner').setValue('');

                // var target = document.getElementById("social-profiles");
                // this.animate(document.scrollingElement || document.documentElement, "scrollTop", "", 0, target.offsetTop, 2000, true);
            }
        });
    }
    ngOnInit() {
    }

}
