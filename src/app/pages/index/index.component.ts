import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../shared/services/networkService';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {
  public number: number = 0;
  isOnline: boolean = true;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.networkService.isOnline.subscribe(status => {
      this.isOnline = status;
    });
  }

  increase() {
    this.number++;
  }

  decrease() {
    if (this.number === 0) return;
    this.number--;
  }
}
