import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderContentsGridViewComponent } from './folder-contents-grid-view.component';

describe('FolderContentsGridViewComponent', () => {
  let component: FolderContentsGridViewComponent;
  let fixture: ComponentFixture<FolderContentsGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderContentsGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderContentsGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
