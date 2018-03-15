/**
 * Created by 仁栈 on 2017/12/31.
 */
window.onload = function () {
    class musicPlayer{
        constructor(Wrap){
            this.wrap = Wrap;
            this.audio = this.wrap.getElementsByTagName("audio")[0];
            this.audio.volume = 1;
            this.tbody = this.wrap.getElementsByTagName("tbody")[0];
            this.play = this.wrap.getElementsByClassName("play")[0];
            this.plays = this.play.getElementsByClassName("play")[0];
            this.num = 0;
            this.timeArr = [];
            this.searchMusic("海阔天空",1,this);  //初始化
            this.songPlay(this);    //播放功能
        }
        searchMusic(songname,page,This){  //初始化函数
            this.tbody.innerHTML = "";
            let url = `https://route.showapi.com/213-1?keyword=${songname}&page=${page}&showapi_appid=53783&showapi_test_draft=false&showapi_timestamp=${new Date().getTime()}&showapi_sign=a73f9c7136124ee1b75d62ec0b39c661`;
            this.Ajax({     //获取数据
                type:"get",
                url:url,
                aysn:true,
                success:function (msg) {
                    let songInfo = JSON.parse(msg).showapi_res_body.pagebean,
                        list = songInfo.contentlist,
                        main = document.getElementById("main"),
                        scrollBar = main.querySelector(".block"),
                        content = main.querySelector(".content");
                    for (let key in list){      //储存歌曲信息
                        let tr = document.createElement("tr");
                        tr.index = key;
                        tr.singername = list[key].singername,
                            tr.albumpicsmall = list[key].albumpic_small,
                            tr.albumpicsbig = list[key].albumpic_big,
                            tr.songid = list[key].songid,
                            tr.songname = list[key].songname,
                            tr.m4a = list[key].m4a,
                            tr.albumname = list[key].albumname;
                        tr.innerHTML = `<td>${This.FM(key*1+1)}</td><td>${tr.songname}</td><td>${tr.singername}</td><td>${tr.albumname}</td>`;
                        This.tbody.appendChild(tr);
                    };
                    if(songInfo.currentPage===1){
                        This.tbody.allPages = songInfo.allPages;
                    };
                    This.scrollBar(scrollBar,content,main)    //右侧滚动条滑动功能
                    This.tbody.songname = songname;
                    This.tbody.currentPage = songInfo.currentPage;
                },
                error:function (msg) {
                    console.log("错误代码："+msg)
                }
            })
        }
        songPlay(This){     //播放器功能函数
            let sidebarFooter = This.wrap.querySelectorAll("#container .sidebarFooter")[0],
                smallImg = sidebarFooter.getElementsByTagName("img")[0],
                smallImgL = This.wrap.getElementsByClassName("imgL")[0],
                singname = sidebarFooter.getElementsByClassName("singname")[0],
                singername = sidebarFooter.getElementsByClassName("singername")[0];
            (function () {  //点击列表播放函数
                This.tbody.addEventListener("dblclick",function (event) {
                    let e = event || window.event,
                        target = e.target || e.srcElement;
                    if(/td/ig.test(target.nodeName) && target.parentNode){
                        const tr = target.parentNode;
                        This.audio.setAttribute("src",tr.m4a);
                        This.audio.play();
                        This.play.getElementsByClassName("play")[0].className = "zanting play";
                        This.audio.showTime = tr.index;
                        audioData(This,tr);
                    }
                })
            })();
            (function () {  //播放按钮
                const player = This.plays,
                    prev = This.play.getElementsByClassName("prev")[0],
                    next = This.play.getElementsByClassName("next")[0];
                player.onclick = function () {  //播放
                    let playerClassName = this.className;
                    if (/bofang/ig.test(playerClassName)){
                        This.audio.play();
                        this.className = "zanting play";
                    }else {
                        This.audio.pause();
                        this.className = "bofang play";
                    }
                };
                prev.onclick = function () {    //上一首
                    player.className = "zanting play";
                    let showTime = This.audio.showTime*1 - 1,
                        tr = This.tbody.children;
                    showTime = showTime === -1?tr.length-1:showTime;
                    let thisTr = tr[showTime];
                    This.audio.setAttribute("src",thisTr.m4a);
                    This.audio.play();
                    This.audio.showTime = showTime;
                    audioData(This,thisTr);
                };
                next.onclick = function () {    //上一首
                    player.className = "zanting play";
                    let showTime = This.audio.showTime*1 + 1,
                        tr = This.tbody.children;
                    showTime = showTime === tr.length?0:showTime;
                    let thisTr = tr[showTime];
                    This.audio.setAttribute("src",thisTr.m4a);
                    This.audio.play();
                    This.audio.showTime = showTime;
                    audioData(This,thisTr);
                };
                (function () {  //歌曲信息加载函数
                    This.audio.onloadstart = function () {
                        smallImg.setAttribute("src",this.smallImg);
                        smallImgL.setAttribute("src",this.smallImgL);
                        singname.innerHTML = this.singname;
                        singername.innerHTML = this.singername;
                        This.getLyric(This.audio.songid,This);
                        This.num = 0;
                        let lyricList = This.wrap.querySelector(".lyricBody ul");
                        lyricList.style.top = 0;
                    }
                })();
                (function () {  //翻页
                    let nextPage = This.wrap.querySelector(".pageBody .nextPage"),
                        prevPage = This.wrap.querySelector(".pageBody .prevPage"),
                        firstPage = This.wrap.querySelector(".pageBody .firstPage"),
                        lastPage = This.wrap.querySelector(".pageBody .lastPage");
                    nextPage.onclick = function () {  //下一页
                        if(This.tbody.currentPage===This.tbody.allPages) return;
                        This.searchMusic(This.tbody.songname,This.tbody.currentPage+1,This);
                    }
                    prevPage.onclick = function () {  //下一页
                        if(This.tbody.currentPage===1) return;
                        This.searchMusic(This.tbody.songname,This.tbody.currentPage-1,This);
                    }
                    firstPage.onclick = function () {  //首页
                        if(This.tbody.currentPage===1) return;
                        This.searchMusic(This.tbody.songname,1,This);
                    }
                    lastPage.onclick = function () {  //尾页
                        if(This.tbody.currentPage===This.tbody.allPages) return;
                        This.searchMusic(This.tbody.songname,This.tbody.allPages,This);
                    }
                })();
                (function () {  //音量控制
                    const volumeBar = This.wrap.querySelector(".volume .bar");
                    volumeBar.onmousedown = function (e) {
                        let firstDown = e.clientX,
                            max = this.parentNode.offsetWidth,
                            left = this.offsetLeft,
                            redWidth = this.parentNode.getElementsByClassName("red")[0].offsetWidth;
                        document.onmousemove = function (e) {
                            let nowX = e.clientX - firstDown + left;
                            nowX = Math.max(volumeBar.offsetWidth/2,nowX);
                            nowX = Math.min(max,nowX);
                            redWidth = nowX;
                            volumeBar.parentNode.getElementsByClassName("red")[0].parentNode.getElementsByClassName("red")[0].style.width = `${nowX}px`;
                            volumeBar.style.left = `${nowX-volumeBar.offsetWidth/2}px`;
                            This.audio.volume = redWidth/max;
                        };
                        document.onmouseup = function () {
                            this.onmousemove = null;
                            this.onmouseup = null;
                        }
                    }
                })();
                (function () {  //下载
                    const download = This.wrap.querySelector(".infoFooter .download");
                    download.onclick = function () {
                        let aDowm = document.createElement("a");
                        this.setAttribute("href",This.audio.src);
                        this.download = "0";
                    }
                })();
                (function () {
                    This.audio.addEventListener("timeupdate",Synchronize);
                })();
            })();
            function Synchronize() {    //歌词滚动
                This.synchronize();
                let lyricUl = This.wrap.querySelector(".lyricBody ul"),
                    lyricLi = lyricUl.getElementsByTagName("li");
                if (This.audio.currentTime > This.timeArr[This.num]*1){
                    This.num++;
                    for (let i=0;i<lyricLi.length;i++){
                        if (i < This.num){
                            lyricLi[i].style.color = "#666";
                        }else if(i === This.num) {
                            if (This.num > 4 && This.num < lyricLi.length-5){
                                lyricUl.style.top = -(i-4)*27 + "px";
                            }
                            lyricLi[i].style.color = "#f60";
                        }
                    }
                }
            };
            function audioData(obj,Tr){    //播放按钮属性存储
                obj.audio.smallImg = Tr.albumpicsmall;
                obj.audio.smallImgL = Tr.albumpicsbig;
                obj.audio.singname = Tr.songname;
                obj.audio.singername = Tr.singername;
                obj.audio.songid = Tr.songid;
            };
            (function () {  //进度条拖动
                const btnBat = This.play.querySelector(".bar");
                btnBat.onmousedown = function (e) {
                    This.audio.removeEventListener("timeupdate",Synchronize);
                    let firstDown = e.clientX,
                        max = this.parentNode.offsetWidth + btnBat.offsetWidth/2,
                        left = this.offsetLeft,
                        redWidth = this.parentNode.getElementsByClassName("red")[0].offsetWidth;
                    document.onmousemove = function (e) {
                        let nowX = e.clientX - firstDown + left;
                        nowX = Math.max(btnBat.offsetWidth/2,nowX);
                        nowX = Math.min(max,nowX);
                        redWidth = nowX;
                        btnBat.parentNode.getElementsByClassName("red")[0].style.width = `${nowX}px`
                        btnBat.style.left = `${nowX-btnBat.offsetWidth/2}px`
                    };
                    document.onmouseup = function () {
                        This.audio.currentTime = redWidth/max * Math.floor(This.audio.duration);
                        This.audio.addEventListener("timeupdate",Synchronize);
                        this.onmousemove = null;
                        this.onmouseup = null;
                    }
                }
            })();
            (function () {  //歌词层
                const zuixiaohua = This.wrap.getElementsByClassName("contentDetails")[0],
                    containerList = This.wrap.getElementsByClassName("containerList")[0],
                    contentDetails = This.wrap.getElementsByClassName("contentDetails")[0],
                    searchSong = This.wrap.querySelector("#header .search");
                sidebarFooter.onclick = layer;
                zuixiaohua.onclick = closeLayer;
                function layer() {  //打开
                    containerList.style.opacity = 0;
                    containerList.style.zIndex = 3;
                    contentDetails.style.opacity = 1;
                    contentDetails.style.zIndex = 3;
                };
                function closeLayer() {     //关闭
                    contentDetails.style.opacity = 0;
                    contentDetails.style.zIndex = 0;
                    containerList.style.opacity = 1;
                    containerList.style.zIndex = 3;
                };
                (function search() {   //搜索歌曲
                    searchSong.onkeyup = function (e) {
                        if(e.keyCode !== 13) return
                        let val = this.value;
                        if (val){
                            This.tbody.songname = val;
                            This.searchMusic(val,1,This);
                            closeLayer();
                        }
                    }
                })();
            })()
        }
        getLyric(songid,This){  //请求歌词
            let lyricList = this.wrap.querySelector(".lyricBody ul"),
                FMlyric = this.wrap.getElementsByClassName("FMlyric")[0],
                url = `https://route.showapi.com/213-2?musicid=${songid}&showapi_appid=53783&showapi_test_draft=false&showapi_timestamp=${new Date().getTime()}&showapi_sign=a73f9c7136124ee1b75d62ec0b39c661`;
            lyricList.innerHTML = "";
            this.Ajax({     //获取数据
                type:"get",
                url:url,
                aysn:true,
                success:function (msg) {
                    FMlyric.innerHTML = JSON.parse(msg).showapi_res_body.lyric;
                    FMlyric.innerHTML.replace(/\[([\d:.]+)\](.+)/g,function (a,str1,srt2) {
                        let lyric = document.createElement("li");
                        lyric.time = str1;
                        lyric.innerHTML = srt2;
                        lyricList.appendChild(lyric);
                    });
                    (function () {
                        let lyricLi = lyricList.children;
                        for (let i=0;i<lyricLi.length;i++){
                            This.timeArr[i] = lyricLi[i].time.replace(/(\d{2}):(\d\d).(\d\d)/g,function (a,str1,srt2) {
                                return str1*60 + srt2*1
                            })
                        }
                    })();
                },
                error:function (msg) {
                    console.log("错误代码："+msg)
                }
            })
        }
        synchronize() {  //同步进度条
            let control = this.play.querySelector(".control"),
                progressBar = control.querySelector(".progressBar"),
                totalTime = this.audio.duration,
                currentTime = this.audio.currentTime,
                progressBarRedX = Math.floor(currentTime)/Math.floor(totalTime)*progressBar.offsetWidth;
            progressBar.getElementsByClassName("red")[0].style.width = `${progressBarRedX}px`;
            progressBar.getElementsByClassName("bar")[0].style.left = `${progressBarRedX - progressBar.getElementsByClassName("bar")[0].offsetWidth/2}px`;
            let time = `${this.FM(Math.floor(currentTime/60))}:${this.FM(Math.floor(currentTime%60))}`;
            control.querySelector(".time").innerHTML = time;
        }
        scrollBar(scrollbar,content,main){      //右侧滚动条函数
            main.onmousewheel = null && main.removeEventListener("DOMMouseScroll");
            let scrollbarParentHeight = scrollbar.offsetParent.offsetHeight;
            scrollbar.style.height = main.offsetHeight / content.offsetHeight * scrollbarParentHeight + "px";
            let scrollMax = scrollbarParentHeight - scrollbar.offsetHeight,
                contentMax = content.offsetHeight - main.offsetHeight;
            mousewheel(main,function (e,roll) {
                let top = scrollbar.offsetTop;
                e.preventDefault();
                top = roll>0?top-=30:top+=30;
                top = Math.max(0,top);
                top = Math.min(top,scrollMax);
                scrollbar.style.top = top + "px"
                content.style.top = -top/scrollMax*contentMax + "px";
                return false;
            });
            function mousewheel(obj,Fn) {
                function eFn(e) {
                    e = e || window.event;
                    if(Fn.call(this,e,e.wheelDelta/120 || -e.detail/3)===false){
                        !-[1,]?e.returnValue = false:e.preventDefault();
                    }
                }
                document.onmousewheel === null?obj.onmousewheel = eFn:obj.addEventListener("DOMMouseScroll",eFn);
            }
        }    //右侧滚动条函数
        Ajax(obj) {     //ajax函数
            let type = obj.type || "GET",
                url = obj.url,
                aysn = obj.aysn !== false,
                data = obj.data,
                success = obj.success,
                error = obj.error;
            if (data) {
                data = (function () {
                    var str = "";
                    for (var key in data) {
                        str += `key=${data[key]}&`
                    }
                    return str;
                })()
            }
            if (/get/i.test(type)) {
                url += (data || "");
                var xhr = new XMLHttpRequest();
                xhr.open(type, url, aysn)
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(data || null)
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                            success && success(xhr.responseText)
                        } else {
                            error && error(xhr.status)
                        }
                    }
                }
            }
        }   //ajax函数
        FM(n) {return n<10?"0"+n:n+""};  //格式化时间函数
    }
    const Wrap = document.getElementById("wrap");
    new musicPlayer(Wrap)
}
