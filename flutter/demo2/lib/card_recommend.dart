import 'package:demo2/base_cared.dart';
import 'package:flutter/cupertino.dart';

// 本周推荐
class CardRecommend extends BaseCard {
  @override
  BaseCardState createState() => _CardRecommendState();
}

class _CardRecommendState extends BaseCardState {
  @override
  void initState() {
    subTitleColor = Color(0xffb99444);
    super.initState();
  }

  @override
  topTitle(String title) {
    return super.topTitle('本周推荐');
  }

  @override
  Widget subTitle(String title) {
    return super.subTitle('送你一天无限卡 全场书籍免费读');
  }

  @override
  bottomContent() {
    return Expanded(
        child: Container(
      constraints: BoxConstraints.expand(),
      margin: EdgeInsets.only(top: 20),
      child: Image.network(
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3464142916,229554071&fm=26&gp=0.jpg',
        fit: BoxFit.cover, // 宽高充满容器
      ),
    ));
  }
}
