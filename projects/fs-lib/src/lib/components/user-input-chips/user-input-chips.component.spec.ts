import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputChipsComponent } from './user-input-chips.component';

describe('UserInputChipsComponent', () => {
  let component: UserInputChipsComponent;
  let fixture: ComponentFixture<UserInputChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInputChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
