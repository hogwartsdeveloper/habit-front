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
    return this.http.put<User>('/api/users/' + userId, data).pipe(
      map((res) => {
        const oldUser = this.user$.value;
        return this.user$.next(
          new User(
            oldUser?.id!,
            res.email,
            res.firstName,
            res.lastName,
            res.img,
            oldUser?.token!,
            oldUser?.tokenExpired!
          )
        );
      })
    );
  }

  uploadImg(userId: string, imgBase64: string) {
    return this.http
      .post<User>('/api/users/uploadImg/' + userId, { image: imgBase64 })
      .pipe(
        map((res) => {
          const oldUser = this.user$.value;
          return this.user$.next(
            new User(
              oldUser?.id!,
              oldUser?.email!,
              oldUser?.firstName!,
              oldUser?.lastName!,
              res.img,
              oldUser?.token!,
              oldUser?.tokenExpired!
            )
          );
        })
      );
  }
}
