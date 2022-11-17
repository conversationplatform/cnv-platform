import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface DataNode {
  name: string;
  children?: DataNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-object-tree',
  templateUrl: './object-tree.component.html'
})
export class ObjectTreeComponent implements OnInit {

  @Input()
  dataObject: Object | any

  private _transformer = (node: DataNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );


  dataSource: MatTreeFlatDataSource<DataNode, { expandable: boolean; name: string; level: number; }, { expandable: boolean; name: string; level: number; }>;

  ngOnInit(): void {
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.objectMapper(this.dataObject);
    
  }

  
  hasChild = (_: number, node: FlatNode) => node.expandable;
  
  objectMapper(object: any): DataNode[] {
    if(!object) {
      return [];
    }
    const keys = Object.keys(object) || [];
    return keys.map(key => {
      const value = object[key];
      const type = typeof value;
      
      switch(type) {
        case 'object': return {
          name: key,
          children: this.objectMapper(value)
        }
        case 'string': 
        case 'boolean':
        default: return {
          name: key,
          children: [{
            name: value
          }]
        } 
      }
    })
    
  }

}
