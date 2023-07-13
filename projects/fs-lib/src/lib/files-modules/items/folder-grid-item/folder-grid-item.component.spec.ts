import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderGridItemComponent } from './folder-grid-item.component';

describe('FolderGridItemComponent', () => {
  let component: FolderGridItemComponent;
  let fixture: ComponentFixture<FolderGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
