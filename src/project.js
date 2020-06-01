import {
    Task
} from "./task";

export class Project {
    constructor(name, color, taskArray) {
        this.name = name;
        this.color = color;
        this.tasks = taskArray;

        this.active = false;
    }

    addTask(newTask) {
        this.tasks.push(newTask);
    }

    removeTask(task) {
        console.log("here");
        this.tasks.splice(this.tasks.findIndex(someTask => someTask === task), 1);
    }
}