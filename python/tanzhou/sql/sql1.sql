/*
SQLyog Ultimate v12.3.1 (64 bit)
MySQL - 5.7.21-0ubuntu0.16.04.1 : Database - test_01
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`test_01` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `test_01`;

/*Table structure for table `hello_class` */

DROP TABLE IF EXISTS `hello_class`;

CREATE TABLE `hello_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `crt_time` date NOT NULL,
  `up_time` date NOT NULL,
  `num_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `num_id` (`num_id`),
  CONSTRAINT `hello_class_num_id_d0268a80_fk_hello_classnum_id` FOREIGN KEY (`num_id`) REFERENCES `hello_classnum` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `hello_class` */

insert  into `hello_class`(`id`,`name`,`crt_time`,`up_time`,`num_id`) values 
(3,'django框架班01','2018-03-29','2018-03-29',1),
(4,'django框架班02','2018-03-29','2018-03-29',2);

/*Table structure for table `hello_classnum` */

DROP TABLE IF EXISTS `hello_classnum`;

CREATE TABLE `hello_classnum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `num` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `hello_classnum` */

insert  into `hello_classnum`(`id`,`num`) values 
(1,'1'),
(2,'2');

/*Table structure for table `hello_student` */

DROP TABLE IF EXISTS `hello_student`;

CREATE TABLE `hello_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gender` smallint(6) NOT NULL,
  `cls_id` int(11) NOT NULL,
  `age` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hello_student_cls_id_79b9e732_fk_hello_class_id` (`cls_id`),
  CONSTRAINT `hello_student_cls_id_79b9e732_fk_hello_class_id` FOREIGN KEY (`cls_id`) REFERENCES `hello_class` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `hello_student` */

insert  into `hello_student`(`id`,`name`,`gender`,`cls_id`,`age`) values 
(1,'学生1',1,3,'20'),
(2,'学生2',0,4,'22'),
(3,'学生3',1,3,'21');

/*Table structure for table `hello_student_teacher` */

DROP TABLE IF EXISTS `hello_student_teacher`;

CREATE TABLE `hello_student_teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hello_student_teacher_student_id_teacher_id_3fafedc3_uniq` (`student_id`,`teacher_id`),
  KEY `hello_student_teacher_teacher_id_9565ecb1_fk_hello_teacher_id` (`teacher_id`),
  CONSTRAINT `hello_student_teacher_student_id_8b81cef9_fk_hello_student_id` FOREIGN KEY (`student_id`) REFERENCES `hello_student` (`id`),
  CONSTRAINT `hello_student_teacher_teacher_id_9565ecb1_fk_hello_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `hello_teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `hello_student_teacher` */

insert  into `hello_student_teacher`(`id`,`student_id`,`teacher_id`) values 
(1,1,3),
(2,1,4),
(3,2,4),
(4,2,5),
(5,3,3),
(6,3,5);

/*Table structure for table `hello_teacher` */

DROP TABLE IF EXISTS `hello_teacher`;

CREATE TABLE `hello_teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `age` varchar(200) NOT NULL,
  `gender` smallint(6) NOT NULL,
  `cls_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hello_teacher_cls_id_3a4452f4_fk_hello_class_id` (`cls_id`),
  CONSTRAINT `hello_teacher_cls_id_3a4452f4_fk_hello_class_id` FOREIGN KEY (`cls_id`) REFERENCES `hello_class` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `hello_teacher` */

insert  into `hello_teacher`(`id`,`name`,`age`,`gender`,`cls_id`) values 
(3,'kevin老师','28',1,3),
(4,'山泉老师','28',1,3),
(5,'不动老师','28',1,4);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
