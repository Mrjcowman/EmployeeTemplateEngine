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

const validateNumber = (input) => {return /\d+/.test(input)||"Please enter a number";};

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
        name: "managerID",
        validate: validateNumber
    },
    {
        message: "What is the email of this team's manager?",
        type: "input",
        name: "managerEmail",
        validate: function(input){
            return employeePrompts.emailRegex.test(input)||"Please enter a valid email";
        }
    },
    {
        message: "What is the office number of this team's manager?",
        type: "input",
        name: "managerOffice",
        validate: validateNumber
    },
    {
        message: "How many employees are part of this manager's team?",
        type: "input",
        name: "employeeCount",
        validate: function(input){
            let isANumber = validateNumber(input);
            if(isANumber){
                if(input>0){
                    return true;
                } else {
                    return "Please enter a number greater than 0";
                }
            } else {
                return "That's not a number!";
            }
        }
    }
]).then(async (answers)=>{
    employees.push(new Manager(answers.managerName, answers.managerID, answers.managerEmail, answers.managerOffice));

    for(let i=0; i<answers.employeeCount; i++){
        console.log("\nNew Employee:");
        let role = await getRole();
        await addEmployee(role);
    }

    let html = render(employees);

    await fs.readdir("output/", err=>{
        if(err) fs.mkdirSync("output/");
    })

    fs.writeFile("output/team.html", html, "utf8", (err)=>{
        if(err) throw err;
    })

})

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


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