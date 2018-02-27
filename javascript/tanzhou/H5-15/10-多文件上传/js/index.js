
// input file文件上传控件
var aInput = document.getElementsByTagName('input');
// 图片列表
var oUl = document.getElementById('ul1');
// 拖拽区域
var oDrag = document.getElementById('drag');
// 上传按钮
var oBtn = document.getElementById('btn');
// 文件数组
var arr = [];
// 文件大小
var aSize = [];
// 文件名称
var aTitle = [];
    for( var i=0;i<aInput.length;i++ ){
        aInput[i].onchange = function () {
            //console.log(this.value);
            //console.log(this.files.item(2));
            var This = this;
            if( this.files.length ){
                for( var i=0;i<this.files.length;i++ ){
                    (function (i) {// 用了闭包 里面的this指向window，在外面定义 This
                        // 每个文件的详细信息，push到数组
                        var files = This.files.item(i);
                        //console.log(files)

                        arr.push(files);

                        // 文件名称
                        var oName = files.name;
                        // 文件大小
                        var oSize = files.size;

                        aTitle.push(oName);
                        aSize.push(oSize);

                        readerFile(files);

                        //setTimeout('conut()',200)
                    })(i);
                }
            }
        }
    }

    // 生成文件
    function readerFile(files) {
        // 创建读取文件的对象
        //console.log( files );

        var obj = new FileReader();
        // 文件文件
        obj.readAsDataURL(files);

        obj.addEventListener('load',function () {
            //console.log( this.result )
            var oLi = document.createElement('li');
            oLi.innerHTML = '<img src="'+this.result+'" width="100%" height="100%" alt=""><p></p>';
            oUl.appendChild(oLi);
            // =等p标签生成后 ，再去获取p元素
            conut();
        });

    }


    // 监听拖拽文件
    oDrag.ondragenter = function () {
        this.innerHTML = '请释放鼠标';
    }

    oDrag.ondragover = function (e) {
        var e = e || event;
        e.preventDefault();
        e.stopPropagation();
    }

    oDrag.ondragleave = function (e) {
        this.innerHTML = '请将图片拖到此区域';
    }

    oDrag.ondrop = function (e) {
        var e = e || event;

        for ( var i=0;i<e.dataTransfer.files.length;i++ ){
                //console.log( e.dataTransfer.files.item(i) )
                //console.log( e.dataTransfer.files[i] );
                // 每个文件的详细信息，push到数组
            (function (i) {
                var files = e.dataTransfer.files.item(i);
                //console.log(files);
                arr.push(files);

                // 文件名称
                var oName = files.name;
                // 文件大小
                var oSize = files.size;

                aTitle.push(oName);
                aSize.push(oSize);

                readerFile(files);
            })(i);
        }
        e.preventDefault();
        e.stopPropagation();
    }

    // 统计 图片大小 图片名称 图片个数
    // 上面的每循环一次，就统计一次
    function conut() {
        var oPicLen = document.getElementById('picLen');
        var oPicSize = document.getElementById('picSize');
        var aP = oUl.getElementsByTagName('p');
        console.log( aSize,aTitle );
        oPicLen.innerHTML = aTitle.length;
        if ( !aTitle[0] ){
            oPicSize.innerHTML = 0;
        }else{
            oPicSize.innerHTML = (eval(aSize.join('+'))/1024/1024).toFixed(2);
        }

        //console.log( eval(aSize.join('+')) )
        console.log( aP.length )
        for ( var i=0;i<aP.length;i++ ){
            console.log(aTitle[i] )
            aP[i].innerHTML = aTitle[i]+'<i></i>';
        };
        slide();
    }

    //  删除li 重新计算图片个数 图片大小
    function slide() {
        var aLi = oUl.getElementsByTagName('li');
        var n = 0;
        //console.log(  aLi[0].children[1].children[0] );
        for ( var i=0;i<aLi.length;i++ ){
            aLi[i].index = i;
            aLi[i].children[1].children[0].onclick = function () {
                //console.log( this.parentNode.parentNode.index );
                n = this.parentNode.parentNode.index;
                oUl.removeChild(aLi[n]);

                aTitle.splice(n,1);
                aSize.splice(n,1);
                conut();
                for ( var i=0;i<aLi.length;i++ ){
                    aLi[i].index = i;
                }
            }
        }
    }

    // 点击上传多文件
    oBtn.addEventListener('click',function () {
        console.log( arr );
        for ( var i=0;i<arr.length;i++ ){
            //console.log( arr[i] );
            (function (i) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    oDrag.innerHTML = '恭喜你上传成功';
                }
                xhr.open('post','upload.php',true);
                var oFormData = new  FormData();
                oFormData.append('file',arr[i]);
                xhr.send(oFormData);
            })(i);
        };
    });

















