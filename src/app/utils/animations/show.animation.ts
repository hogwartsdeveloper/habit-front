import { animate, style, transition, trigger } from '@angular/animations';

export const show = trigger('show', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('350ms ease', style({ opacity: '*' })),
  ]),
  transition(':leave', [
    style({ opacity: '*' }),
    animate('250ms ease', style({ opacity: 0 })),
  ]),
]);
