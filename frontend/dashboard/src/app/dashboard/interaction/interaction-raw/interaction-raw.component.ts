import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IClientInteraction } from 'src/app/interface/ClientInteraction.interface';

@Component({
  selector: 'app-interaction-raw',
  templateUrl: './interaction-raw.component.html',
  styleUrls: ['./interaction-raw.component.scss']
})
export class InteractionRawComponent {

  constructor(
    public dialogRef: MatDialogRef<InteractionRawComponent>,
    @Inject(MAT_DIALOG_DATA) public interaction: IClientInteraction) { }

}
