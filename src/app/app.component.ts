import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layouts/footer/footer.component';
import KTComponents from 'src/metronic/core';
import KTLayout from '../metronic/app/layouts/demo1';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, FooterComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
	title = 'metronic-tailwind-angular';
	@HostBinding('class') hostClass = 'flex grow';

	ngAfterViewInit(): void {
		KTComponents.init();
		KTLayout.init();
	}

	ngOnInit(): void {
	}
}

