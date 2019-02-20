import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
<<<<<<< HEAD
import { url } from 'assets/url_configuration';
=======
import { validatePhone, validateEmail, validateMessage, validateName, countryCodeList } from '../utils';

>>>>>>> upstream/development
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
<<<<<<< HEAD

    boatImage = url.logos.boat_image;

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
=======
  @ViewChild('submitButton') submitButton;

  emailInput: string;
  nameInput: string;
  phoneNumberInput: number;
  contactMessage: string;
  countryCodeList: any;

  @ViewChild('ContactUsModal')
  modal: ModalComponent;

  constructor() {}

  ngOnInit() {
    this.contactMessage = '';
    this.countryCodeList = countryCodeList;
  }

  closeModal() {
    this.modal.close();
  }

  openModal() {
    this.modal.open();
  }

  checkValidity() {
    if (
      validateEmail(this.emailInput) &&
      validatePhone(this.phoneNumberInput) &&
      validateMessage(this.contactMessage) &&
      validateName(this.nameInput)
    ) {
      this.submitButton.nativeElement.disabled = false;
    } else {
      this.submitButton.nativeElement.disabled = true;
>>>>>>> upstream/development
    }
  }
}
