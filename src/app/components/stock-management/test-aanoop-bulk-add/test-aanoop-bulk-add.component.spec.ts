import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAanoopBulkAddComponent } from './test-aanoop-bulk-add.component';

describe('TestAanoopBulkAddComponent', () => {
  let component: TestAanoopBulkAddComponent;
  let fixture: ComponentFixture<TestAanoopBulkAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAanoopBulkAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestAanoopBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
