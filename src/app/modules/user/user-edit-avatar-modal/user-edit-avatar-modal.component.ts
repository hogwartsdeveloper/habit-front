import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit-avatar',
  templateUrl: './user-edit-avatar-modal.component.html',
})
export class UserEditAvatarModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<UserEditAvatarModalComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
