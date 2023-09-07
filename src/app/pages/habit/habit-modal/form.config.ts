import { IInput } from '../../../utils/ui/input/models/input.interface';

export const habitInputConfigs: IInput[] = [
  {
    title: 'user.name',
    required: true,
    type: 'text',
    placeholder: 'habit.name',
    fName: 'name',
  },
  {
    title: 'base.description',
    required: false,
    type: 'text',
    placeholder: 'habit.description',
    fName: 'description',
  },
];
