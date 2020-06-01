import {
    Project
} from "./project";
import { format } from 'date-fns';

export class Task {
    constructor(name, date, description, priority, project) {
        this.name = name;
        this.dateString = date;
        this.date = new Date(
            Number(date.split("-")[0]),
            Number(date.split("-")[1]) - 1,
            Number(date.split("-")[2])
        );
        // YYYY-MM-DD

        this.description = description;
        this.priority = priority;
        this.project = project;

        this.isComplete = false;

    }

    complete() {
        this.isComplete = true;
    }

    changeProject(newProject) {
        this.project = newProject;
    }
}