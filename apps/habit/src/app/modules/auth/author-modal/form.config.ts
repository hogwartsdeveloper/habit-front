import { IInput } from 'ui';

export const authInputConfigs: IInput[] = [
  {
    title: 'Имя',
    required: true,
    placeholder: 'Zhannur',
    type: 'text',
    fName: 'firstName',
  },
  {
    title: 'Фамилия',
    required: true,
    placeholder: 'Akhmetkhanov',
    type: 'text',
    fName: 'lastName',
  },
  {
    title: 'Почта',
    required: true,
    placeholder: 'username@gmail.com',
    type: 'email',
    fName: 'email',
  },
  {
    title: 'Пароль',
    required: true,
    placeholder: 'Password',
    type: 'password',
    fName: 'password',
  },
];
