drop database if exists  kissatietokanta;
create database  kissatietokanta;
use  kissatietokanta;
create table kissa (
    numero integer primary key not null,
    nimi varchar(18) not null,
    pituus integer not null,
    painoKg integer not null,
    rotu varchar(15) not null
);
drop user if exists 'keijo'@'localhost';
create user if not exists 'keijo'@'localhost' identified by 'p1aWJSXO';
grant all privileges on  kissatietokanta.* to 'keijo'@'localhost';