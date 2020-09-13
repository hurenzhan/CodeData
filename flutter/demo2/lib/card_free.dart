import 'package:demo2/base_cared.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// 免费听书
class CardFree extends BaseCard {
  @override
  BaseCardState createState() => _CardFreeState();
}

const BOOK_LIST = [
  {
    'title': '书籍1',
    'cover':
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
    'price': '998'
  },
  {
    'title': '书籍2',
    'cover':
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
    'price': '998'
  },
  {
    'title': '书籍3',
    'cover':
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
    'price': '998'
  },
  {
    'title': '书籍4',
    'cover':
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
    'price': '998'
  },
  {
    'title': '书籍5',
    'cover':
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
    'price': '998'
  },
  {
    'title': '书籍6',
    'cover':
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
    'price': '998'
  },
];

class _CardFreeState extends BaseCardState {
  @override
  topTitle(String title) {
    return super.topTitle('免费听书馆');
  }

  @override
  Widget subTitle(String title) {
    return super.subTitle('第 108 期');
  }

  @override
  Widget topTitleInfo(String title) {
    return Padding(
      padding: EdgeInsets.only(bottom: 5),
      child: Text(
        ' / 第19期',
        style: TextStyle(fontSize: 10),
      ),
    );
  }

  @override
  bottomContent() {
    return Expanded(
        child: Container(
            margin: EdgeInsets.only(top: 20),
            child: Column(
              children: <Widget>[
                Expanded(child: _bookList()),
                Padding(
                  padding: EdgeInsets.only(bottom: 20),
                  child: _bottomButtom(),
                )
              ],
            )));
  }

  _bookList() {
    return GridView.count(
        crossAxisCount: 3,
        mainAxisSpacing: 10,
        crossAxisSpacing: 15,
        childAspectRatio: 0.46,
        padding: EdgeInsets.only(left: 20, right: 20),
        children: BOOK_LIST.map((item) {
          return _item(item);
        }).toList());
  }

  _bottomButtom() {
    return FractionallySizedBox(
      widthFactor: 1,
      child: Padding(
        padding: const EdgeInsets.only(left: 20, right: 20),
        child: RaisedButton(
          onPressed: () {},
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          padding: EdgeInsets.only(top: 13, bottom: 15),
          color: Colors.blue,
          child: Text(
            '免费领取',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }

  Widget _item(Map<String, String> item) {
    return Container(
      child: Column(
        children: <Widget>[
          // 绝对布局
          Stack(
            alignment: AlignmentDirectional.center,
            children: <Widget>[
              Image.network(
                '${item['cover']}',
                fit: BoxFit.cover,
              ),
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.black38),
                child: Icon(
                  Icons.play_arrow,
                  color: Colors.white,
                ),
              ),
              Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    padding: EdgeInsets.all(3),
                    decoration: BoxDecoration(color: Colors.black),
                    child: Text('原价${item['price']}',
                        style: TextStyle(color: Colors.white, fontSize: 10)),
                  ))
            ],
          ),
          Padding(
            padding: EdgeInsets.only(top: 10),
            child: Text(
              item['title'],
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          )
        ],
      ),
    );
  }
}
