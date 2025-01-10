import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyUpdatePage } from './my-update.page';

describe('MyUpdatePage', () => {
  let component: MyUpdatePage;
  let fixture: ComponentFixture<MyUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
