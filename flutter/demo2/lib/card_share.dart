import 'package:demo2/base_cared.dart';
import 'package:flutter/cupertino.dart';

// 分享
class CardShare extends BaseCard {
  @override
  BaseCardState createState() => _CardShareState();
}

class _CardShareState extends BaseCardState {
  @override
  topTitle(String title) {
    return super.topTitle('分享得联名卡');
  }

  @override
  Widget subTitle(String title) {
    return super.subTitle('分享给朋友最多可获得12天无限卡');
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
      decoration: BoxDecoration(color: Color(0xfff6f7f9)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          Expanded(
              child: Padding(
            padding: EdgeInsets.only(top: 20, left: 15, bottom: 20),
            child: Image.network(
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
              fit: BoxFit.cover, // 宽高充满容器
            ),
          )),
          Container(
            alignment: AlignmentDirectional.center,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: bottomTitle('996人 参与活动'),
            ),
          )
        ],
      ),
    ));
  }
}
