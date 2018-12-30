import { Component, ViewChild, OnInit, DoCheck } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {environment} from 'environments/environment'
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, DoCheck {

    @ViewChild('submitButton') submitButton;
    token = environment.token;

    emailInput: string;
    nameInput: string;
    tpnoInput: number;
    countrycode: string;
    contactMessage: string = '';

    @ViewChild('myModal')
    modal: ModalComponent;

    constructor() {
        if(this.token === "") {
            console.log("Token Missing")
            return;
        }
     }

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
        if (this.validateEmail(this.emailInput) && this.validatePhone(this.tpnoInput) && this.validateMessage(this.contactMessage) && this.validateName(this.nameInput)) {
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
        if (name && (name.length > 0)) {
            return true;
        } else {
            return false;
        }
    }
    mail () {
        if (this.tpnoInput && this.tpnoInput.toString().length >= 10 && this.tpnoInput > 0 && this.contactMessage && this.contactMessage.length >= 100 ) {
            let Message = "Name:   " + this.nameInput + "     Contact No:    " + this.countrycode + this.tpnoInput + '       ' + "Message:       " + this.contactMessage;
            let js1 = document.createElement("script");
            let ScriptHTML = "Email.send({SecureToken : '"+this.token+"' ,To:'office@fossasia.org' ,From:'" + this.emailInput + "',Subject:'Contact Form', Body:'" + Message + "'}).then(function(message){if(message === 'OK'){ alert('sent'); } else {alert('Retry'); }});";
            js1.innerHTML = ScriptHTML;
            js1.type = "text/javascript" ;
            this.modal.close();
            document.body.appendChild(js1);
            } else {
                alert('Error in Details or You are in development Mode');
            }
    }

}
