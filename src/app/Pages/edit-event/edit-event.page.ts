import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import flatpickr from 'flatpickr';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/Services/common.service';
import { RestService } from 'src/app/Services/rest.service';

@Component({
    selector: 'app-edit-event',
    templateUrl: './edit-event.page.html',
    styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

    event_info;
    form: FormGroup;
    tzOffset;
    maxDuration = 480;
    performers;
    customAlertOptions;
    guests = {};

    constructor(
        public app: AppComponent,
        private rest: RestService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
    ) {
        this.form = this.formBuilder.group({
            title: [''],
            start_time: [''],
            end_time: [''],
            timezone: [''],
            event_type_id: [''],
            banner: [''],
            joining_fee: [''],
            guests: [''],
            description: [''],
            notification: [''],
        });

        this.translate.get('edit_event.guests_alert.header').subscribe((res) => {
            this.customAlertOptions = {
                header: res,
            }
        });
    }

    get formControls() {
        return this.form.controls;
    }

    submitForm() {
        this.rest.updateEvent(this.event_info.id, this.form.value).subscribe((res) => {
            if (!res.status) {
                this.commonService.setFormErrors(this.form, res);
            } else {
                this.commonService.showToast(res.message, true);
            }
        });
    }

    // setMinTime(event) {
    //     let selectEle = <HTMLSelectElement>event.target;
    //     let tzOffset = selectEle.selectedOptions.item(0).getAttribute('data-tzOffset');
    //     this.tzOffset = tzOffset;
    // }

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

    /* formatDate(value: string) {
        let formatedValue = format(parseISO(value), 'dd/M/yyyy HH:mm');
        this.form.get('start_time').setValue(formatedValue);
    } */

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

        let currentDate = new Date();
        let minTimeUTC = (currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000));

        // console.log(currentDate.getTime(), currentDate.getTimezoneOffset(), minTimeUTC, this.tzOffset);

        let minDate = new Date(minTimeUTC + (this.tzOffset * 1000));

        if (input_name == 'end_time') {
            let startDateTime = this.form.get('start_time').value;
            // console.log(startDateTime);
            if (startDateTime != '') {
                minDate = new Date(startDateTime);
            }
        }

        flatpickr(element, {
            // defaultDate: new Date,
            minDate: minDate,
            minTime: minDate,
            // dateFormat: 'd/m/Y H:i',
            enableTime: true,
            onChange: (selectedDates, dateStr, instance) => {
                if (input_name == 'start_time') {
                    this.form.get('end_time').setValue('');
                }
                instance.config.minTime = null;
            },
        });
    }

    ionViewWillEnter() {
        this.app.setPageTitle('edit_event.page_title');
        let event_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.rest.getPerformersList().subscribe((res) => {
            this.performers = res.data.performers;
            this.rest.getEventInfo(event_id).subscribe((res) => {
                if (!res.status) {
                    this.location.back();
                } else {
                    this.event_info = res.data.event_info;
                    this.tzOffset = res.data.tz_offset;
                    this.form.patchValue(this.event_info);
                    this.form.get('start_time').setValue(this.event_info.start_time.slice(0, -3));
                    this.form.get('end_time').setValue(this.event_info.end_time.slice(0, -3));
                    this.form.get('banner').setValue('');

                    let guests = []
                    this.event_info.guests.forEach(guest => {
                        this.guests[guest.user_id] = guest.status;
                        guests.push((guest.user_id).toString())
                    });
                    // console.log(guests);
                    this.form.get('guests').setValue(guests);
                }
            })
        });

    }


    ngOnInit() {
    }

}
