import { IInput } from 'ui';

export const habitInputConfigs: IInput[] = [
  {
    title: 'Название',
    required: true,
    type: 'text',
    placeholder: 'Название',
    fName: 'title',
  },
  {
    title: 'Описание',
    required: false,
    type: 'text',
    placeholder: 'Описание',
    fName: 'description',
  },
];
