import 'package:demo2/base_cared.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// 长安十二时辰
class CardSpecial extends BaseCard {
  @override
  BaseCardState createState() => _CardSpecialState();
}

class _CardSpecialState extends BaseCardState {
  @override
  void initState() {
    bottomTitleColor = Colors.blue;
    super.initState();
  }

  @override
  topContent() {
    return Column(
      children: <Widget>[
        Container(
          padding: EdgeInsets.only(left: 66, right: 66, top: 36, bottom: 30),
          decoration: BoxDecoration(color: Color(0xfffffcf7)),
          child: Container(
            decoration: BoxDecoration(boxShadow: [
              BoxShadow(
                  color: Colors.grey, blurRadius: 20, offset: Offset(0, 10))
            ]),
            child: Image.network(
                'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg'),
          ),
        ),
        Container(
          padding: EdgeInsets.only(left: 20, top: 15, bottom: 15, right: 20),
          decoration: BoxDecoration(color: Color(0xfff7f3ea)),
          child: Row(
            children: <Widget>[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    '长安十二时辰...',
                    style: TextStyle(fontSize: 18, color: Color(0xff473b25)),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 5),
                    child: Text(
                      '马伯庸',
                      style: TextStyle(fontSize: 13, color: Color(0xff7d725c)),
                    ),
                  )
                ],
              ),
              Container(
                margin: EdgeInsets.only(left: 20),
                padding:
                    EdgeInsets.only(left: 10, right: 10, top: 5, bottom: 5),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                        colors: [Color(0xffd9bc82), Color(0xffecd9ae)])),
                child: Text(
                  '分享免费领',
                  style: TextStyle(
                    color: Color(0xff4f3b1a),
                    fontSize: 13,
                  ),
                ),
              )
            ],
          ),
        )
      ],
    );
  }

  @override
  bottomContent() {
    return Expanded(
        child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: <Widget>[
        Padding(
          padding: EdgeInsets.only(left: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Image.network(
                'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
                height: 26,
                width: 26,
              ),
              Text('揭露历史真相')
            ],
          ),
        ),
        bottomTitle('更多免费好书领不停 >')
      ],
    ));
  }
}
