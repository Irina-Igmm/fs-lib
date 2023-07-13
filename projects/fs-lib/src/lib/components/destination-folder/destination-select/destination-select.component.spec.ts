import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationSelectComponent } from './destination-select.component';

describe('DestinationSelectComponent', () => {
  let component: DestinationSelectComponent;
  let fixture: ComponentFixture<DestinationSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestinationSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
