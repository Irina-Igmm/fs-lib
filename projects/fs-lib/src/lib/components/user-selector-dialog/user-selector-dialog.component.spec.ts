import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectorDialogComponent } from './user-selector-dialog.component';

describe('UserSelectorDialogComponent', () => {
  let component: UserSelectorDialogComponent;
  let fixture: ComponentFixture<UserSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSelectorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
