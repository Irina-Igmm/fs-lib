import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderGridViewComponent } from './folder-grid-view.component';

describe('FolderGridViewComponent', () => {
  let component: FolderGridViewComponent;
  let fixture: ComponentFixture<FolderGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
