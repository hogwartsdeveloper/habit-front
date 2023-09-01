import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../model/user.interface';
import { take } from 'rxjs';
import { IHabit } from '../../habit/models/habit.interface';
import { HabitService } from '../../habit/services/habit.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: IUser;
  habits: IHabit[];
  constructor(
    private authService: AuthService,
    public habitService: HabitService
  ) {}

  ngOnInit() {
    this.authService.user$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));

    this.habitService.habits$
      .pipe(take(1))
      .subscribe((habits) => (this.habits = habits));
  }
}
