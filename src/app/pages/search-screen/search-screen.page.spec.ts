import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchScreenPage } from './search-screen.page';

describe('SearchScreenPage', () => {
  let component: SearchScreenPage;
  let fixture: ComponentFixture<SearchScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
