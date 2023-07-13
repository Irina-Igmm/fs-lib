import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySharedListPageComponent } from './my-shared-list-page.component';

describe('MySharedListPageComponent', () => {
  let component: MySharedListPageComponent;
  let fixture: ComponentFixture<MySharedListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySharedListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySharedListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
