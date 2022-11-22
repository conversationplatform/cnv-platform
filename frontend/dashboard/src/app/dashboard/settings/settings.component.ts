import { Component, OnInit } from '@angular/core';
import { ICustomProperties } from 'src/app/interface/ICustomProperties';
import { PropertiesService } from 'src/app/services/properties.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  cors: string[];


  customProperties: ICustomProperties;

  constructor(
    private readonly propertiesService: PropertiesService
  ) { }

  async ngOnInit() {
    this.customProperties = await this.propertiesService.getCustomProperties();
    this.cors = this.customProperties.cors.split(',');

  }

  updateCorsEntry(event: any, i: number) {
    this.cors[i] = event.target.value;
  }

  addCorsEntry() {
    this.cors.push('');
  }

  removeCorsEntry(idx: number) {
    this.cors.splice(idx, 1);
  }

  save() {
    this.customProperties.cors = this.cors.join(',');
    this.propertiesService.updateCustomProperties(this.customProperties);
  }

}
