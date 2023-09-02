import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../pages/user/model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject(false);
  user$ = new BehaviorSubject<IUser>({
    lastName: 'Akhmetkhanov',
    firstName: 'Zhannur',
    email: 'jannuraidynuly@gmail.com',
    img: 'https://media.licdn.com/dms/image/D4D03AQEDKKK8u_QR-w/profile-displayphoto-shrink_800_800/0/1693367601823?e=1698883200&v=beta&t=2tagzKZb8oXaAq0z4WWw0zTRxJhL7WcBcPtmVlutmgs',
  });

  constructor() {}
}
