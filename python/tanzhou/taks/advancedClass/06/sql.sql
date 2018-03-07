CREATE TABLE students (   #学生
  number CHAR(9) ,
  name VARCHAR(20) NOT NULL ,
  age INT NOT NULL ,
  brith DATE DEFAULT '1970-01-01' ,
  PRIMARY KEY (number)
);
SHOW CREATE TABLE students;

SHOW CREATE TABLE students;
INSERT INTO students (number, name, age) VALUES ('201804001', '刘一', 16);
INSERT INTO students VALUES ('201804002', '陈二', 17, '2001-01-02');
INSERT INTO students VALUES ('201804003', '张三', 18, '2000-01-03');
INSERT INTO students VALUES ('201804004', '李四', 19, '2001-01-04');
INSERT INTO students VALUES ('201804005', '王五', 20, '2000-01-05');
INSERT INTO students VALUES ('201804006', '赵六', 21, '1999-01-06');
INSERT INTO students VALUES ('201804007', '孙七', 22, '1999-01-07');
INSERT INTO students VALUES ('201804008', '周八', 23, '1999-01-08');
INSERT INTO students VALUES ('201804009', '吴九', 24, '1999-01-09');
INSERT INTO students VALUES ('201804010', '郑十', 25, '1999-01-10');
select * from students;

CREATE TABLE subjects (   #科目
  number CHAR(4) ,
  title VARCHAR(30) NOT NULL ,
  duration INT NOT NULL ,
  PRIMARY KEY (number)
);
SHOW CREATE TABLE subjects;
INSERT INTO subjects VALUES ('0001', 'Python基础', 32);
INSERT INTO subjects VALUES ('0002', 'Python进阶', 16);
INSERT INTO subjects VALUES ('0003', 'Web前端', 16);
INSERT INTO subjects VALUES ('0004', 'Python框架', 32);
INSERT INTO subjects VALUES ('0005', 'Python项目', 32);
select * from subjects;

CREATE TABLE grades (   #成绩
  student_number CHAR(9) NOT NULL ,
  subject_number CHAR(4) NOT NULL ,
  grade INT DEFAULT 0
);
SHOW CREATE TABLE grades;
INSERT INTO grades (student_number, subject_number) VALUE ('201804001', '0001');
INSERT INTO grades VALUES ('201804002', '0001', 89);
INSERT INTO grades VALUES ('201804003', '0001', 88);
INSERT INTO grades VALUES ('201804004', '0001', 87);
INSERT INTO grades VALUES ('201804005', '0001', 86);
INSERT INTO grades VALUES ('201804006', '0001', 85);
INSERT INTO grades VALUES ('201804007', '0001', 84);
INSERT INTO grades VALUES ('201804008', '0001', 83);
INSERT INTO grades VALUES ('201804009', '0001', 82);
INSERT INTO grades VALUES ('201804010', '0001', 81);
INSERT INTO grades VALUES ('201804001', '0002', 80);
INSERT INTO grades VALUES ('201804002', '0002', 79);
INSERT INTO grades VALUES ('201804003', '0002', 78);
INSERT INTO grades VALUES ('201804004', '0002', 77);
INSERT INTO grades VALUES ('201804005', '0002', 76);
INSERT INTO grades VALUES ('201804006', '0002', 75);
INSERT INTO grades VALUES ('201804007', '0002', 74);
INSERT INTO grades VALUES ('201804008', '0002', 73);
INSERT INTO grades VALUES ('201804009', '0002', 72);
INSERT INTO grades VALUES ('201804010', '0002', 71);
select * from grades;

#子查询
SELECT number FROM students WHERE name = '张三'

SELECT subject_number, grade FROM grades
    WHERE student_number = ( SELECT number FROM students WHERE name = '张三' );

SELECT subject_number FROM ( SELECT subject_number, grade FROM grades
                                  WHERE student_number = ( SELECT number FROM students
                                      WHERE name = '张三' ) ) AS a;

#连接查询
SELECT subject_number, grade
    FROM ( students JOIN grades ON students.number = grades.student_number )
        WHERE name = '张三';

SELECT name, title, grade
    FROM ( students JOIN grades ON students.number = grades.student_number
        JOIN subjects ON grades.subject_number = subjects.number );
