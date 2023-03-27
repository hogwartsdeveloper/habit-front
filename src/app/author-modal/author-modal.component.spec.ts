import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorModalComponent } from './author-modal.component';

describe('AuthorModalComponent', () => {
  let component: AuthorModalComponent;
  let fixture: ComponentFixture<AuthorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
