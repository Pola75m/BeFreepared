import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArchivesComponent } from './my-archives.component';

describe('MyArchivesComponent', () => {
  let component: MyArchivesComponent;
  let fixture: ComponentFixture<MyArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyArchivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
