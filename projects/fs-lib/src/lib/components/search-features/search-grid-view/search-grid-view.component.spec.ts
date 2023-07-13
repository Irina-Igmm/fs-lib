import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGridViewComponent } from './search-grid-view.component';

describe('SearchGridViewComponent', () => {
  let component: SearchGridViewComponent;
  let fixture: ComponentFixture<SearchGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
