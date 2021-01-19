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
                    viewManager();

                    break;
            }
        })
}


// function to add an employee to the database

function addEmployee() {
    //view the department 
    var departmentArray = [];
    connection.query("SELECT * FROM employee_role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departmentArray.push(res[i].title)
        }

        //view current managers
        var managerArray = [];

        connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name.concat(" " + res[i].last_name))
            }

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
                        name: "manager",
                        message: "choose your employees manager",
                        choices: managerArray
                    },
                    {
                        type: "list",
                        name: "department",
                        message: "choose your employees department",
                        choices: departmentArray
                    }
                ])
                .then(function (data) {
                    var role = departmentArray.indexOf(data.department) + 1;
                    var manager = managerArray.indexOf(data.manager) + 1;
                    console.log(role);
                    console.log(manager);
                    connection.query('INSERT INTO employee SET ?',
                        [
                            {
                                first_name: data.first_name,
                                last_name: data.last_name,
                                role_id: role,
                                manager_id: manager
                            }])
                    console.table(data);
                    runSearch();
                })
        }
        )
    })
}






// add a role to the database
function addRole() {
    var idArray = [];
    connection.query('SELECT  * FROM department', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            idArray.push(res[i].name)
        }
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
                },
                {
                    type: "list",
                    name: "id",
                    message: "what department does the role belong to? ",
                    choices: idArray
                }
            ])
            .then(function (data) {
                var newId = idArray.indexOf(data.id) + 1
                console.table(newId)
                connection.query('INSERT INTO employee_role SET ?',
                    {
                        title: data.title,
                        salary: data.salary,
                        department_id: newId
                    }),
                    console.table(data);
                runSearch();
            })
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
        console.table(res);
        runSearch();
    })
};

function viewManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
};

function updateEmployee() {
    let empArray = [];
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            empArray.push(res[i].last_name)
        }
        let empRoleArray = [];
        connection.query("SELECT title FROM employee_role", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                empRoleArray.push(res[i].title)
            }
            inquirer.prompt(

                [

                    {
                        type: "list",
                        name: "empName",
                        message: "choose employee to update",
                        choices: empArray
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'choose your employees new role',
                        choices: empRoleArray
                    }
                ])
                .then(function (data) {
                    var role = empRoleArray.indexOf(data.newRole) + 1
                    connection.query('UPDATE employee SET ? WHERE ?',
                        [
                            {
                                role_id: role
                            },
                            {
                                last_name: data.empName

                            }
                        ]
                        , function (err) {
                            if (err) throw err
                            console.table(data)
                            runSearch();
                        })
                }
                )
        })
    })
}



