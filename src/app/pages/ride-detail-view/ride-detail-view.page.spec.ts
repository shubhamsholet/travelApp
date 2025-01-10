import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideDetailViewPage } from './ride-detail-view.page';

describe('RideDetailViewPage', () => {
  let component: RideDetailViewPage;
  let fixture: ComponentFixture<RideDetailViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RideDetailViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
