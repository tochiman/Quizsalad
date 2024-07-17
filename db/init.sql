SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE DATABASE IF NOT EXISTS Quizsalad;
USE Quizsalad;

CREATE TABLE  IF NOT EXISTS user (
    userId              VARCHAR(36) PRIMARY KEY NOT NULL,
    username            TEXT NOT NULL,
    passPhrase          TEXT
);

CREATE TABLE  IF NOT EXISTS token (
    id                  VARCHAR(36) NOT NULL,
    token               VARCHAR(400) UNIQUE NOT NULL,
    FOREIGN KEY uuid(id) REFERENCES user(userId) on delete cascade on update cascade
);

CREATE TABLE IF NOT EXISTS questionSet (
    userId              VARCHAR(36) NOT NULL,
    questionSetId       VARCHAR(10) PRIMARY KEY NOT NULL,
    questionSetTitle    TEXT NOT NULL,
    description         TEXT,
    FOREIGN KEY uuid(userId) REFERENCES user(userId) on delete cascade on update cascade
);

CREATE TABLE IF NOT EXISTS questions (
    questionSetId       VARCHAR(10) NOT NULL,
    questionId          VARCHAR(10) PRIMARY KEY NOT NULL,
    questionTitle       TEXT NOT NULL,
    answerOptionA       TEXT NOT NULL,
    answerOptionB       TEXT NOT NULL,
    answerOptionC       TEXT NOT NULL,
    answerOptionD       TEXT NOT NULL,
    correctAnswer       TEXT NOT NULL,
    FOREIGN KEY uuid(questionSetId) REFERENCES questionSet(questionSetId) on delete cascade on update cascade
);