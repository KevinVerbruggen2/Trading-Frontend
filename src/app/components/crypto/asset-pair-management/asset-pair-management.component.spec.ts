import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPairManagementComponent } from './asset-pair-management.component';

describe('AssetPairManagementComponent', () => {
  let component: AssetPairManagementComponent;
  let fixture: ComponentFixture<AssetPairManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetPairManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetPairManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
