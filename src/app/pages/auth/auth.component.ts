import { NgClass, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    NgFor,
    NgClass,
    RouterLink,
  ],
})
export default class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  langs = [
    {
      lang: 'es',
      name: 'Español',
      flag: './assets/media/flags/spain.svg',
    },
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/flags/united-states.svg',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    //this.setLanguage(this.translationService.getSelectedLanguage());
  }

  selectLanguage(lang: string) {
    //this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    // this.langs.forEach((language: LanguageFlag) => {
    //   if (language.lang === lang) {
    //     language.active = true;
    //     this.language = language;
    //   } else {
    //     language.active = false;
    //   }
    // });
  }

  ngOnDestroy() {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
