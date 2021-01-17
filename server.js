var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Holland17",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

// prompt that asks users what they would like to do
function runSearch() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add department",
                "Add role",
                "Add Employee",
                "View department",
                "View roles",
                "View Employee",
                "view managers",
                "Update Employee"
            ]
        }).then(function (data) {
            switch (data.choice) {
                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View department":
                    viewDepartments();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "View Employee":
                    viewAllEmployees();
                    break;

                case "Update Employee":
                    updateEmployee();

                    break;

                case "view managers":
                    viewManagers();

                    break;
            }
        })
}


// function to add an employee to the database

function addEmployee() {

    inquirer.prompt(

        [
            {
                type: "input",
                name: "first_name",
                message: "what is the employees first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "what is the employees last name?"
            },
            {
                type: "list",
                name: "department",
                message: "choose your employees department",
                choices: viewDepartment()
            },
            {
                type: "list",
                name: "manager",
                message: "choose your employees manager",
                choices: viewManager()
            }
        ])
        .then(function (data) {
            var role = viewDepartment().indexOf(data.department + 1)
            var manager = viewManager().indexOf(data.manager + 1)
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role_id: role,
                    manager_id: manager
                })
            console.table(data);
            runSearch();
        })
};



// add a role to the database
function addRole() {

    inquirer.prompt(

        [
            {
                type: "input",
                name: "title",
                message: "what is the role title?"
            },
            {
                type: "input",
                name: "salary",
                message: "what is the roles salary?"
            }
        ])
        .then(function (data) {
            connection.query('INSERT INTO employee_role SET ?',
                {
                    title: data.title,
                    salary: data.salary
                })
            console.table(data);
            runSearch();
        })
};


// add a department to the database

function addDepartment() {
    inquirer.prompt(

        [
            {
                type: "input",
                name: "name",
                message: "what is the departments name?"
            },
        ])
        .then(function (data) {
            connection.query('INSERT INTO department SET ?',
                {
                    name: data.name
                })
            console.table(data);
            runSearch();
        })
};
//view the department 
var departmentArray = [];
function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            departmentArray.push(res[i].name)
        }

    })

    return departmentArray;

};

//view current managers
var managerArray = [];
function viewManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name.concat(" " + res[i].last_name))
        }

    })
    return managerArray;


};
function viewAllEmployees() {
    connection.query(" SELECT employee.id,employee.first_name, employee.last_name,employee_role.title, employee_role.salary,department.name FROM employee INNER JOIN employee_role on employee_role.id = employee.role_id inner join department ON employee_role.department_id = department.id", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        runSearch();
    })


};

function viewDepartments() {
    connection.query("SELECT department.name FROM department", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        runSearch();
    })


};

function viewRoles() {
    connection.query("SELECT employee_role.title, employee_role.salary FROM employee_role", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        runSearch();
    })


};


function viewManagers() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name.concat(" " + res[i].last_name))
        }
        console.table(res);

    })


};

function updateEmployee() {
    inquirer.prompt(

        [

            {
                type: "list",
                name: "empRole",
                message: "choose employee to update",
                choices: viewEmp()
            }
        ])
        .then(function (data) {
            connection.query('INSERT INTO department SET ?',
                {
                    name: data.name
                })
            console.table(data);
            runSearch();
        })
};

const empArray = [];
function viewEmp() {

    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            empArray.push(res[i].first_name.concat(" " + res[i].last_name))
        }


        return empArray;
    })


};




