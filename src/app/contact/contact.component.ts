import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    @ViewChild('submitButton') submitButton;
    @ViewChild('emailInput') emailInput;
    nameInput: string;
    tpnoInput: number;
    contactMessage: string = '';
    countrycode: string;
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

    // check whether messsage contains more than 100 words
    checkValidity() {
        if (this.tpnoInput && this.tpnoInput.toString().length >= 10 && this.tpnoInput > 0) {
            this.submitButton.nativeElement.disabled = false;
        } else {
            this.submitButton.nativeElement.disabled = true;
        }

        if (this.contactMessage && this.contactMessage.length >= 100) {
            this.submitButton.nativeElement.disabled = false;
        } else {
            this.submitButton.nativeElement.disabled = true;
        }
    }
    mail() {
        if (this.tpnoInput && this.tpnoInput.toString().length >= 10 && this.tpnoInput > 0 && this.contactMessage && this.contactMessage.length >= 100) {
        let Message = "Name:   " + this.nameInput + "     Contact No:    " + this.countrycode + this.tpnoInput + '       ' + "Message:       " + this.contactMessage;
        let js1 = document.createElement("script");
        js1.innerHTML = "Email.send({SecureToken : 'e64d9c8a-8ce6-46f1-8d1c-3b9acebe5c20' ,To:'office@fossasia.org' ,From:'" + this.emailInput + "',Subject:'Contact Form', Body:'" + Message + "'}).then( function(message){if(message === 'OK'){alert('sent')} else {alert('Not Sent.Retry')}});"
        js1.type = "text/javascript" ;

        document.body.appendChild(js1);
        this.modal.close();
        } else {
            alert('Error in Details');
        }
    }
}
