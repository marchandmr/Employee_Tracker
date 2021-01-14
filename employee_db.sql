DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee_role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL, 
  salary DECIMAL(10,4) NULL,
  department_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
 id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES employee_role(id),
  manager_id INTEGER,
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  PRIMARY KEY (id)
);


  