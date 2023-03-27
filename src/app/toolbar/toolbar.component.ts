import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthorModalComponent } from '../author-modal/author-modal.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [MatDialogModule],
  standalone: true,
})
export class ToolbarComponent {
  constructor(private dialog: MatDialog) {}

  openLogin() {
    this.dialog.open(AuthorModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
    });
  }
}
