const Employee = [
    {
        message: "What is this employee's name?",
        type: "input",
        name: "name"
    },
    {
        message: "What is this employee's ID number?",
        type: "input",
        name: "id"
    },
    {
        message: "What is this employee's email?",
        type: "input",
        name: "email"
    }
]

const Engineer = [...Employee, {
    message: "What is the employee's Github username?",
    type: "input",
    name: "github"
}]

const Intern = [...Employee, {
    message: "What is the employee's school?",
    type: "input",
    name: "school"
}]

module.exports.Engineer = Engineer;
module.exports.Intern = Intern;