import { IInput } from '../../../../utils/ui/input/models/input.interface';

export const userInputConfigs: IInput[] = [
  {
    title: 'First Name',
    required: true,
    type: 'text',
    placeholder: 'Zhannur',
    fName: 'name',
  },
  {
    title: 'Last Name',
    required: true,
    type: 'text',
    placeholder: 'Akhmetkhanov',
    fName: 'lastName',
  },
];
