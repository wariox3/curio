import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialListaComponent } from './historial-lista.component';

describe('HistorialListaComponent', () => {
  let component: HistorialListaComponent;
  let fixture: ComponentFixture<HistorialListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
