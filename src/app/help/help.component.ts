import { Component, ViewChild, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare const Swiper: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  @ViewChild('Homepage')
  modal1: ModalComponent;
  @ViewChild('VoiceSearch')
  modal2: ModalComponent;
  @ViewChild('Image')
  modal3: ModalComponent;
  @ViewChild('SafeSearch')
  modal4: ModalComponent;
  @ViewChild('Problem')
  modal5: ModalComponent;
  @ViewChild('DefaultSearch')
  modal6: ModalComponent;
  @ViewChild('ImageNotLoading')
  modal7: ModalComponent;
  @ViewChild('HowToSearch')
  modal8: ModalComponent;
  @ViewChild('RefineSearch')
  modal9: ModalComponent;

  constructor() { }

  ngOnInit() {
    $(document).ready(function() {
      function close_accordion_section() {
        $('.accordion .accordion-section-title').removeClass('active');
        $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
      }

      $('.accordion-section-title').click(function(e) {
        // Grab current anchor value
        let currentAttrValue = $(this).attr('href');

        if ($(e.target).is('.active')) {
          close_accordion_section();
        } else {
          close_accordion_section();

          // Add active class to section title
          $(this).addClass('active');
          // Open up the hidden content panel
          $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
        }
        e.preventDefault();
      });

      const mySwiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        allowTouchMove: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    });
  }

  close(num) {
    switch (num) {
      case '1': this.modal1.close(); break;
      case '2': this.modal2.close(); break;
      case '3': this.modal3.close(); break;
      case '4': this.modal4.close(); break;
      case '5': this.modal5.close(); break;
      case '6': this.modal6.close(); break;
      case '7': this.modal7.close(); break;
      case '8': this.modal8.close(); break;
      case '9': this.modal9.close(); break;
    }
  }

  open(num) {
    switch (num) {
      case '1': this.modal1.open(); break;
      case '2': this.modal2.open(); break;
      case '3': this.modal3.open(); break;
      case '4': this.modal4.open(); break;
      case '5': this.modal5.open(); break;
      case '6': this.modal6.open(); break;
      case '7': this.modal7.open(); break;
      case '8': this.modal8.open(); break;
      case '9': this.modal9.open(); break;
    }
  }
}
