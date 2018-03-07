-- noinspection SqlDialectInspectionForFile

-- noinspection SqlNoDataSourceInspectionForFile

CREATE TABLE students(
    number CHAR(9),
    name VARCHAR(20),
    age INT,
    birth DATE
);

SHOW CREATE TABLE students;

-- CRUD create read update delete

INSERT INTO students(number, name, age) VALUES('20180101','ren',18);
INSERT INTO students VALUES('20180102','hu',19,'1990-10-28');
INSERT INTO students VALUES('20180102','fa',20,'1990-10-29'),('20180102','ho',21,'1990-10-31');

SELECT number,name,age FROM  students;
SELECT * FROM students;
SELECT * FROM students WHERE number='20180102';

UPDATE students SET age=19 WHERE number='20180102';

DELETE FROM students WHERE name='ho';