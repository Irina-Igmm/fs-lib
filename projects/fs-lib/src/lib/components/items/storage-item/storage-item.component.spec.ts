import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageItemComponent } from './storage-item.component';

describe('StorageItemComponent', () => {
  let component: StorageItemComponent;
  let fixture: ComponentFixture<StorageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
