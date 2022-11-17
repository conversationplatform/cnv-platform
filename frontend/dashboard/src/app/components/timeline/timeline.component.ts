import { Component, OnInit, Input } from '@angular/core';
import { TimelineItem } from 'src/app/interface/timeline.interface';

function hashCode(str: string): number { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number): string {
  var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input()
  items: TimelineItem[];
  activeItems: TimelineItem[];

  types: string[];
  activeTypes: string[];

  ngOnInit(): void {
    this.activeItems = this.items;
    this.types = this.items.map((item: TimelineItem) => item.type || "").filter((value, index, self) => {
      return self.indexOf(value) === index;
    }) || [];
    this.activeTypes = this.types;
  }

  onClickButton(type: string): void {
    if (this.hasTypeActive(type))
      this.activeTypes = this.activeTypes.filter((t: string) => t !== type);
    else
      this.activeTypes.push(type);
    this.activeItems = this.items.filter((item: TimelineItem) => {
      if (item.type && this.activeTypes.includes(item.type))
        return item;
      else return null
    })
  }

  getColor(type: string): string {
    return `#${intToRGB(hashCode(type))}`;
  }

  hasTypeActive(type: string): boolean {
    return this.activeTypes.includes(type);
  }

}
