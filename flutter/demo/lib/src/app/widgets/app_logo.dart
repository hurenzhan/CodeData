import 'package:flutter/material.dart';

class AppLogo extends StatelessWidget {
  AppLogo({
    this.type,
  });

  final LogoType type;

  @override
  Widget build(BuildContext context) {
    print(type.index);
    final logoType = type.index == 0 ? 'scan2' : 'market3';

    return Padding(
      padding: EdgeInsets.all(64.0),
      child: Image.asset('assets/images/icon_$logoType.png'),
    );
  }
}

enum LogoType { dark, light }
