import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

import { UpdateUser } from '../model/user.interface';
import { User } from '../model/user';

@Injectable()
export class UserService {
  readonly user$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly http: HttpClient) {}

  update(userId: string, data: UpdateUser) {
    return this.http
      .put<User>('/api/users/' + userId, data)
      .pipe(map((res) => this.updateUserData(res)));
  }

  uploadImg(userId: string, imgBase64: string) {
    return this.http
      .post<User>('/api/users/uploadImg/' + userId, { image: imgBase64 })
      .pipe(map((res) => this.updateUserData(res)));
  }

  deleteImg(userId) {
    return this.http
      .delete<User>('/api/users/uploadImg/' + userId)
      .pipe(map((res) => this.updateUserData(res)));
  }

  checkEmail(email: string) {
    return this.http.get<Pick<User, 'email'>>('/api/users/checkEmail/' + email);
  }

  private updateUserData(data: Partial<User>) {
    const oldUser = this.user$.value!;
    this.user$.next(
      new User(
        data?.id || oldUser.id,
        data?.email || oldUser.email,
        data?.firstName || oldUser.firstName,
        data?.lastName || oldUser.lastName,
        data?.img ?? oldUser.img,
        oldUser.token || '',
        oldUser.tokenExpired
      )
    );
  }
}
