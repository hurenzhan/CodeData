<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/11/16
 * Time: 22:44:13
 */
    move_uploaded_file($_FILES['file']['tmp_name'],'upload/'.$_FILES['file']['name']);
?>