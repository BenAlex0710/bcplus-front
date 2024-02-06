import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
    selector: 'app-searchable-select',
    templateUrl: './searchable-select.component.html',
    styleUrls: ['./searchable-select.component.scss'],
})
export class SearchableSelectComponent implements OnInit {

    @Input('title') title: any;
    @Input('options') options: any;
    @Input('inputName') inputName: any;
    @Input('form') form: any;
    @Input('selectedOptions') selectedOptions: any;
    @Input('multiple') multiple: any;
    @Input('valueIndex') valueIndex: any;
    @Input('labelIndex') labelIndex: any;
    @ViewChild(IonModal) modal: IonModal;
    selectedOptionsLables = '';

    constructor() {

    }

    name: string;

    cancel() {
        this.modal.dismiss(null, 'cancel');
    }

    confirm() {
        // console.log(this.selectedOptions);
        this.form.get(this.inputName).setValue(this.selectedOptions);
        this.setOptionLebels();
        this.modal.dismiss(this.name, 'confirm');
    }

    setOptionLebels() {
        console.log(this.selectedOptions);
        // if (!this.multiple) {
        //     this.selectedOptionsLables = this.selectedOptions;
        //     return;
        // }
        let selectedOptionsLables = [];
        this.options.forEach(option => {
            // console.log(option);
            if (this.selectedOptions.indexOf((option[this.valueIndex]).toString()) >= 0) {
                selectedOptionsLables.push(option[this.labelIndex]);
            }
        });
        this.selectedOptionsLables = selectedOptionsLables.toString();
        // console.log(this.selectedOptionsLables);
    }



    validateSearchInput(event) {
        // console.log(event);
        var charCode = (event.which) ? event.which : event.keyCode;
        var pattern = /^[a-z\d\_\s]+$/i;
        var isValid = pattern.test(String.fromCharCode(charCode));

        // if ((charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 105) || (charCode >= 48 && charCode <= 57)) {
        if (isValid) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    searchOption(keyword) {
        // searchedOptions;
        // this.searchedOptions = [];
        // this.options.forEach(option => {
        //     if (option.username.search(keyword) >= 0) {
        //         this.searchedOptions.push(option);
        //     }
        // });
        // console.log(this.searchedOptions);

        for (let index = 0; index < this.options.length; index++) {
            let option = this.options[index];
            if (keyword.toLowerCase() == '') {
                option.hide = false;
                continue;
            }
            // console.log(option.username.search(keyword))
            if ((option[this.labelIndex]).toLowerCase().search(keyword.toLowerCase()) >= 0) {
                option.hide = false;
            } else {
                option.hide = true;
            }
            this.options[index] = option;

        }
        // console.log(this.options);
    }

    selectOption(event) {
        // console.log(this.selectedOptions);
        // console.log(typeof this.selectedOptions);
        var value = event.target.value;

        if (!this.multiple) {
            this.selectedOptions = value;
            this.setOrder();
            return;
        }
        if (typeof this.selectedOptions == 'string') {
            this.selectedOptions = [];
        }

        var index = this.selectedOptions.indexOf(value);
        if (event.target.checked) {
            if (index == -1) {
                this.selectedOptions.push(value);
            }
        } else {
            this.selectedOptions.splice(index, 1);
        }
        // console.log(this.selectedOptions);
        this.setOrder();
    }


    setOrder() {
        let selectedOptions = [];
        let notSelectedOptions = [];

        this.options.forEach(option => {
            // console.log(option);
            if (this.selectedOptions.indexOf((option[this.valueIndex]).toString()) >= 0) {
                selectedOptions.push(option);
            } else {
                notSelectedOptions.push(option);
            }
        });

        this.options = selectedOptions.concat(notSelectedOptions);
    }

    modalPresent() {
        this.searchOption('');
        // console.log(this.options, this.inputName, this.form, this.selectedOptions);
        this.setOptionLebels();
    }

    ngOnInit() {
        this.setOrder();
        this.searchOption('');
        this.setOptionLebels();
    }

}
