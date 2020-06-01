import { formatDistanceToNowStrict, format } from 'date-fns';
import { Task } from "./task";
import { Project } from './project';

let deleteProjectButton = document.querySelector("#delete-project-btn");

let projectContainer = document.querySelector(".project-container");
let projectItems;
let taskContainer = document.querySelector(".task-container");
let currentProjectName = document.querySelector("#current-project-name");
let addNewProject = document.querySelector("#add-new-project");

let addNewTaskMenu = document.querySelector("#add-new-task-menu");
let cancelNewTaskBtn = document.querySelector("#cancel-new-task-btn");
let submitNewTaskBtn = document.querySelector("#submit-new-task-btn");

let addNewProjectMenu = document.querySelector("#add-new-project-menu");
let addNewProjectBtn = document.querySelector("#add-new-project");
let cancelNewProjectBtn = document.querySelector("#cancel-new-project-btn");
let submitNewProjectBtn = document.querySelector("#submit-new-project-btn");


let addNewTaskButton = document.querySelector("#add-new-task-button");

let deleteForeverBtn = document.querySelector("#delete-forever-btn");

const DEFAULT_PROJECT_BGRD_COLOR = "rgb(241, 241, 241)";
const PRIORITY_COLORS = ["#FFECB3", "#FFD54F", "#FFC107", "#FFA000", "#FF6F00"];

export class DOMController {

    static init(projects) {
        this.initListeners(projects);
        this.renderProjects(projects);
        this.renderTasks(projects);
    }

    static initListeners(projects) {
        this.initProjectListeners(projects);
        this.initDeleteProjectListener(projects);
        this.initAddNewTaskListeners(projects);
        this.initAddNewProjectListeners(projects);
        this.initDeleteForeverListener();
    }
    
    static initDeleteForeverListener() {
        deleteForeverBtn.addEventListener("click", () => {
            if (confirm("Permanently reset all data?")) {
                localStorage.clear();
                location.reload();
            }
        })
    }

    static initDeleteProjectListener(projects) {
        deleteProjectButton.addEventListener("click", () => {
            if (confirm("Delete the current project?")) {
                for (let project of projects) {
                    if (project.active === true) {
                        projects.splice(projects.findIndex(p => p === project), 1);
                        DOMController.updateProjectStorage(projects);
                        localStorage.removeItem(project.name);

                        DOMController.renderProjects(projects);
                        DOMController.renderTasks(projects);
                    }
                }

            }
        })
    }

    static initProjectListeners(projects) {

        projectItems = Array.from(document.querySelectorAll(".project-item"));
        
        for (let projectItem of projectItems) {
            projectItem.addEventListener("click", () => {
                for (let p of projects) {
                    p.active = false;
                }
                for (let p of projectItems) {
                    p.classList.remove("active-project");
                    p.style.backgroundColor = DEFAULT_PROJECT_BGRD_COLOR;
                }

                // sets the selected project as active
                let selectedProject = projects[
                    projects.findIndex(p => p.name === event.currentTarget.children[1].innerHTML)
                ];
                selectedProject.active = true;


                currentProjectName.style.color = selectedProject.color;

                // renders the selected project as active
                event.currentTarget.classList.add("active-project");
                event.currentTarget.style.backgroundColor = selectedProject.color;

                DOMController.renderTasks(projects);
            });
        }
    }

    static initAddNewTaskListeners(projects) {
        addNewTaskButton.addEventListener("click", () => {
            if (projects.length === 0) {
                alert("Create a new project first");
                return;
            }

            addNewTaskMenu.style.opacity = "100%";
            addNewTaskMenu.style.pointerEvents = "auto";

            addNewProjectMenu.style.opacity = "0%";
            addNewProjectMenu.style.pointerEvents = "none";
        });

        cancelNewTaskBtn.addEventListener("click", () => {
            addNewTaskMenu.style.opacity = "0%";
            addNewTaskMenu.style.pointerEvents = "none";
        });

        submitNewTaskBtn.addEventListener("click", () => {
            let name = document.querySelector("#name-input");
            let date = document.querySelector("#date-input");
            let description = document.querySelector("#description-input");
            let priority = document.querySelector("#priority-select");

            for (let project of projects) {
                if (project.active === true) {
                    project.addTask(
                        new Task(
                            name.value,
                            date.value,
                            description.value,
                            priority.value,
                            project
                        )
                    );

                    // adds task to local storage
                    localStorage.setItem(project.name, 
                        localStorage.getItem(project.name) +
                        name.value + "|" +
                        date.value + "|" + 
                        description.value + "|" +
                        priority.value + ","
                    );


                }
            }
            name.value = "";
            description.value = "";
            priority.value = "";

            DOMController.renderTasks(projects);
        });
        
    }

    static initAddNewProjectListeners(projects) {
        addNewProjectBtn.addEventListener("click", () => {
            addNewProjectMenu.style.opacity = "100%";
            addNewProjectMenu.style.pointerEvents = "auto";

            // makes sure the task menu is closed
            addNewTaskMenu.style.opacity = "0%";
            addNewTaskMenu.style.pointerEvents = "none";
        });

        cancelNewProjectBtn.addEventListener("click", () => {
            addNewProjectMenu.style.opacity = "0%";
            addNewProjectMenu.style.pointerEvents = "none";
        });

        submitNewProjectBtn.addEventListener("click", () => {
            let name = document.querySelector("#project-name-input");
            let color = document.querySelector("#project-color-input");
            console.log(color.value);

            projects.push(new Project(name.value, color.value, []));

            // project storage
            localStorage.setItem("projects", 
                localStorage.getItem("projects") + name.value + "|" + color.value + ","
            );
            localStorage.setItem(name.value, "");


            name.value = "";

            addNewProjectMenu.style.opacity = "0%";
            addNewProjectMenu.style.pointerEvents = "none";
            DOMController.renderProjects(projects);
            DOMController.renderTasks(projects);
        });


    }

    static renderProjects(projects) {

        if (projects.length === 0) {
            currentProjectName.innerHTML = "No Projects";
            currentProjectName.style.color = "black";
        }

        // clears all projects
        let projectItemsToRemove = Array.from(document.querySelectorAll(".project-item"));
        projectItemsToRemove.forEach(item => item.remove());

        if (projects.length === 0) {
            return;
        }

        for (let project of projects) {
            let projectItem = document.createElement("div");
            projectItem.classList.add("project-item");

            let projectColor = document.createElement("div");
            projectColor.classList.add("project-color");
            projectColor.style.backgroundColor = project.color;

            let projectName = document.createElement("div");
            projectName.classList.add("project-name");
            projectName.innerHTML = project.name;

            projectItem.appendChild(projectColor);
            projectItem.appendChild(projectName);

            // add as first child so it is above "add new project"
            projectContainer.insertBefore(projectItem, addNewProject);
        }

        let activeProject;
        if (projects.find(project => project.active === true) !== undefined) {
            activeProject = projects.find(project => project.active === true);
        } else {
            activeProject = projects[0];
        }
        Array.from(document.querySelectorAll(".project-item")).forEach(item => {
            if (item.children[1].innerHTML === activeProject.name) {
                item.classList.add("active-project");
                item.style.backgroundColor = activeProject.color;
            }
        });

        DOMController.initProjectListeners(projects);
    }

    static updateTaskStorage(project) {
        localStorage.setItem(project.name, "");
        for (let t of project.tasks) {
            localStorage.setItem(project.name, 
                localStorage.getItem(project.name) +
                    t.name + "|" +
                    t.dateString + "|" + 
                    t.description + "|" +
                    t.priority + ","
                );
        }

    }

    static updateProjectStorage(projects) {
        localStorage.setItem("projects", "");
        for (let project of projects) {
            localStorage.setItem("projects",
                localStorage.getItem("projects") + 
                project.name + "|" +
                project.color + ","
            );
        }
    }

    /**
     * Finds the active project and renders all tasks it contains
     * @param {*} projects array of all projects in the application
     */
    static renderTasks(projects) {
        if (projects.length === 0) {
            return;
        }
        // finds the active project. If there isnt one, projects[0] is chosen 
        let activeProject;
        if (projects.find(project => project.active === true) !== undefined) {
            activeProject = projects.find(project => project.active === true);

        } else {
            activeProject = projects[0];

            projects[0].active = true;
            projectItems = Array.from(document.querySelectorAll(".project-item"));
            projectItems[0].classList.add("active-project");
            projectItems[0].style.backgroundColor = activeProject.color;
            currentProjectName.style.color = activeProject.color;
        }

        currentProjectName.innerHTML = activeProject.name;

        // clears all the tasks
        let taskItemsToRemove = Array.from(document.querySelectorAll(".task-item"));
        taskItemsToRemove.forEach(item => item.remove());

        let tasks = activeProject.tasks;
        
        for (let task of tasks) {
            let taskItem = document.createElement("div");
            taskItem.classList.add("task-item");

            let taskStatus = document.createElement("div");
            taskStatus.classList.add("task-status");

            //
            taskStatus.addEventListener("click", () => {
                if (event.currentTarget.parentElement.classList.contains("completed")) {
                    event.currentTarget.parentElement.classList.remove("completed");
                    task.isComplete = false;
                    activeProject.addTask(task);

                    DOMController.updateTaskStorage(activeProject);
                } else {
                    event.currentTarget.parentElement.classList.add("completed");
                    task.isComplete = true;
                    activeProject.removeTask(task);

                    DOMController.updateTaskStorage(activeProject);

                }

            });

            let taskInfo = document.createElement("div");
            taskInfo.classList.add("task-info");

            let taskName = document.createElement("div");
            taskName.classList.add("task-name");
            taskName.innerHTML = task.name;

            let taskDueDate = document.createElement("div");
            taskDueDate.classList.add("task-due-date");
            taskDueDate.innerHTML = "Due " + format(task.date, "MM/dd") + " ("
                                    + formatDistanceToNowStrict(task.date, {addSuffix: true}) + ")";
            taskDueDate.style.color = task.project.color;

            let taskPriority = document.createElement("div");
            taskPriority.classList.add("task-priority");
            taskPriority.style.backgroundColor = PRIORITY_COLORS[task.priority - 1];

            taskInfo.appendChild(taskName);
            
            if (task.description !== "") {
                let taskDescription = document.createElement("div");
                taskDescription.classList.add("task-description");
                taskDescription.innerHTML = task.description;
                taskInfo.appendChild(taskDescription);
            }

            taskInfo.appendChild(taskDueDate);

            taskItem.appendChild(taskStatus);
            taskItem.appendChild(taskInfo);
            taskItem.appendChild(taskPriority);

            taskContainer.prepend(taskItem);
        }
    
    }
}