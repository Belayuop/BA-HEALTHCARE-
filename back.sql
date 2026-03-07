CREATE DATABASE myhealthid;

USE myhealthid;


CREATE TABLE users (

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100),

email VARCHAR(100),

password VARCHAR(255),

role VARCHAR(50)

);



CREATE TABLE medical_records (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT,

diagnosis TEXT,

treatment TEXT,

doctor VARCHAR(100),

date DATE

);



CREATE TABLE appointments (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT,

date DATE,

status VARCHAR(50)

);



CREATE TABLE chat (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT,

message TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE wards (

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100),

capacity INT

);



INSERT INTO wards(name,capacity) VALUES
('Medical Ward',50),
('Surgical Ward',40),
('ICU',20),
('NICU',15);
