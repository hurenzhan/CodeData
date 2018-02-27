// 切换场景
function Swipe(container) {
  //获取第一个子节点
  var element = container.find(":first");

  //滑动对象
  var swipe = {};

  //li页面数量
  var slides = element.find("li");

  //获取容器尺寸
  var width = container.width();
  var height = container.height();

  //设置li页面总宽度
  element.css({
    width: (slides.length * width) + 'px',
    height: height + 'px'
  });

  //设置每一个页面li的宽度
  $.each(slides, function(index) {
    var slide = slides.eq(index); //获取到每一个li元素
    slide.css({
      width: width + 'px',
      height: height + 'px'
    });
  });

  //监控完成与移动
  swipe.scrollTo = function(x, speed) {
    //执行动画移动
    element.css({
      'transform': 'translate3d(-' + x + 'px,0px,0px)',
      'transition': 'transform linear ' + speed + 'ms'
    });
    return this;
  };
  return swipe;
}

var container = $("#content");
var swipe = Swipe(container);
visualWidth = container.width();
visualHeight = container.height();

// 撒花
function snowflake() {
  var snowflakeURl = [
    'http://img.mukewang.com/55adde120001d34e00410041.png',
    'http://img.mukewang.com/55adde2a0001a91d00410041.png',
    'http://img.mukewang.com/55adde5500013b2500400041.png',
    'http://img.mukewang.com/55adde62000161c100410041.png',
    'http://img.mukewang.com/55adde7f0001433000410041.png',
    'http://img.mukewang.com/55addee7000117b500400041.png'
  ];
  // 雪花容器
  var $flakeContainer = $('#snowflake');

  // 随机六张图
  function getImagesName() {
    return snowflakeURl[[Math.floor(Math.random() * 6)]];
  }
  // 创建一个雪花元素
  function createSnowBox() {
    var url = getImagesName();
    return $('<div class="snowbox" />').css({
      'width': 41,
      'height': 41,
      'position': 'absolute',
      'backgroundSize': 'cover',
      'zIndex': 100000,
      'top': '-41px',
      'backgroundImage': 'url(' + url + ')'
    }).addClass('snowRoll');
  }
  // 开始飘花
  setInterval(function() {
    // 运动的轨迹
    var startPositionLeft = Math.random() * visualWidth - 100,
      startOpacity = 1,
      endPositionTop = visualHeight - 40,
      endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
      duration = visualHeight * 10 + Math.random() * 5000;

    // 随机透明度，不小于0.5
    var randomStart = Math.random();
    randomStart = randomStart < 0.5 ? startOpacity : randomStart;

    // 创建一个雪花
    var $flake = createSnowBox();

    // 设计起点位置
    $flake.css({
      left: startPositionLeft,
      opacity: randomStart
    });

    // 加入到容器
    $flakeContainer.append($flake);

    // 开始执行动画
    $flake.transition({
      top: endPositionTop,
      left: endPositionLeft,
      opacity: 0.7
    }, duration, 'ease-out', function() {
      $(this).remove(); //结束后删除
    });

  }, 200);
}


// 太阳和云飘动
function sunAndCloud() {
  $(".cloud:first").addClass('cloud1Anim');
  $(".cloud:last").addClass('cloud2Anim');
  $("#sun").addClass('rotation');
}

// 门动作
function doorAction(left, right, time) {
  var $door = $('.door');
  var doorLeft = $('.door-left');
  var doorRight = $('.door-right');
  var defer = $.Deferred();
  var count = 2;
  // 等待开门完成
  var complete = function() {
    if (count == 1) {
      defer.resolve();
      return;
    }
    count--;
  };
  doorLeft.transition({
    'left': left
  }, time, complete);

  doorRight.transition({
    'left': right
  }, time, complete);

  return defer;
}

// 开门
function openDoor() {
  return doorAction('-50%', '100%', 2000);
}

// 关门
function shutDoor() {
  return doorAction('0%', '50%', 2000);
}

// 灯动画 //
var lamp = {
  elem: $('.b_background'),
  bright: function() {
    this.elem.addClass('lamp-bright');
  },
  dark: function() {
    this.elem.removeClass('lamp-bright');
  }
};

//logo动画
var logo = {
  elem: $('.logo'),
  run: function() {
    this.elem.addClass('logolightSpeedIn').on(animationEnd, function() {
      $(this).addClass('logoshake').off();
    });
  }
};

var bird = {
  elem: $(".bird"),
  fly: function() {
    this.elem.addClass('birdFly');
    this.elem.transition({
      right: container.width()
    }, 15000, 'linear');
  }
};





// 音乐配置
var audioConfig = {
  enable: true, // 是否开启音乐
  playURl: 'http://www.imooc.com/upload/media/happy.wav', // 正常播放地址
  cycleURL: 'http://www.imooc.com/upload/media/circulation.wav' // 正常循环播放地址
};

// 背景音乐
function Hmlt5Audio(url, isloop) {
  var audio = new Audio(url);
  audio.autoPlay = true;
  audio.loop = isloop || false;
  audio.play();
  return {
    end: function(callback) {
      audio.addEventListener('ended', function() {
        callback();
      }, false);
    }
  };
}

// 开始播放音乐
$("button#broadcastMusic").click(function() {
  var audio1 = Hmlt5Audio(audioConfig.playURl);
  audio1.end(function() {
    Hmlt5Audio(audioConfig.cycleURL, true);
  });
});
