drop database if exists bamazon;
create database bamazon;
use bamazon;
create table products(
    item_id int not null auto_increment,
    product_name varchar(255) not null,
    department_name varchar(255) not null,
    item_cost decimal(5,2) not null,
    item_quantity int not null,
    primary key(item_id)

);