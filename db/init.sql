SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE DATABASE IF NOT EXISTS quizsalad;
USE AppointmentShareSite;

CREATE TABLE  IF NOT EXISTS user (
    id                      VARCHAR(36) PRIMARY KEY NOT NULL,
    username                TEXT NOT NULL,
    password                TEXT, 
    email                   VARCHAR(255) unique NOT NULL,
    image                   TEXT
);

CREATE TABLE  IF NOT EXISTS token (
    id                      VARCHAR(36) NOT NULL,
    token                   VARCHAR(400) UNIQUE NOT NULL,
    FOREIGN KEY uuid(id) REFERENCES user(id) on delete cascade on update cascade
);

CREATE TABLE  IF NOT EXISTS calendar (
    id                      VARCHAR(36) primary key NOT NULL,
    start                   VARCHAR(40) NOT NULL,
    end                     VARCHAR(40) NOT NULL,
    title                   VARCHAR(500) NOT NULL,
    location                TEXT,
    description             TEXT,
    userId                  VARCHAR(36) NOT NULL,
    FOREIGN KEY uuid(userId) REFERENCES user(id) on delete cascade on update cascade
);