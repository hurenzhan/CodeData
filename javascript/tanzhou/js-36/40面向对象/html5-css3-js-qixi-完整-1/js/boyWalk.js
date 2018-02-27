var instanceX;

var container = $("#content");
var swipe = Swipe(container);
visualWidth = container.width();
visualHeight = container.height();

// 获取数据
var getValue = function(className) {
  var $elem = $('' + className + '');
  // 走路的路线坐标
  return {
    height: $elem.height(),
    top: $elem.position().top
  };
};

// 桥的Y轴
var bridgeY = function() {
  var data = getValue('.c_background_middle');
  return data.top;
}();

// 动画结束事件
var animationEnd = (function() {
  var explorer = navigator.userAgent;
  if (~explorer.indexOf('WebKit')) {
    return 'webkitAnimationEnd';
  }
  return 'animationend';
})();

// 男孩走路
function BoyWalk() {
  // 路的Y轴
  var pathY = function() {
    var data = getValue('.a_background_middle');
    return data.top + data.height / 2;
  }();

  var $boy = $("#boy");
  var boyWidth = $boy.width();
  var boyHeight = $boy.height();

  // 设置下高度
  $boy.css({
    top: pathY - boyHeight + 25
  });

  // 暂停走路
  function pauseWalk() {
    $boy.addClass('pauseWalk');
  }

  // 恢复走路
  function restoreWalk() {
    $boy.removeClass('pauseWalk');
  }

  // css3的动作变化
  function slowWalk() {
    $boy.addClass('slowWalk');
  }

  // 用transition做运动
  function stratRun(options, runTime) {
    var dfdPlay = $.Deferred();
    // 恢复走路
    restoreWalk();
    // 运动的属性
    $boy.transition(
      options,
      runTime,
      'linear',
      function() {
        dfdPlay.resolve(); // 动画完成
      });
    return dfdPlay;
  }

  // 开始走路
  function walkRun(time, dist, disY) {
    time = time || 3000;
    // 脚动作
    slowWalk();
    // 开始走路
    var d1 = stratRun({
      'left': dist + 'px',
      'top': disY ? disY : undefined
    }, time);
    return d1;
  }


  // 走进商店
  function walkToShop(runTime) {
    var defer = $.Deferred();
    var doorObj = $('.door');
    // 门的坐标
    var offsetDoor = doorObj.offset();
    var doorOffsetLeft = offsetDoor.left;
    // 小孩当前的坐标
    var offsetBoy = $boy.offset();
    var boyOffetLeft = offsetBoy.left;

    // 当前需要移动的坐标
    instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);

    // 开始走路
    var walkPlay = stratRun({
      transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
      opacity: 0.1
    }, 2000);
    // 走路完毕
    walkPlay.done(function() {
      $boy.css({
        opacity: 0
      });
      defer.resolve();
    });
    return defer;
  }

  // 走出店
  function walkOutShop(runTime) {
    var defer = $.Deferred();
    restoreWalk();
    // 开始走路
    var walkPlay = stratRun({
      transform: 'translateX(' + instanceX + 'px),translateY(0),,scale(1,1)',
      opacity: 1
    }, runTime);
    // 走路完毕
    walkPlay.done(function() {
      defer.resolve();
    });
    return defer;
  }


  // 取花
  function talkFlower() {
    // 增加延时等待效果
    var defer = $.Deferred();
    setTimeout(function() {
      // 取花
      $boy.addClass('slowFlolerWalk');
      defer.resolve();
    }, 1000);
    return defer;
  }

  // 计算移动距离
  function calculateDist(direction, proportion) {
    return (direction == "x" ?
      visualWidth : visualHeight) * proportion;
  }

  return {
    // 开始走路
    walkTo: function(time, proportionX, proportionY) {
      var distX = calculateDist('x', proportionX);
      var distY = calculateDist('y', proportionY);
      return walkRun(time, distX, distY);
    },
    // 走进商店
    toShop: function() {
      return walkToShop.apply(null, arguments);
    },
    // 走出商店
    outShop: function() {
      return walkOutShop.apply(null, arguments);
    },
    // 停止走路
    stopWalk: function() {
      pauseWalk();
    },
    setColoer: function(value) {
      $boy.css('background-color', value);
    },
    // 转身动作
    rotate: function(callback) {
      restoreWalk();
      $boy.addClass('boy-rotate');
      // 监听转身完毕
      if (callback) {
        $boy.on(animationEnd, function() {
          callback();
          $(this).off();
        });
      }
    },
    // 取花
    talkFlower: function() {
      return talkFlower();
    },
    // 获取男孩的宽度
    getWidth: function() {
      return $boy.width();
    },
    // 复位初始状态
    resetOriginal: function() {
      this.stopWalk();
      // 恢复图片
      $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
    },
    setFlolerWalk: function() {
      $boy.addClass('slowFlolerWalk');
    }
  };
}

var boy = BoyWalk();

// stage1
function stage1() {
  var defer = $.Deferred();
  sunAndCloud();
  boy.walkTo(2500, 0.5).then(function() {
    defer.resolve();
  }); //步行时间5000ms*4, 步行距离visualWidth * 1
  setTimeout(function() {
    //画面长度为2， 总时间为5000ms*4
    swipe.scrollTo(visualWidth * 1, 5000);
  }, 2500);
  return defer;
}


// stage2
function stage2() {
  var defer = $.Deferred();
  boy.walkTo(5000, 0.533).then(function() {
    // 暂停走路
    boy.stopWalk();
  }).then(function() {
    // 开门
    return openDoor();
  }).then(function() {
    // 开灯
    lamp.bright();
  }).then(function() {
    // 进商店
    return boy.toShop(2000);
  }).then(function() {
    // 飞鸟
    bird.fly();
  }).then(function() {
    // 取花
    return boy.talkFlower();
  }).then(function() {
    // 出商店
    return boy.outShop(2000);
  }).then(function() {
    // 关门
    setTimeout(function() {
      boy.walkTo(2000, 0.7);
    }, 300);
    return shutDoor();
  }).then(function() {
    // 灯暗
    lamp.dark();
    defer.resolve();
  });
  return defer;
}

// stage3
function stage3() {
  //画面长度为2， 总时间为5000ms*4
  swipe.scrollTo(visualWidth * 2, 4000);
  // 第一次走路到桥底边left,top
  boy.walkTo(3800, 0.15)
    .then(function() {
      // 第二次走路到桥上left,top
      return boy.walkTo(1500, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
    }).then(function() {
      // 实际走路的比例
      var proportionX = (girl.getOffset().left - boy.getWidth() + girl.getWidth() / 5) / visualWidth;
      // 第三次桥上直走到小女孩面前
      return boy.walkTo(1500, proportionX);
    }).then(function() {
      // 图片还原原地停止状态
      boy.resetOriginal();
    }).then(function() {
      // 增加转身动作
      setTimeout(function() {
        girl.rotate();
        boy.rotate(function() {
          // 开始logo动画
          logo.run();
        });
      }, 1000);
    }).then(function() {
      setTimeout(function() {
        //撒花
        snowflake();
      }, 3000);
    });
}


//小女孩 //
var girl = {
  elem: $('.girl'),
  getHeight: function() {
    return this.elem.height();
  },
  // 转身动作
  rotate: function() {
    this.elem.addClass('girl-rotate');
  },
  setOffset: function() {
    this.elem.css({
      left: visualWidth / 2,
      top: bridgeY - this.getHeight()
    });
  },
  getOffset: function() {
    return this.elem.offset();
  },
  getWidth: function() {
    return this.elem.width();
  }
};
// 修正小女孩位置
girl.setOffset();
