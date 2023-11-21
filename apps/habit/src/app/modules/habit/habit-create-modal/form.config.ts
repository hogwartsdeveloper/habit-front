import { IInput } from 'ui';

export const habitInputConfigs: IInput[] = [
  {
    title: 'base.name',
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
