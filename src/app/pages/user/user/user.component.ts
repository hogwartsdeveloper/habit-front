import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../model/user.interface';
import { take } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: IUser;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }
}
