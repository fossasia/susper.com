import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
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

    // check whether messsage contains morthan 100 words
    checkWordCount() {

        if (this.tpnoInput && this.tpnoInput.toString().length >= 10) {
            this.submitButton.nativeElement.disabled = false;
        }else {
            this.submitButton.nativeElement.disabled = true;
        }

    } // End checkWordCount()
}
