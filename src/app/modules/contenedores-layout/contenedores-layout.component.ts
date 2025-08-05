import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { HeaderComponent } from '../../layouts/header/header.component';
import { SidebarComponent } from '../../layouts/sidebar/sidebar.component';
import { SearchModalComponent } from '../../partials/search-modal/search-modal.component';
import KTComponents from '@metronic/components/..';
import KTLayout from '../../../metronic/app/layouts/demo1';

@Component({
  selector: 'app-contenedores-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SearchModalComponent,
  ],
  templateUrl: './contenedores-layout.component.html',
  styleUrl: './contenedores-layout.component.scss',
})
export default class ContenedoresLayoutComponent implements AfterViewInit, OnInit {
  title = 'metronic-tailwind-angular';
  @HostBinding('class') hostClass = 'flex grow';

  ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }

  ngOnInit(): void {}
}
