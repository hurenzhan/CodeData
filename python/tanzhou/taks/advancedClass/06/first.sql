
CREATE TABLE students (
  number CHAR(9),   # 学号
  name VARCHAR(20),  # 姓名
  age INT,   # 年龄
  birth DATE   # 生日
);
INSERT INTO students VALUES ('201804001', '刘一', 16, '2002-01-01');
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
/*
+-----------+--------+------+------------+
| number    | name   | age  | birth      |
+-----------+--------+------+------------+
| 201804001 | 刘一   |   16 | 2002-01-01 |
| 201804001 | 陈二   |   17 | 2001-01-02 |
| 201804001 | 张三   |   18 | 2000-01-03 |
| 201804002 | 李四   |   19 | 2001-01-04 |
| 201804001 | 王五   |   20 | 2000-01-05 |
| 201804001 | 赵六   |   21 | 1999-01-06 |
| 201804001 | 孙七   |   22 | 1999-01-07 |
| 201804001 | 周八   |   23 | 1999-01-08 |
| 201804001 | 吴九   |   24 | 1999-01-09 |
| 201804001 | 郑十   |   25 | 1999-01-10 |
+-----------+--------+------+------------+
10 rows in set
*/


CREATE TABLE subjects (   # 科目
  number CHAR(4),   # 科目号
  title VARCHAR(30),
  duration INT  # 课时时长（单位：小时）
);
INSERT INTO subjects VALUES ('0001', 'Python基础', 32);
INSERT INTO subjects VALUES ('0002', 'Python进阶', 16);
INSERT INTO subjects VALUES ('0003', 'Web前端', 16);
INSERT INTO subjects VALUES ('0004', 'Python框架', 32);
INSERT INTO subjects VALUES ('0005', 'Python项目', 32);
select * from subjects;
/*
+--------+--------------+----------+
| number | title        | duration |
+--------+--------------+----------+
| 0001   | Python基础   |       32 |
| 0002   | Python进阶   |       16 |
| 0001   | Web前端      |       16 |
| 0001   | Python框架   |       32 |
| 0001   | Python项目   |       32 |
+--------+--------------+----------+
5 rows in set
*/


CREATE TABLE grades (    # 成绩表
  student_number CHAR(9),    # 学生号
  subject_number CHAR(4),    # 科目号
  grade INT    # 成绩
);
INSERT INTO grades VALUES ('201804001', '0001', 90);
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



# 张三的学号
SELECT number FROM students WHERE name='张三';
# 张三的成绩
SELECT subject_number, grade FROM grades
    WHERE student_number=( SELECT number FROM students WHERE name='张三' );
# 查询结果也是表
SELECT subject_number FROM ( SELECT subject_number, grade FROM grades
                                     WHERE student_number=( SELECT number FROM students
                                         WHERE name='张三' ) ) AS a;


# 测试连接
CREATE TABLE a (
  va INT
);
INSERT INTO a VALUES (1),(2),(3);
SELECT * FROM a;
/*
+------+
| va   |
+------+
|    1 |
|    2 |
|    3 |
+------+
3 rows in set
*/


CREATE TABLE b (
  vb CHAR(1)
);
INSERT INTO b VALUES ('a'),('b');
/*
+------+
| vb   |
+------+
| a    |
| b    |
+------+
2 rows in set
*/


SELECT * FROM ( a JOIN b );
/*
+------+------+
| va   | vb   |
+------+------+
|    1 | a    |
|    1 | b    |
|    2 | a    |
|    2 | b    |
|    3 | a    |
|    3 | b    |
+------+------+
6 rows in set
*/


SELECT subject_number, grade
    FROM ( students JOIN grades ON students.number=grades.student_number )
    WHERE name='张三';
/*
+----------------+-------+
| subject_number | grade |
+----------------+-------+
| 0001           |    88 |
| 0002           |    78 |
+----------------+-------+
2 rows in set (0.00 sec)
*/
SELECT name, title, grade
    FROM ( students JOIN grades
                   ON students.number=grades.student_number
               JOIN subjects
                   ON grades.subject_number=subjects.number);
/*
+--------+--------------+-------+
| name   | title        | grade |
+--------+--------------+-------+
| 刘一   | Python基础   |    90 |
| 刘一   | Python进阶   |    80 |
| 陈二   | Python基础   |    89 |
| 陈二   | Python进阶   |    79 |
| 张三   | Python基础   |    88 |
| 张三   | Python进阶   |    78 |
| 李四   | Python基础   |    87 |
| 李四   | Python进阶   |    77 |
| 王五   | Python基础   |    86 |
| 王五   | Python进阶   |    76 |
| 赵六   | Python基础   |    85 |
| 赵六   | Python进阶   |    75 |
| 孙七   | Python基础   |    84 |
| 孙七   | Python进阶   |    74 |
| 周八   | Python基础   |    83 |
| 周八   | Python进阶   |    73 |
| 吴九   | Python基础   |    82 |
| 吴九   | Python进阶   |    72 |
| 郑十   | Python基础   |    81 |
| 郑十   | Python进阶   |    71 |
+--------+--------------+-------+
20 rows in set (0.01 sec)
*/


# 默认约束
CREATE TABLE t_default (
  default_value INT
);

INSERT INTO t_default VALUES ();
SELECT * FROM t_default;
/*
+---------------+
| default_value |
+---------------+
|          NULL |
+---------------+
1 row in set
*/
DROP TABLE t_default;    # 删除这张表
CREATE TABLE t_default (
  default_value INT DEFAULT 10
);
INSERT INTO t_default VALUES ();
SELECT * FROM t_default;
/*
+---------------+
| default_value |
+---------------+
|            10 |
+---------------+
1 row in set
*/

# 非空约束
CREATE TABLE t_notnull (
  notnull_value INT NOT NULL
);
INSERT INTO t_notnull VALUES ();
/*
ERROR 1364 (HY000): Field 'notnull_value' doesn't have a default value
*/
INSERT INTO t_notnull VALUES (1);
SELECT * FROM t_notnull;
/*
+---------------+
| notnull_value |
+---------------+
|             1 |
+---------------+
1 row in set
*/

CREATE TABLE t_unique (
  unique_value INT
);
INSERT INTO t_unique VALUE (1);
INSERT INTO t_unique VALUE (1);
SELECT * FROM t_unique;
/*
+--------------+
| unique_value |
+--------------+
|            1 |
|            1 |
+--------------+
2 rows in set
*/
DROP TABLE t_unique;
CREATE TABLE t_unique (
  unique_value INT,
  other_value INT,
  UNIQUE KEY (unique_value)
);
INSERT INTO t_unique VALUE (1, 2);
INSERT INTO t_unique VALUE (2, 2);
SELECT * FROM t_unique;
/*
+--------------+-------------+
| unique_value | other_value |
+--------------+-------------+
|            1 |           2 |
|            2 |           2 |
+--------------+-------------+
2 rows in set
*/
INSERT INTO t_unique VALUE (1, 3);
/*
ERROR 1062 (23000): Duplicate entry '1' for key 'unique_value'
*/

# 主键约束
CREATE TABLE t_primarykey (
  primarykey_value INT,
  PRIMARY KEY (primarykey_value)
);
SHOW CREATE TABLE t_primarykey\G
/*
       Table: t_primarykey
Create Table: CREATE TABLE `t_primarykey` (
  `primarykey_value` int(11) NOT NULL,
  PRIMARY KEY (`primarykey_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
1 row in set
*/
INSERT INTO t_primarykey VALUES (1);
SELECT * FROM t_primarykey;
/*
+------------------+
| primarykey_value |
+------------------+
|                1 |
+------------------+
1 row in set
*/
INSERT INTO t_primarykey VALUES (1);
/*
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
*/

# 外键
CREATE TABLE c (
  c_col INT,
  PRIMARY KEY (c_col)
);
CREATE TABLE d (
  d_col INT,
  FOREIGN KEY (d_col) REFERENCES c(c_col)
);
INSERT INTO c VALUES (1), (2);
INSERT INTO d VALUES (1);
INSERT INTO d VALUES (3);
/*
ERROR 1452 (23000): Cannot add or update a child row:
a foreign key constraint fails (`python3`.`d`, CONSTRAINT `d_ibfk_1` FOREIGN KEY (`d_col`) REFERENCES `c` (`c_col`))
*/
INSERT INTO d VALUES (2);
INSERT INTO d VALUES (2);
SELECT * FROM d;
/*
+-------+
| d_col |
+-------+
|     1 |
|     2 |
|     2 |
+-------+
3 rows in set
*/

# 自增长
CREATE TABLE t_auto (
  auto_value INT AUTO_INCREMENT,
  PRIMARY KEY (auto_value)
);
INSERT INTO t_auto VALUES ();
INSERT INTO t_auto VALUES ();
INSERT INTO t_auto VALUES ();
/*
+------------+
| auto_value |
+------------+
|          1 |
|          2 |
|          3 |
+------------+
3 rows in set
*/