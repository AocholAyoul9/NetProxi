import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type NoticeTone = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, tone: NoticeTone = 'info') {
    this.snackBar.open(message, 'OK', {
      duration: tone === 'error' ? 6000 : 3500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`np-snack-${tone}`],
    });
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}

