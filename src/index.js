import { format } from 'date-fns';
import { Task } from "./task";
import { Project } from "./project";
import { DOMController } from "./domcontroller";



// array of all projects
let projects = [];


// "projects": "name-color, name-color"
// "_project_name_": "name-date-desc-priority,name-date-desc-priority"
const load = function() {
    // if localStorage is null (first time user)
    if (localStorage.getItem("projects") === null) {
        localStorage.setItem("projects", "Default|lightseagreen,");
        localStorage.setItem("Default", "");
    }

    let projectArr = localStorage.getItem("projects").split(",");
    for (let i = 0; i < projectArr.length; i++) {
        if (projectArr[i] === "") {
            continue;
        }
        projects.push(
            new Project(projectArr[i].split("|")[0], projectArr[i].split("|")[1],[])
        );
    }

    for (let project of projects) {

        if (localStorage.getItem(project.name) === "") {
            continue;
        }

        let taskArray = localStorage.getItem(project.name).split(","); //break
        for (let i = 0; i < taskArray.length; i++) {
            if (taskArray[i] === "") {
                continue;
            }
            let taskParams = taskArray[i].split("|");
            project.addTask(new Task(
                taskParams[0],
                taskParams[1],
                taskParams[2],
                taskParams[3],
                project
            ));
        }
    }
}();

DOMController.init(projects);




// remove project + local storage implementation

// delete all data?
