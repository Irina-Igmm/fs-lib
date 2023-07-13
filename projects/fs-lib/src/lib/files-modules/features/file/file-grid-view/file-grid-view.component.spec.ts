import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileGridViewComponent } from './file-grid-view.component';

describe('FileGridViewComponent', () => {
  let component: FileGridViewComponent;
  let fixture: ComponentFixture<FileGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
