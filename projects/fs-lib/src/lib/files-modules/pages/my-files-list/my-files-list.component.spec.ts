import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFilesListComponent } from './my-files-list.component';

describe('MyFilesListComponent', () => {
  let component: MyFilesListComponent;
  let fixture: ComponentFixture<MyFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyFilesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
