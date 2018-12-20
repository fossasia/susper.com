import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { validatePhone, validateEmail, validateMessage, validateName, countryCodeList } from '../utils';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
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
    }
  }
}
