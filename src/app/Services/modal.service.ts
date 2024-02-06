import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalImageEnlargePage } from '../Pages/modal-image-enlarge/modal-image-enlarge.page';
import { ModalImageCropPage } from '../Pages/modal-image-crop/modal-image-crop.page';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(
        private modalController: ModalController
    ) { }

    async imageCropModal(data) {
        const modal = await this.modalController.create({
            component: ModalImageCropPage,
            cssClass: 'modal-image-crop',
            backdropDismiss: false,
            componentProps: {
                data: data
            }
        });
        return await modal.present();
    }

    async enlargeImage(data) {
        const modal = await this.modalController.create({
            component: ModalImageEnlargePage,
            cssClass: 'modal-image-enlarge',
            backdropDismiss: true,
            componentProps: {
                data: data
            }
        });
        return await modal.present();
    }



}
