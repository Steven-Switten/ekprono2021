import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronosComponent } from './pronos.component';

describe('PronosComponent', () => {
  let component: PronosComponent;
  let fixture: ComponentFixture<PronosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PronosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PronosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
