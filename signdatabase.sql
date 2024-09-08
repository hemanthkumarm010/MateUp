create database signin;
use signin;

create table if not exists usersign
(
 user_name varchar(100),
 user_mail varchar(200),
 user_mon int not null primary key
 );
use signin;
alter TABLE usersign
ADD user_gender varchar(255);
ALTER TABLE usersign
ADD user_sem varchar(255);
select * from usersign;
alter table usersign
modify user_mon bigint;
ALTER TABLE usersign
ADD  username varchar(255);
ALTER TABLE usersign
ADD user_password varchar(255);
alter TABLE usersign
drop column user_gender;
select * from usersign;

create table if not exists room
(
 u_name varchar(100),
 u_age int,
 u_gender varchar(100),
 college_name varchar(200),
 sem int,
 room_type varchar(20),
 no_of_roomates int,
 rent int,
 locality varchar(100),
 address varchar(500),
 mobile bigint,
 u_email varchar(200));
 select * from room;
 alter TABLE room
ADD looking_for varchar(255);
 ALTER TABLE room ADD COLUMN username VARCHAR(255);
ALTER TABLE room ADD COLUMN posted_on DATETIME DEFAULT CURRENT_TIMESTAMP;

 
 
 
 

