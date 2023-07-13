import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterPaginationComponent } from './letter-pagination.component';

describe('LetterPaginationComponent', () => {
  let component: LetterPaginationComponent;
  let fixture: ComponentFixture<LetterPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
