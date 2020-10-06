const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const employeePrompts = require("./lib/employeePrompts");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

const employees = [];

// TODO: Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

inquirer.prompt([
    {
        message: "What is the name of this team's manager?",
        type: "input",
        name: "managerName"
    },
    {
        message: "What is the ID number of this team's manager?",
        type: "input",
        name: "managerID"
    },
    {
        message: "What is the email of this team's manager?",
        type: "input",
        name: "managerEmail"
    },
    {
        message: "What is the office number of this team's manager?",
        type: "input",
        name: "managerOffice"
    },
    {
        message: "How many employees are part of this manager's team?",
        type: "input",
        name: "employeeCount"
    }
]).then(async (answers)=>{
    employees.push(new Manager(answers.managerName, answers.managerID, answers.managerEmail, answers.managerOffice));

    for(let i=0; i<answers.employeeCount; i++){
        console.log("\nNew Employee:");
        let role = await getRole();
        await addEmployee(role);
    }

    console.log(employees);
})

// TODO: After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// TODO: After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// TODO: build employee definition sequence for inquirer, to loop through for each added employee
async function addEmployee(role){
    await inquirer.prompt(employeePrompts[role]).then(answers=>{
        switch(role){
            case "Engineer": employees.push(new Engineer(answers.name, answers.id, answers.email, answers.github)); break;
            case "Intern": employees.push(new Intern(answers.name, answers.id, answers.email, answers.school)); break;
            default: throw new Error("Unknown role selected!");
        }
    }).catch(err=>{
        console.error(err);
    });
}

async function getRole(){
    let role = "";
    await inquirer.prompt([
        {
            message: "What role does this employee fill?",
            type: "list",
            choices: ["Engineer", "Intern"],
            name: "role"
        }
    ]).then(answers=>{
        role = answers.role;
    }).catch(err=>{
        console.error(err);
    })

    return role;
}