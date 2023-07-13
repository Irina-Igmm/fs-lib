import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalFrameComponent } from './global-frame.component';

describe('GlobalFrameComponent', () => {
  let component: GlobalFrameComponent;
  let fixture: ComponentFixture<GlobalFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
