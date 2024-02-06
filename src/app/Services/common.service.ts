import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, MenuController, ModalController, PopoverController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    isLoading: boolean;
    loader;
    tooltip;

    constructor(
        public loadingController: LoadingController,
        public router: Router,
        public toastController: ToastController,
        public alertController: AlertController,
        public actionSheetController: ActionSheetController,
        public popoverController: PopoverController,
        public modalController: ModalController,
        public menuController: MenuController,
        public activatedRoute: ActivatedRoute
    ) { }

    setParams(endpoint, parms) {
        var str = [];
        for (var p in parms)
            if (parms.hasOwnProperty(p) && parms[p] != '') {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(parms[p]));
            }
        return endpoint + '?' + str.join("&");
    }

    findHCF(x, y) {
        x = Math.round(x);
        y = Math.round(y);

        // If the input numbers are less than 1 return 0.
        if (x < 1 || y < 1) {
            return 0;
        }

        // Now apply Euclid's algorithm to the two numbers.
        while (Math.max(x, y) % Math.min(x, y) != 0) {
            if (x > y) {
                x %= y;
            }
            else {
                y %= x;
            }
        }

        // When the while loop finishes the minimum of x and y is the HCF.
        return Math.min(x, y);

    }
    async showLoader() {
        this.isLoading = true;
        return await this.loadingController.create({
            spinner: null,
            // duration: 100000,
            message: '<div class="preloader" id="preloader" *ngIf="preloader"><div class="spinner-grow text-white" role="status"><div class="sr-only"></div></div></div>',
            // translucent: true,
            cssClass: 'lets-loader',
            // backdropDismiss: true
            // duration: 5000,
        }).then(a => {
            a.present().then(() => {
                // console.log('presented');
                if (!this.isLoading) {
                    a.dismiss().then(() => {
                        // console.log('abort presenting')
                    });
                }
            });
        });
        // this.loader = await this.loadingController.create({
        // 	spinner: null,
        // 	// duration: 100000,
        // 	message: '<div class="preloader" id="preloader" *ngIf="preloader"><div class="spinner-grow text-secondary" role="status"><div class="sr-only"> Loading...</div></div></div>',
        // 	// translucent: true,
        // 	cssClass: 'lets-loader',
        // 	backdropDismiss: true
        // 	// duration: 5000,
        // });
        // this.loader.present();
    }

    async hideLoader() {
        this.isLoading = false;
        return await this.loadingController.dismiss().then(() => {
            // console.log('dismissed');
        });
    }

    async showToast(message, status: any = null, mode = "web") {
        let icon, type;

        if (status == null) {
            icon = "information-circle-outline";
            type = "info";
        } else if (status == false) {
            icon = "alert-circle-outline";
            type = "error";
        } else if (status == true) {
            icon = "checkmark-circle-outline";
            type = "success";
        }

        const toast = await this.toastController.create({
            header: type,
            message: message,
            position: 'top',
            cssClass: 'letsToast-' + mode + ' ' + type,
            duration: 3000,
            // duration: 300000,
            buttons: [
                // {
                //     side: 'start',
                //     icon: icon,
                //     text: '',
                //     handler: () => {
                //         return false;
                //         // console.log('Toast clicked');
                //     }
                // },
                {
                    text: '',
                    icon: 'close-circle-outline',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        toast.present();
    }

    async showNewMessageToast(title, message_type = 0, url = "", mode = "web") {
        // console.log(this.router.url);
        // console.log(url);
        if (this.router.url == url) {
            return false;
        }
        let icon, type;

        if (message_type == 0) {
            icon = "chatbox-ellipses-outline";
            type = "text";
        } else if (message_type == 1) {
            icon = "image-outline";
            type = "image";
        } else if (message_type == 2) {
            icon = "calendar-outline";
            type = "date";
        }

        const toast = await this.toastController.create({
            header: title,
            // message: message,
            position: 'top',
            cssClass: 'letsMessageToast-' + mode + ' ' + type,
            duration: 2000,
            buttons: [
                {
                    side: 'end',
                    icon: "eye-outline",
                    cssClass: 'view_btn',
                    text: '',
                    handler: () => {
                        if (url.length > 0) {
                            this.router.navigateByUrl(url)
                        }
                    }
                },
                {
                    text: '',
                    cssClass: 'close_btn',
                    icon: 'close-circle-outline',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await toast.present().then(() => {
            const toasts = document.getElementsByClassName('letsMessageToast-' + mode);
            const shadow = toasts[0].shadowRoot;
            const childNodes = Array.from(shadow.childNodes);
            // console.log(shadow.childNodes);

            childNodes.forEach((childNode: any) => {
                // console.log(childNode);
                if (childNode.tagName !== 'STYLE') {
                    const btnView = childNode.getElementsByClassName('view_btn');
                    btnView[0].part.replace('button', 'button_view');
                }
            });
        });


    }

    async showCartToast(message, type = "info") {
        const toast = await this.toastController.create({
            message: message,
            position: 'bottom',
            cssClass: 'letsCartToast success',
            duration: 3000,
            buttons: [
                {
                    side: 'end',
                    icon: 'cart-outline',
                    text: ' Cart',
                    cssClass: 'btn btn-info',
                    handler: () => {
                        this.router.navigate(['/cart']);
                        // console.log('Toast clicked', this.router);
                        // return false;
                    }
                },
                // {
                // 	text: '',
                // 	icon: 'close-circle-outline',
                // 	role: 'cancel',
                // 	handler: () => {
                // 		console.log('Cancel clicked');
                // 	}
                // }
            ]
        });
        toast.present();
    }

    async presentAlertConfirm(alertData, handler) {
        if (alertData.header === false) {
            delete alertData.header;
        } else if (alertData.header === undefined) {
            alertData.header = 'Please Confirm!';
        }

        if (alertData.message === false) {
            delete alertData.message;
        } else if (alertData.message === undefined) {
            alertData.message = 'Are you sure ?';
        } else {
            alertData.message = '<p>' + alertData.message + '</p>';
        }

        alertData.buttons = [
            {
                text: alertData.text_ok ? alertData.text_ok : 'Ok',
                cssClass: 'btn btn-theme alert-btn m-0 w-100 ' + alertData.class_ok,
                handler: handler
            }
        ];

        if (alertData.cancelBtn !== false) {
            alertData.buttons.push({
                text: alertData.text_cancel ? alertData.text_cancel : 'Cancel',
                role: 'cancel',
                cssClass: 'btn btn-secondary alert-btn  m-0 w-100 ' + alertData.class_cancel,
                handler: (blah) => {
                    // console.log('Confirm Cancel: blah');
                }
            });
        }

        const alert = await this.alertController.create({
            cssClass: 'lets-alert-confirm ' + alertData.alertClass,
            header: alertData.header,
            message: alertData.message,
            buttons: alertData.buttons
        });

        await alert.present().then(() => {
            if (typeof alertData.presentCallBack == 'function') {
                alertData.presentCallBack()
            }
        });
        alert.onWillDismiss().then(() => {
            if (typeof alertData.dismissCallBack == 'function') {
                alertData.dismissCallBack()
            }
        })
    }

    obejctToString(object) {
        let string: string = "";
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                string += key + ' : ' + object[key] + '<br>';
            }
        }
        return string;
    }

    getDateOrTime(string, format: string) {
        let date = new Date(string);
        let Y = date.getFullYear(); //Get the year as a four digit number (yyyy)
        let m = date.getMonth() + 1; //Get the month as a number (0-11)
        let d = date.getDate(); //Get the day as a number (1-31)
        let H = date.getHours(); //Get the hour (0-23)
        let i = date.getMinutes(); //Get the minute (0-59)
        let s = date.getSeconds(); //Get the second (0-59)
        let dateFormats = {
            Y: Y,
            m: (m < 10) ? "0" + m : m,
            d: (d < 10) ? "0" + d : d,
            H: (H < 10) ? "0" + H : H,
            i: (i < 10) ? "0" + i : i,
            s: (s < 10) ? "0" + s : s,
        }
        return this.replace(format, dateFormats);
    }

    replace(string, object) {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                // const element = object[key];
                string = string.replace(key, object[key]);
                // console.log(key, object[key], replacedString);
            }
        }
        return string;
    }

    async presentActionSheet(data) {
        const actionSheet = await this.actionSheetController.create(data);
        await actionSheet.present();
    }

    setFormErrors(form, response) {
        if (!response.status) {
            if (response.errors.length !== 0) {
                for (const key in response.errors) {
                    if (Object.prototype.hasOwnProperty.call(response.errors, key)) {
                        if (form.get(key)) {
                            form.get(key).setErrors({ server: response.errors[key] });
                            if (response.message) {
                                this.showToast(response.message, false);
                            }
                        } else {
                            this.showToast(response.errors[key], false);
                        }
                    }
                }
            } else {
                this.showToast(response.message, false);
            }
        }
        // console.log(form);
    }


    async closePopovers() {
        // console.log('backbutton triggered');
        // close action sheet
        try {
            const element = await this.alertController.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        // close alert
        try {
            const element = await this.actionSheetController.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        // close popover
        try {
            const element = await this.popoverController.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        // close modal
        try {
            const element = await this.modalController.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
            console.log(error);

        }

        // close side menua
        try {
            const element = await this.menuController.getOpen();
            if (element !== null) {
                this.menuController.close();
                return;
            }
        } catch (error) {
        }
    }
}
