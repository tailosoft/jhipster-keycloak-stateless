export interface ITask {
    id?: number;
    name?: string;
    description?: string;
}

export class Task implements ITask {
    constructor(public id?: number, public name?: string, public description?: string) {}
}
