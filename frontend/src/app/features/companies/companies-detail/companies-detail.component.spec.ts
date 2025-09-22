import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesDetailComponent } from './companies-detail.component';

describe('CompaniesDetailComponent', () => {
  let component: CompaniesDetailComponent;
  let fixture: ComponentFixture<CompaniesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
