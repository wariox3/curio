import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialBaseComponent } from './historial-base.component';

describe('HistorialBaseComponent', () => {
  let component: HistorialBaseComponent;
  let fixture: ComponentFixture<HistorialBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
