import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentGridViewComponent } from './recent-grid-view.component';

describe('RecentGridViewComponent', () => {
  let component: RecentGridViewComponent;
  let fixture: ComponentFixture<RecentGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
