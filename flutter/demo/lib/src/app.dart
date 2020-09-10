import 'package:demo/src/add/add.dart';
import 'package:demo/src/home/home.dart';
import 'package:demo/src/profile/profile.dart';
import 'package:demo/src/providers/current_page.dart';
import 'package:demo/src/widgets/app_bottom_navigation_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class App extends StatefulWidget {
  @override
  _AppState createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'demo',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
            primaryColor: Colors.black,
            accentColor: Colors.black87,
            appBarTheme: AppBarTheme(
                elevation: 0.0,
                color: Colors.white,
                brightness: Brightness.light,
                textTheme: TextTheme(
                    title: TextStyle(
                        color: Colors.black,
                        fontSize: 20.0,
                        fontWeight: FontWeight.w500)))),
        home: ChangeNotifierProvider<CurrentPage>(
            builder: (context) => CurrentPage(),
            child: Scaffold(
              body: Consumer<CurrentPage>(
                builder: (context, currentPage, child) => IndexedStack(
                  index: currentPage.index,
                  children: <Widget>[Home(), Add(), Profile()],
                ),
              ),
              bottomNavigationBar: AppBottomNavigationBar(),
            )));
  }
}
