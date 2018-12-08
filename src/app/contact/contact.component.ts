import { Component, ViewChild, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, DoCheck {

    @ViewChild('submitButton') submitButton;

    emailInput: string;
    nameInput: string;
    tpnoInput: number;
    contactMessage: string = '';

    @ViewChild('myModal')
    modal: ModalComponent;

    constructor() { }

    ngOnInit() {
    }

    close() {
        this.modal.close();
    }

    open() {
        this.modal.open();
    }

    ngDoCheck() {
        this.checkValidity(); 
    }

    checkValidity() {
        if(this.validateEmail(this.emailInput) && this.validatePhone(this.tpnoInput) && this.validateMessage(this.contactMessage) && this.validateName(this.nameInput)) {
            this.submitButton.nativeElement.disabled = false;
        } else {
            this.submitButton.nativeElement.disabled = true;
        }
    }

    validateMessage(message) {
        if (message && (message.length >= 100)) {
            return true;
        } else {
            return false;
        }
    }

    validatePhone(phone) {
        if (phone && (phone.toString().length >= 10)) {
            return true;
        } else {
            return false;
        }
    }

    validateEmail(email) {
        if (email) {
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        } else {
            return false;
        }
    }

    validateName(name) {
        if(name && (name.length > 0)) {
            return true;
        } else {
            return false;
        }
    }

}