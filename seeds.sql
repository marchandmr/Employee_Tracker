 USE employee_db;
 
 -- departments--
INSERT INTO department (name)
VALUES ("ware house");

INSERT INTO department (name)
VALUES ("maintenance");

INSERT INTO department (name)
VALUES ("IT");

INSERT INTO department (name)
VALUES ("Call center");

 -- role--


INSERT INTO employee_role (title, salary, department_id)
VALUES ("warehouse tech", 40000, 1);

INSERT INTO employee_role (title, salary, department_id)
VALUES ("janitor", 40000, 2);

INSERT INTO employee_role (title, salary, department_id)
VALUES ("developer", 75000, 3);

INSERT INTO employee_role (title, salary, department_id)
VALUES ("customer support", 40000, 4);

 -- employee--

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("stacy", "Mcstacy", 4, 1);

 -- manager--

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("kevin", "McKev", 4, null);