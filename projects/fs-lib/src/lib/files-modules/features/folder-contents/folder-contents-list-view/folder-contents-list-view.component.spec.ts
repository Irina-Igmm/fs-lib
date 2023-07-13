import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderContentsListViewComponent } from './folder-contents-list-view.component';

describe('FolderContentsListViewComponent', () => {
  let component: FolderContentsListViewComponent;
  let fixture: ComponentFixture<FolderContentsListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderContentsListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderContentsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
