import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArchiveListComponent } from './my-archive-list.component';

describe('MyArchiveListComponent', () => {
  let component: MyArchiveListComponent;
  let fixture: ComponentFixture<MyArchiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyArchiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArchiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
