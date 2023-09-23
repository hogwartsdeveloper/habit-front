import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { startDate: string; endDate: string }
  ) {}
}
