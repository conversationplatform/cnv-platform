export class Property<T> {

    _key?: string;
    createDate: Date;
    modifiedDate: Date
    name: string;
    data: T
    
    constructor(name: string, data: T) {
        this.createDate = new Date();
        this.modifiedDate = new Date();
        this.name = name;
        this.data = data;
    }
}