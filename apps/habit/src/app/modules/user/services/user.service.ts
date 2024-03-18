import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../model/user';
import { IGetUser, UpdateUser } from '../model/user.interface';
import {IApiResult} from "../../../shared/models/api-result";

@Injectable()
export class UserService {
  readonly user$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly http: HttpClient) {}

  getUser() {
    return this.http.get<IApiResult<IGetUser>>('/api/User');
  }

  update(data: UpdateUser) {
    return this.http
      .put<IApiResult<User>>('/api/User', data)
      .pipe(map((res) => this.updateUserData(res.result!)));
  }

  uploadImg(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<IApiResult<null>>('/api/User/image', formData);
  }

  deleteImg(imgName: string) {
    return this.http.delete<IApiResult<null>>('/api/User/Image', {
      params: {
        fileName: imgName,
      },
    });
  }

  checkEmailExist(email: string) {
    return this.http.get('/api/users/checkEmailExist/' + email);
  }

  checkEmailNotExist(email: string) {
    return this.http.get('/api/users/checkEmailNotExist/' + email);
  }

  private updateUserData(data: Partial<User>) {
    const oldUser = this.user$.value!;
    // this.user$.next(
    //   new User(
    //     data?.id || oldUser.id,
    //     data?.email || oldUser.email,
    //     data?.firstName || oldUser.firstName,
    //     data?.lastName || oldUser.lastName,
    //     data?.img ?? oldUser.img,
    //     oldUser.token || '',
    //     oldUser.tokenExpired
    //   )
    // );
  }
}
