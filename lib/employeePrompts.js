const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const validateNumber = (input) => {return /\d+/.test(input)||"Please enter a number";};

const Employee = [
    {
        message: "What is this employee's name?",
        type: "input",
        name: "name"
    },
    {
        message: "What is this employee's ID number?",
        type: "input",
        name: "id",
        validate: validateNumber
    },
    {
        message: "What is this employee's email?",
        type: "input",
        name: "email",
        validate: async function(input){
            return emailRegex.test(input);
        }
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
module.exports.emailRegex = emailRegex;
module.exports.validateNumber = validateNumber;