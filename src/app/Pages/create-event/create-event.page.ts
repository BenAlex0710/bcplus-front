import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import flatpickr from 'flatpickr';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-create-event',
    templateUrl: './create-event.page.html',
    styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

    userinfo;
    form: FormGroup;
    tzOffset;
    performers;
    customAlertOptions;

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private commonService: CommonService,
        private router: Router,
    ) {
        this.form = this.formBuilder.group({
            title: [''],
            start_time: [''],
            end_time: [''],
            timezone: [''],
            event_type_id: [''],
            banner: [''],
            guests: [''],
            joining_fee: [''],
            description: [''],
            notification: [''],
        });

        this.translate.get('create_event.guests_alert.header').subscribe((res) => {
            this.customAlertOptions = {
                header: res,
            }
        });
    }

    get formControls() {
        return this.form.controls;
    }

    submitForm() {
        this.rest.createEvent(this.form.value).subscribe((res) => {
            if (!res.status) {
                if (!res.data.active_package) {
                    this.commonService.showToast(res.message, false);
                    this.form.reset();
                    this.router.navigate(['/package-orders']);
                } else {
                    this.commonService.setFormErrors(this.form, res);
                }
            } else {
                this.commonService.showToast(res.message, true);
                this.form.reset();
                this.router.navigate(['/events']);
            }
        });
    }

    setMinTime() {
        const timezone = this.form.get('timezone');

        let tzOffset = '0';
        for (const timezoneObj of this.app.settingsOptions.timezones) {
            if (timezoneObj.timezone === timezone) {
                tzOffset = timezoneObj.offset;
                break;
            }
        }
        this.tzOffset = tzOffset;
        // this.form.get('start_time').setValue('');
        // this.form.get('end_time').setValue('');
    }

    showBannerPreview(event, previewImg) {
        if (event.target.files.length) {
            let max_size = 2;
            let invalid_image_error, invalid_image_size_error = "";
            this.translate.get('invalid_image_error').subscribe((res) => {
                invalid_image_error = res;
            });
            this.translate.get('invalid_image_size_error', { max_size: max_size }).subscribe((res) => {
                invalid_image_size_error = res;
            });

            const file = event.target.files[0];
            const size = file.size / 1048576;
            if (size > max_size) {
                this.commonService.showToast(invalid_image_size_error, false);
                return false;
            }
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
                        this.form.get('banner').setValue(e.target.result);
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

    openDatePicker(element, input_name) {

        const timezone = this.form.get('timezone');

        let tzOffset = '0';
        for (const timezoneObj of this.app.settingsOptions.timezones) {
            // console.log(timezoneObj, timezone.value);

            if (timezoneObj.timezone === timezone.value) {
                tzOffset = timezoneObj.offset;
                break;
            }
        }
        this.tzOffset = tzOffset;

        // console.log('---', tzOffset);

        let currentDate = new Date();
        let minTimeUTC = (currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000));

        let minDate = new Date(minTimeUTC + (this.tzOffset * 1000));

        if (input_name == 'end_time') {
            let startDateTime = this.form.get('start_time').value;
            if (startDateTime != '') {
                minDate = new Date(startDateTime);
            }
        }

        // minDate.setDate(minDate.getDate() + 1);
        // console.log(minDate);

        flatpickr(element, {
            // defaultDate: new Date,
            minDate: minDate,
            minTime: minDate,
            enableTime: true,
            // dateFormat: 'd/m/Y',
            onChange: (selectedDates, dateStr, instance) => {
                if (input_name == 'start_time') {
                    this.form.get('end_time').setValue('');
                }
                instance.config.minTime = null;
            },
        });
    }


    ionViewWillEnter() {
        // console.log(this.app.settingsOptions);
        this.rest.getPerformersList().subscribe((res) => {
            this.performers = res.data.performers;
        });
        this.app.setPageTitle('create_event.page_title');
    }


    ngOnInit() {
    }

}
