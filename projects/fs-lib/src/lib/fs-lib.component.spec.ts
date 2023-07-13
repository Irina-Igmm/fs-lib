import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsLibComponent } from './fs-lib.component';

describe('FsLibComponent', () => {
  let component: FsLibComponent;
  let fixture: ComponentFixture<FsLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FsLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
