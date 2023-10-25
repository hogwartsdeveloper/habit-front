import { IInput } from '../../../../utils/ui/input/models/input.interface';

export const userInputConfigs: IInput[] = [
  {
    title: 'user.fName',
    required: true,
    type: 'text',
    placeholder: 'Zhannur',
    fName: 'firstName',
  },
  {
    title: 'user.lName',
    required: true,
    type: 'text',
    placeholder: 'Akhmetkhanov',
    fName: 'lastName',
  },
];
