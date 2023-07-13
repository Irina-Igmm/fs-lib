import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCircleProgressComponent } from './custom-circle-progress.component';

describe('CustomCircleProgressComponent', () => {
  let component: CustomCircleProgressComponent;
  let fixture: ComponentFixture<CustomCircleProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCircleProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCircleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
