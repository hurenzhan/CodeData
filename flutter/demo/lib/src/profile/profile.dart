import 'package:demo/src/login/login.dart';
import 'package:demo/src/signup/signup.dart';
import 'package:flutter/material.dart';

class Profile extends StatefulWidget {
  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
        centerTitle: true,
        elevation: 0.0,
      ),
      body: Signup(),
      // body: Login(),
    );
  }
}
