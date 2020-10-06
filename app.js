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

const team = [];



// Prompt for info about the manager and the team size
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
        validate: employeePrompts.validateNumber
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
        validate: employeePrompts.validateNumber
    },
    {
        message: "How many employees are part of this manager's team?",
        type: "input",
        name: "employeeCount",
        validate: function(input){
            let isANumber = employeePrompts.validateNumber(input);
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
    // Add the manager to the team array
    team.push(new Manager(answers.managerName, answers.managerID, answers.managerEmail, answers.managerOffice));

    // For each employee, prompt for info and add to the team array
    for(let i=0; i<answers.employeeCount; i++){
        console.log("\nNew Employee:");
        let role = await getRole();
        await addEmployee(role);
    }

    // Render the HTML page with the team info
    let html = render(team);

    // Create the output folder if it doesn't already exist
    await fs.readdir("output/", err=>{
        if(err) fs.mkdirSync("output/");
    })

    // Write the html file to the output folder
    fs.writeFile("output/team.html", html, "utf8", (err)=>{
        if(err) throw err;
    })

})


// Prompt for info about an employee of the given role, then push it onto the team array
async function addEmployee(role){
    await inquirer.prompt(employeePrompts[role]).then(answers=>{
        switch(role){
            case "Engineer": team.push(new Engineer(answers.name, answers.id, answers.email, answers.github)); break;
            case "Intern": team.push(new Intern(answers.name, answers.id, answers.email, answers.school)); break;
            default: throw new Error("Unknown role selected!");
        }
    }).catch(err=>{
        console.error(err);
    });
}

// Prompt for the employee role and return it
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