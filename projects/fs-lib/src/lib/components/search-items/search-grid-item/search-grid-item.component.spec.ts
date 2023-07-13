import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGridItemComponent } from './search-grid-item.component';

describe('SearchGridItemComponent', () => {
  let component: SearchGridItemComponent;
  let fixture: ComponentFixture<SearchGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
