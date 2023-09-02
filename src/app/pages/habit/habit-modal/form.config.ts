import { IInput } from '../../../utils/ui/input/models/input.interface';

export const habitInputConfigs: IInput[] = [
  {
    title: 'Name',
    required: true,
    type: 'text',
    placeholder: 'Habit Name',
    fName: 'name',
  },
  {
    title: 'Description',
    required: false,
    type: 'text',
    placeholder: 'Habit Description',
    fName: 'description',
  },
];
