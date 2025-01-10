import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MyWalletPage } from './wallet-history.page';

describe('WalletHistoryPage', () => {
  let component: MyWalletPage;
  let fixture: ComponentFixture<MyWalletPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
