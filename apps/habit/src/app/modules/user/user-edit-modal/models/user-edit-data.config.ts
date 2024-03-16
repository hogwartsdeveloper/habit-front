import { IInput } from 'ui';

export const userInputConfigs: IInput[] = [
  {
    title: 'Имя',
    required: true,
    type: 'text',
    placeholder: 'Zhannur',
    fName: 'firstName',
  },
  {
    title: 'Фамилия',
    required: true,
    type: 'text',
    placeholder: 'Akhmetkhanov',
    fName: 'lastName',
  },
];
