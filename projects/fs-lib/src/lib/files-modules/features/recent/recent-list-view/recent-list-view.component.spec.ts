import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentListViewComponent } from './recent-list-view.component';

describe('RecentListViewComponent', () => {
  let component: RecentListViewComponent;
  let fixture: ComponentFixture<RecentListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
