import { IInput } from '../../utils/ui/input/models/input.interface';

export const authInputConfigs: IInput[] = [
  {
    title: 'First Name',
    required: true,
    placeholder: 'Zhannur',
    type: 'text',
    fName: 'name',
  },
  {
    title: 'Last Name',
    required: true,
    placeholder: 'Akhmetkhanov',
    type: 'text',
    fName: 'lastName',
  },
  {
    title: 'Email',
    required: true,
    placeholder: 'username@gmail.com',
    type: 'email',
    fName: 'email',
  },
  {
    title: 'Password',
    required: true,
    placeholder: 'Password',
    type: 'password',
    fName: 'password',
  },
];
