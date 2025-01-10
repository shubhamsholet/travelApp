import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopWithdrawPage } from './top-withdraw.page';

describe('TopWithdrawPage', () => {
  let component: TopWithdrawPage;
  let fixture: ComponentFixture<TopWithdrawPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TopWithdrawPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
