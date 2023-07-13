import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListViewComponent } from './file-list-view.component';

describe('FileListViewComponent', () => {
  let component: FileListViewComponent;
  let fixture: ComponentFixture<FileListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
