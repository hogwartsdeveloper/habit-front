import { IInput } from '../../../utils/ui/input/models/input.interface';

export const authInputConfigs: IInput[] = [
  {
    title: 'user.fName',
    required: true,
    placeholder: 'Zhannur',
    type: 'text',
    fName: 'firstName',
  },
  {
    title: 'user.lName',
    required: true,
    placeholder: 'Akhmetkhanov',
    type: 'text',
    fName: 'lastName',
  },
  {
    title: 'user.email',
    required: true,
    placeholder: 'username@gmail.com',
    type: 'email',
    fName: 'email',
  },
  {
    title: 'user.password',
    required: true,
    placeholder: 'Password',
    type: 'password',
    fName: 'password',
  },
];
