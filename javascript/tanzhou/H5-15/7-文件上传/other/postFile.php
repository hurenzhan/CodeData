<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/11/10
 * Time: 23:10:13
 */
    $myFile = $_FILES['file'];
    $myName = $myFile['name'];

    move_uploaded_file($myFile['tmp_name'],'../upload/'.$myName);
?>