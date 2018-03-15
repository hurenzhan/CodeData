/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-tablefixed.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.stable.js (author:ZhangHuihua@msn.com, Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-tablefixed.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

//监听页面某div的resize窗口缩放事件
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);


+function ($) {
    'use strict';

    // TABLEFIXED CLASS DEFINITION
    // ======================

    var Tablefixed = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }

    /*Tablefixed.SCROLLW  = 18*/
    Tablefixed.SCROLLW  = 17

    Tablefixed.DEFAULTS = { width: '100%' }

    Tablefixed.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getLeft: function($obj) {
                var width = 0

                $obj.prevAll().each(function() {
                    width += $(this).outerWidth()
                })

                return width
            },
            getRight: function($obj) {
                var width = 0

                $obj.prevAll().andSelf().each(function() {
                    width += $(this).outerWidth()
                })

                return width - 1
            },
            getCellNum: function($obj) {
                return $obj.prevAll().andSelf().size()
            },
            getColspan: function($obj) {
                return $obj.attr('colspan') || 1
            },
            getStart: function($obj) {
                var start = 1

                $obj.prevAll().each(function() {
                    start += parseInt($(this).attr('colspan') || 1)
                })

                return start
            },
            getPageCoord: function(element) {
                var coord = {x: 0, y: 0}

                while (element) {
                    coord.x += element.offsetLeft
                    coord.y += element.offsetTop
                    element = element.offsetParent
                }

                return coord
            },
            getOffset: function($obj, e) {
                if (!$.support.leadingWhitespace) {
                    var $objset = $obj.offset()
                    var evtset = {
                        offsetX: e.pageX || e.screenX,
                        offsetY: e.pageY || e.screenY
                    }
                    var offset = {
                        offsetX: evtset.offsetX - $objset.left,
                        offsetY: evtset.offsetY - $objset.top
                    }

                    return offset
                }

                var target = e.target

                if (target.offsetLeft == undefined){
                    target = target.parentNode
                }

                var pageCoord  = this.getPageCoord(target)
                var eventCoord = {
                    x: window.pageXOffset + e.clientX,
                    y: window.pageYOffset + e.clientY
                }
                var offset = {
                    offsetX: eventCoord.x - pageCoord.x,
                    offsetY: eventCoord.y - pageCoord.y
                }

                return offset
            }
        }

        return tools
    }

    Tablefixed.prototype.resetWidth = function() {
        var $fixed = this.$element,
            width  = $fixed.width(),
            $table = $fixed.find('table'),
            tableW = $table && $table.width(),
            $ths   = $table.eq(0) && $table.eq(0).find(' thead tr.resize-head > th'),
            $tds   = $table.eq(1) && $table.eq(1).find('thead tr.resize-head > th')

        if ($table && ((width - tableW)  < Tablefixed.SCROLLW)) {
            var fixedW = parseInt((width - tableW) / $ths.length)

            $table.width(width - Tablefixed.SCROLLW)
            $ths.each(function(i) {
                var tw = parseInt($(this).css('width'))

                $(this).width(tw + fixedW)
                if ($tds.eq(i)) $tds.eq(i).width(tw + fixedW)
            })
        }
    }

    Tablefixed.prototype.init = function() {
        if (!this.$element.isTag('table')) return

        this.$container = this.$element.parent().addClass('bjui-resizeGrid')
        this.$fixed     = undefined
        var width       = this.$container.width()
        var height      = this.options.height

        if (this.$container.hasClass('tab-pane')) width = this.$container.parent().width() - 20
        if (typeof this.options.width == 'string' && this.options.width.indexOf('%')) {
            this.options.newWidth = width * (this.options.width.replace('%', '') / 100)
        } else {
            this.options.newWidth = parseInt(this.options.width)
        }

        this.options.styles = []
        this.$element.wrap('<div class="bjui-tablefixed clearfix"></div>')
        this.$fixed = this.$element.parent()
        this.initHead()
        this.initBody()
        this.resizeGrid()
        this.resetWidth()

        if (height && !this.$fixed.closest('.tab-content').length) this.$fixed.height(height).addClass('fixedH')
    }

    var fixedColsLength = 0
    var fixedColsNumber = 0
    var fixedResizeHead = ''
    var hasFixedCol = false
    var fixedHeadrowSpanMax = 1
    var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1
    var isFirefox = window.navigator.userAgent.indexOf("Firefox") !== -1

    Tablefixed.prototype.initHead = function() {
        var styles  = this.options.styles = []
        var $hTrs   = this.$element.find('thead > tr')
        var $fThs   = $hTrs.eq(0).find('> th')
        var $table  = this.$element
        var fixedW  = 0
        var hTh     = []
        var cols    = []
        var jj      = -1

        $fThs.each(function(i) {
            var $th     = $(this),
                colspan = parseInt($th.attr('colspan') || 1),
                width   = $th.attr('width'),
                className = $th.attr('class'),
                align   = $th.attr('align'),
                w       = '',
                c       = ''

            for (var k = 0; k < colspan; k++) {
                if (colspan == 1 && width) w = ' width="'+ width +'"'
                if (align) $th.removeAttr('align').addClass(align)
                if(className) c = ' class="'+ className +'"'
                hTh.push('<th'+ w + c +'></th>')
            }
            $th.attr('colsNum', jj += colspan)
            cols[i] = colspan
        })

        var thLen = hTh.length,
            $hTh  = $('<tr class="resize-head">'+ hTh.join('') +'</tr>')

        if ($hTrs.length > 1) {
            jj = 0
            var $ths2 = $hTrs.eq(1).find('> th')
            $.each(cols, function(i, n) {
                n = parseInt(n)
                if (n > 1) {
                    var colsNum = parseInt($fThs.eq(i).attr('colsnum'))
                    for (var k = n - 1; k >= 0; k--) {
                        var $th  = $ths2.eq(jj++), myNum = colsNum - k, width = $th.attr('width'), align = $th.attr('align')
                        var $_th = $hTh.find('> th').eq(myNum)
                        if ($th && $th.length) $th.attr('colsnum', myNum)
                        if (width)  $_th.attr('width', width)
                        if (align)  $th.addClass(align).removeAttr('align')
                    }
                }
            })
        }

        this.$fixed.html(this.$element.html())
        var $thead  = this.$fixed.find('thead')
        $thead.prepend($hTh)
        $hTh.find('> th').each(function(i) {
            var $th   = $(this)
            var style = [], width = $th.innerWidth()
            style[0]  = parseInt(width)
            fixedW   += style[0]
            styles[styles.length] = style
        })

        fixedW = parseInt((this.options.newWidth - Tablefixed.SCROLLW - fixedW) / thLen)
        var $ths = $thead.find('> tr:eq(0) > th')
        this.options.$ths = $ths

        $ths.each(function(i) {
            var $th = $(this), style = styles[i], w = $th.attr('width')
            var tdWidth = style[0]+fixedW
            var minWidth = ''
            if(w) {
                minWidth = w
            } else {
                minWidth = '70px'
            }

            if (tdWidth < Number(minWidth.replace('px', ''))) {
                tdWidth = Number(minWidth.replace('px', ''))
            }

            $th.removeAttr('align').width(tdWidth).css({maxWidth: '400px', minWidth: minWidth})
            style[0] = (style[0] + fixedW)
            if (w) {
                style[0] = parseInt(w)
                $th.width(style[0]).removeAttr('width')
            }
        })

        $thead.find('> tr:gt(0) > th').each(function() {
            var $th = $(this)
            $th.html('<div class="fixedtableCol">'+ $th.html() +'</div>')
        })

        var fixedtableThead_width = this.options.newWidth - Tablefixed.SCROLLW
        if (isChrome) {
            fixedtableThead_width = fixedtableThead_width - 1
        }
        $thead.wrap('<div class="fixedtableHeader" style="width:100%;overflow:hidden;">' +
            '<div class="fixedtableThead">' +
            '<table class="table table-bordered" style="width:'+ fixedtableThead_width +'px;max-width:'+ fixedtableThead_width +'px;"></table>' +
            '</div>' +
            '</div>')

        /*固定列 thead cols*/
        var fixedTheadArray = ''
        var fixedResizeHeadTd = ''
        var colWidthNumber = 0
        if($.CurrentNavtab.find('.fixed-col').length !== 0) {
            hasFixedCol = true
        }
        if (hasFixedCol) {
            $hTrs.find('.fixed-col').each(function (i) {
                var w = $(this).attr('width')
                var classString = $(this)[0].className.replace('fixed-col', '')
                fixedHeadrowSpanMax = $(this)[0].rowSpan
                var colWidth = ''
                fixedColsNumber = i + 1
                if (w) {
                    colWidth = ' width="' + w + '"'
                    fixedColsLength += parseInt(w)
                    colWidthNumber++
                } else {
                    colWidth = ' width="120px"'
                }
                fixedTheadArray += '<th class="' + classString + '" style="height: ' + fixedHeadrowSpanMax * 22 + 'px!important;">' + $(this).html() + '</th>'
                fixedResizeHeadTd += '<th' + colWidth + '></th>'
            })

            if (fixedResizeHeadTd !== '') {
                fixedColsLength += 120 * (fixedColsNumber - colWidthNumber)
                fixedResizeHead = '<tr class="resize-head">' + fixedResizeHeadTd + '</tr>'
                if (typeof fixedTheadArray !== 'undefined') {
                    this.$fixed.append('<div class="fixedtableThead-col1" style="z-index:4;top:0px;width:' + fixedColsLength + 'px;"></div>')
                    this.$fixed.find('.fixedtableThead-col1').append('<table class="table table-bordered table-striped table-top addedFixedHeaderTable"><thead>' + fixedResizeHead + '</thead><tbody><tr>' + fixedTheadArray + '</tr></tbody></table>')
                    if (isFirefox) {
                        this.$fixed.find('.fixedtableThead').css('padding-left', '' + (fixedColsLength + 1) + 'px')
                    } else {
                        this.$fixed.find('.fixedtableThead').css('padding-left', '' + fixedColsLength + 'px')
                    }
                }
            }
        }

        this.$fixed.append('<div class="resizeMarker" style="display:none; height:300px; left:57px;"></div><div class="resizeProxy" style="left:377px; display:none; height:300px;"></div>')
    }

    Tablefixed.prototype.initBody = function() {
        var that = this
        var $tbody = this.$fixed.find('> tbody')
        var styles = this.options.styles
        var style, height

        if (this.options.height) {
            height = (this.options.height - this.$fixed.find('.fixedtableHeader').height()) + 'px'
        } else {
            height = '100%'
            var resizeH = function () {
                var _height = that.$fixed.parent().height()

                that.$fixed.parent().css('overflow', 'hidden')
                that.$fixed.height(_height)
                    .find('.fixedtableScroller').height(_height - that.$fixed.find('.fixedtableHeader').height())
            }
            $(document).one(BJUI.eventType.afterInitUI, function (e) {
                resizeH()
            })
        }

        style = 'style="height:' + height + '; overflow-y:auto;"'
        var theadHeight = this.$fixed.find('.fixedtableHeader').height()
        $tbody.wrap('<div id="fixedtableScroller" class="fixedtableScroller"' + style + ' style="z-index:6;width:' + (this.options.newWidth - Tablefixed.SCROLLW) + 'px;">' +
            '<div class="fixedtableTbody" style="width:100%;max-width:' + (this.options.newWidth - Tablefixed.SCROLLW) + 'px;">' +
            '<table style="width:' + (this.options.newWidth - Tablefixed.SCROLLW) + 'px; max-width:' + (this.options.newWidth - Tablefixed.SCROLLW) + 'px;"></table>' +
            '</div>' +
            '</div>')

        var tbody_null = ''
        if ($tbody.find('tr').length === 0) {
            var $thead_tr = $.CurrentNavtab.find(".fixedtableHeader table thead tr:not('.resize-head')")
            tbody_null = '<tr>'
            for (var i = 0; i < $thead_tr.children().length; i++) {
                var tdWidth = $thead_tr.find('th:eq(' + i + ')').innerWidth()
                tbody_null += '<td style="height: 0px!important;border:0px;" width="' + tdWidth + 'px"></td>'
            }
            tbody_null += '</tr>'
            $tbody.append(tbody_null)
        }

        /*固定列 thead cols*/
        /*为tbody加上thead的隐藏class*/
        var $resizeHeadTh = $.CurrentNavtab.find('.fixedtableThead thead .resize-head > th')
        var $body_trs = $.CurrentNavtab.find('.fixedtableTbody tbody > tr')
        var $head_tr = $.CurrentNavtab.find('.xszhtj .fixedtableThead thead > tr:last')
        var $head_trTh = $.CurrentNavtab.find('.xszhtj .fixedtableThead thead > tr:last > th')

        $resizeHeadTh.each(function (i) {
            var $th = $(this)

            /* 通过resize-head的class 给thead有多行的th赋class   ——销售综合统计*/
            if ($head_tr.length !== 0 && $th.attr('class') !== undefined) {
                $head_tr.find('> th:eq(' + i + ')').addClass($th.next().attr('class'))
            }
            /*为tbody加上thead的class*/
            if ($th.attr('class') !== undefined) {
                $body_trs.each(function (j) {
                    var $tr = $(this)
                    var resizeHeadThNumber = $resizeHeadTh.length
                    var tbodyTdNumber = $tr.find('> td').length
                    if (resizeHeadThNumber === tbodyTdNumber) {
                        $tr.find('> td:eq(' + i + ')').addClass($th.attr('class'))
                    } else {
                        //当前面的rowspan列为fixed-col时，除去有rowspan的,都不要加class
                    }
                })
            }
        })

        /* 给resize-head添加分项总时长的class   ——销售综合统计*/
        if ($head_trTh.length !== 0) {
            $head_trTh.each(function (i) {
                var $th = $(this)
                if ($th.attr('class').indexOf('fx-hidden-col') > -1) {
                    $resizeHeadTh.eq(i + 1).addClass('fx-hidden-col')
                }
            });
        }

        /* 给tbody赋上thead最后一行的值   ——销售综合统计*/
        $head_tr.find('th').each(function (i) {
            var $head_th = $(this)
            if ($head_tr.length !== 0 && $head_th.attr('class') !== undefined) {
                $body_trs.each(function (j) {
                    var $tr = $(this)
                    var resizeHeadThNumber = $resizeHeadTh.length
                    var tbodyTdNumber = $tr.find('> td').length
                    if (resizeHeadThNumber === tbodyTdNumber) {
                        $tr.find('> td:eq(' + i + ')').addClass($head_th.prev().attr('class'))
                    } else {
                        //当前面的rowspan列为fixed-col时，除去有rowspan的,都不要加class
                    }
                })
            }
        })

        var fixedTds = ''
        var fixedTd = ''
        var inDialog = false
        if (hasFixedCol) {
            if ($tbody.children().length !== 0) {
                if ($tbody.children().find("td").eq(0)[0].rowSpan > 1) {
                    $tbody.children().each(function (j) {
                        var colRowspan = $(this).find("td").eq(0)[0].rowSpan
                        if (colRowspan !== 1) {
                            fixedTds += '<tr><td rowspan="' + (colRowspan + 1) + '">' + $(this).find(".fixed-col").eq(0).html() + '</td></tr>'
                            for (var i = 0; i < colRowspan; i++) {
                                fixedTds += '<tr><td></td></tr>'
                            }
                        }
                    })
                } else {
                    $tbody.children().each(function (j) {
                        var data_id = $(this).attr('data-id')
                        for (var i = 0; i < fixedColsNumber; i++) {
                            if ($(this).find(".fixed-col").eq(i).html() !== undefined) {
                                var classString = $(this).find(".fixed-col").eq(i)[0].className.replace('fixed-col', '')
                                fixedTd += '<td class="'+ classString + '">' + $(this).find(".fixed-col").eq(i).html() + '</td>'
                            } else {
                                inDialog = true
                            }
                            var trStyle = $(this).find(".fixed-col").parent().attr('style')
                        }
                        fixedTds += '<tr data-id="' + data_id + '" style="' + trStyle + '">' + fixedTd + '</tr>'
                        fixedTd = ''
                    })
                }

                if (typeof fixedTds !== 'undefined' && !inDialog) {
                    this.$fixed.find('.fixedtableTbody').css('paddingLeft', '' + fixedColsLength + 'px')
                    if (tbody_null === '') {
                        var fixedtableScroller = $.CurrentNavtab.find('.fixedtableScroller')
                        this.$fixed.find('.fixedtableScroller').after('<div class="fixedtableTbody-col1" id="fixedtableTbody-col1" style="/*z-index:2;*/top:' + theadHeight + 'px;width:' + (fixedColsLength + 1) + 'px;"></div>')
                        this.$fixed.find('.fixedtableTbody-col1').append('<table class="table table-bordered table-hover table-striped table-top addedFixedContentTable"><thead>' + fixedResizeHead + '</thead><tbody>' + fixedTds + '</tbody></table>')
                        this.$fixed.find('.fixedtableTbody-col1').css('height', fixedtableScroller[0].clientHeight - 150 + 'px')
                    }
                }
            }
        }

        if (!this.$element.attr('class')) $tbody.parent().addClass('table table-striped table-bordered table-hover')
        else $tbody.parent().addClass(this.$element.attr('class'))
        if (typeof this.$element.attr('data-selected-multi') != 'undefined') $tbody.parent().attr('data-selected-multi', this.$element.attr('data-selected-multi'))

        $tbody.before('<thead><tr class="resize-head">'+ this.$fixed.find('thead > tr').html() +'</tr></thead>')
        this.options.$tds = $tbody.prev().find('> tr:first-child > th')
        if (this.options.nowrap) $tbody.parent().addClass('nowrap')

        /*浏览器窗口大小变化时*/
        $('.bjui-tablefixed').resize(function () {
            $('.fixedtableTbody-col1').css('height', $(this).height() - 39 + 'px')
        });

        /*鼠标移入事件同步*/
        $.CurrentNavtab.find("table:not('.no-hover') tbody tr").mouseover(function () {
            var data_id = $(this).index();
            var $tbody1 =  $.CurrentNavtab.find('.fixedtableTbody-col1 tbody');
            var $tbody2 =  $.CurrentNavtab.find('.fixedtableTbody tbody');
            if ($tbody1.find('tr').eq(data_id).css('backgroundColor') !== 'rgb(238, 238, 238)') {
                $tbody1.find('tr').eq(data_id).css('backgroundColor', '#f3f3f3');
               $tbody2.find('tr').eq(data_id).css('backgroundColor', '#f3f3f3');
            }
        }).mouseout(function() {
            var data_id = $(this).index();
            var $tbody1 =  $.CurrentNavtab.find('.fixedtableTbody-col1 tbody');
            var $tbody2 =  $.CurrentNavtab.find('.fixedtableTbody tbody');
            if ($tbody1.find('tr').eq(data_id).css('backgroundColor') !== 'rgb(238, 238, 238)') {
                if(data_id % 2 === 1) {
                  $tbody1.find('tr').eq(data_id).css('backgroundColor', '#fdfdfd');
                  $tbody2.find('tr').eq(data_id).css('backgroundColor', '#fdfdfd');
                } else {
                  $tbody1.find('tr').eq(data_id).css('backgroundColor', '#fff');
                  $tbody2.find('tr').eq(data_id).css('backgroundColor', '#fff');
                }
            }
        }).find("td input[type=checkbox]").change(function(event) {
            event.preventDefault();
             var data_id = $(this).parent().parent().index()
            var $tbody1 =  $.CurrentNavtab.find('.fixedtableTbody-col1 tbody')
            var $tbody2 =  $.CurrentNavtab.find('.fixedtableTbody tbody')
             if($(this).prop('checked')) {
                 $tbody1.find('tr').eq(data_id).css('backgroundColor', '#eee')
                 $tbody2.find('tr').eq(data_id).css('backgroundColor', '#eee')
            } else {
                 $tbody1.find('tr').eq(data_id).css('backgroundColor', '#fff')
                 $tbody2.find('tr').eq(data_id).css('backgroundColor', '#fff')
            }
        });


       /* 给table中的每个td加上title*/
        if($.CurrentNavtab) {
            $.CurrentNavtab.find("table tbody tr td").mouseover(function () {
                $(this).attr('title', $(this)[0].innerText)
            });
        }
        if ($.CurrentDialog) {
            $.CurrentDialog.find("table tbody tr td").mouseover(function () {
                $(this).attr('title', $(this)[0].innerText)
            });
        }

        /*表格滚动触发*/
        $tbody.closest('.fixedtableScroller').scroll(function(e) {
            var $scroller  = $.CurrentNavtab.find('.fixedtableScroller')
            var table_head = $.CurrentNavtab.find(".fixedtableTbody-col1")
            var pre_scrollTop = $scroller[0].scrollTop
            var fixedHeadHeight = fixedHeadrowSpanMax * 22 + 1
            table_head.css('top', -pre_scrollTop + fixedHeadHeight + "px")
            table_head.css('height', $scroller[0].clientHeight + pre_scrollTop + "px")

            var scrollLeft = $scroller.scrollLeft()
            var $header    = $scroller.prev().find('> .fixedtableThead')
            $header.css({ 'position':'relative', 'left':-scrollLeft })

            return false
        })

        /*获取cookie中某个字段的值*/
        function getCookie(cookieName) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for(var i = 0; i < arrCookie.length; i++){
                var arr = arrCookie[i].split("=");
                if(cookieName == arr[0]){
                    return arr[1];
                }
            }
            return "";
        }


        function setCookie(name, value) {
          // cookie的有效期是365天
          var iDay = 365;
          var oDate = new Date();
          oDate.setDate(oDate.getDate() + iDay);
          document.cookie = name + '=' + value + ';expires=' + oDate;
        }

        /*初始化时 隐藏列*/
        /*   显示、隐藏列  点击事件*/
        var $checkAllShow = $.CurrentNavtab.find('#checkAllShow')
        var checkAllShow = $.CurrentNavtab.find('#checkAllShow')[0]
        var $hiddenCol = $.CurrentNavtab.find('.hiddenCol')
        var $selectInputs = $.CurrentNavtab.find('.select-cols-wrap input')
        var selectCols_key = $.CurrentNavtab.find('.select-cols-wrap').attr('id') + '_selectedCols'
        var selectCols_val = getCookie(selectCols_key)
        var hiddenCols = []
        var selectedNum = 0
        var num = 0

        $selectInputs.each(function(i) {
            if (i!== 0) {
                hiddenCols.push($(this).attr('id'))
                if (selectCols_val.indexOf($(this).attr("id")) > -1) {
                    $(this).attr('checked', 'checked')
                    selectedNum++
                }
                if (document.cookie.indexOf(selectCols_key) === -1) {
                    /*销售综合统计*/
                    if ($(this).attr('id') !== 'fx-hidden-col') {
                        $(this).attr('checked', 'checked')
                        selectedNum++
                        selectCols_val += $(this).attr('id') + ','
                    }
                }
            }
            if (selectedNum === hiddenCols.length) {
                $checkAllShow.prop("checked", true);
            } else if (selectedNum === 0) {
                $checkAllShow.prop("checked", false);
            } else {
                checkAllShow.indeterminate = true;
            }
        })
        setCookie(selectCols_key, selectCols_val);

        for (var i = 0; i < hiddenCols.length; i++) {
            if (!$('#' + hiddenCols[i]).attr('checked')) {
                $('.' + hiddenCols[i] + '').hide()
            }
        }

        /*销售综合统计*/
        var moreColspan = Number($.CurrentNavtab.find('#dhbf').attr('colspan'));
        var lessColspan = Number((moreColspan - 3) / 3 + 3);

        if ($.CurrentNavtab.find('#xszhtj')[0] !== undefined) {
            if(selectCols_val.indexOf('fx-hidden-col') > - 1) {
                $.CurrentNavtab.find('#dhbf').attr('colspan', moreColspan)
            } else {
                $.CurrentNavtab.find('#dhbf').attr('colspan', lessColspan)
            }
        }

        $checkAllShow.change(function () {
            selectCols_val = ''
            for (var i = 0; i < hiddenCols.length; i++) {
                if ($(this).prop("checked")) {
                    $('.' + hiddenCols[i] + '').show()
                    $('#' + hiddenCols[i] + '').prop("checked", true)
                    $.CurrentNavtab.find('#dhbf').attr('colspan', moreColspan)
                    selectCols_val += hiddenCols[i] + ','
                } else {
                    $('.' + hiddenCols[i] + '').hide()
                    $('#' + hiddenCols[i] + '').prop("checked", false)
                }
            }
            setCookie(selectCols_key, selectCols_val);
        })

        $hiddenCol.change(function() {
            var colId = $(this).attr('id')
            if ($('#' + colId + '').prop("checked")) {
                $('.' + colId + '').show()
                selectCols_val += colId + ','

                /*销售综合统计*/
                if(colId === 'fx-hidden-col') {
                    $.CurrentNavtab.find('#dhbf').attr('colspan', moreColspan)
                    $.CurrentNavtab.find('#dhbf-hidden-col').prop('checked', 'checked')
                    $('.dhbf-hidden-col').show()
                    selectCols_val += 'dhbf-hidden-col' + ','
                }
                /*电话拜访*/
                if(colId === 'dhbf-hidden-col') {
                    $.CurrentNavtab.find('#fx-hidden-col').prop('checked', false)
                    $('.fx-hidden-col').hide()
                    $.CurrentNavtab.find('#dhbf').attr('colspan', lessColspan)
                }
            } else {
                $('.' + colId + '').hide()
                $checkAllShow.prop("checked", false)
                var selectedCols_array = selectCols_val.split(',')
                for(var i = 0; i < selectedCols_array.length; i++ ) {
                    if(selectedCols_array[i] === colId) {
                        selectedCols_array.splice(i, 1);
                    }
                }

                /*电话拜访*/
                if(colId === 'dhbf-hidden-col') {
                    $.CurrentNavtab.find('#fx-hidden-col').attr('checked', false)
                    for(var i = 0; i < selectedCols_array.length; i++ ) {
                        if(selectedCols_array[i] === 'fx-hidden-col') {
                            selectedCols_array.splice(i, 1);
                        }
                    }
                }
                /*销售综合统计*/
                if(colId === 'fx-hidden-col') {
                    $.CurrentNavtab.find('#dhbf').attr('colspan', lessColspan)
                }

                selectCols_val = selectedCols_array.join(',')

            }
            setCookie(selectCols_key, selectCols_val);

            $hiddenCol.each(function(i) {
                if ($(this).prop("checked")) {
                    num++
                }
            })
            if (num === 0) {
                checkAllShow.indeterminate = false;
                $checkAllShow.prop("checked", false);
            } else if (num === $hiddenCol.length) {
                checkAllShow.indeterminate = false;
                $checkAllShow.prop("checked", true);
            } else {
                checkAllShow.indeterminate = true;
            }
            num = 0
        });
        /*显隐列 end*/

        /*让所有表体中的fixed-col列不显示*/
        $.CurrentNavtab.find('.fixed-col').css('display', 'none')
        hasFixedCol = false
        fixedColsLength = 0
    }

    Tablefixed.prototype.resizeCol = function() {
        var that   = this
        var $fixed = this.$fixed
        var $ths   = this.options.$ths
        var $tds   = this.options.$tds
        var tools  = this.tools

        $fixed.find('thead > tr:gt(0) > th').each(function(i) {
            var $th = $(this)

            $th.mouseover(function(e) {
                var ofLeft    = parseInt($fixed.find('.fixedtableThead').css('left')) || 0
                var offset    = tools.getOffset($th, e).offsetX
                var $resizeTh = $ths.eq($th.attr('colsnum'))

                if ($th.outerWidth() - offset < 5) {
                    $th.css('cursor', 'col-resize').off('mousedown.bjui.tablefixed.resize').on('mousedown.bjui.tablefixed.resize', function(event) {
                        $fixed.find('> .resizeProxy')
                            .show()
                            .css({
                                left:   tools.getRight($resizeTh) + ofLeft + $fixed.position().left,
                                top:    $fixed.position().top,
                                height: $fixed.height(),
                                cursor: 'col-resize'
                            })
                            .basedrag({
                                scop:  true, cellMinW:20, relObj:$fixed.find('.resizeMarker'),
                                move:  'horizontal',
                                event: event,
                                stop:  function() {
                                    var pleft   = $fixed.find('.resizeProxy').position().left
                                    var mleft   = $fixed.find('.resizeMarker').position().left
                                    var move    = pleft - mleft - $resizeTh.outerWidth() - 9
                                    var cellNum = tools.getCellNum($resizeTh)
                                    var oldW    = $resizeTh.width(), newW = $resizeTh.width() + move
                                    var $dcell  = $tds.eq(cellNum - 1)
                                    var tableW  = $fixed.find('> .fixedtableHeader .table').width()

                                    $resizeTh.width(newW)
                                    $dcell.width(newW)

                                    $fixed.find('.table').width(tableW + move)
                                    $fixed.find('.resizeMarker, .resizeProxy').hide()

                                    if ((tableW + move + Tablefixed.SCROLLW) < that.options.newWidth) {
                                        $fixed.find('.fixedtableScroller').width(tableW + move + Tablefixed.SCROLLW)
                                    } else {
                                        var newW = $fixed.closest('.bjui-resizeGrid').innerWidth()
                                        if ((tableW + move + Tablefixed.SCROLLW) < newW) newW = (tableW + move + Tablefixed.SCROLLW)

                                        $fixed.find('.fixedtableHeader').width(newW - Tablefixed.SCROLLW)
                                        $fixed.find('.fixedtableScroller').width(newW)
                                        $fixed.width(newW)
                                    }
                                    $fixed.data('resizeGrid', true)
                                }
                            })

                        $fixed
                            .find('> .resizeMarker')
                            .show()
                            .css({
                                left:   tools.getLeft($resizeTh) + ofLeft + $fixed.position().left,
                                top:    $fixed.position().top,
                                height: $fixed.height()
                            })
                    })
                } else {
                    $th
                        .css('cursor', 'default')
                        .off('mousedown.bjui.tablefixed.resize')
                }

                return false
            })
        })
    }

    Tablefixed.prototype.setOrderBy = function(options) {
        var $th       = this.$element,
            $orderBox = $th.find('.fixedtableCol'),
            $order    = $(FRAG.orderby.replace('#asc#', BJUI.regional.orderby.asc).replace('#desc#', BJUI.regional.orderby.desc))

        options = options || this.options

        $th.addClass('orderby')
        if (options.orderDirection) {
            if (!BJUI.ui.clientPaging) $th.addClass(options.orderDirection)
            $th.pagination('setClientOrder', {orderField:options.orderField, orderDirection:options.orderDirection})
        }
        if (!$orderBox.length) {
            $orderBox = $('<div class="fixedtableCol">'+ $th.html() +'</div>')
                .appendTo($th.empty())
        }

        $order
            .data('orderField', options.orderField)
            .appendTo($orderBox)
            .pagination('orderBy')
    }

    /*  控制表格的一些属性 */
    Tablefixed.prototype.resizeGrid = function() {
        var that = this
        var _resizeGrid = function() {
            $('div.bjui-resizeGrid').each(function() {
                var $this  = $(this), $navtab = $this.closest('.navtabPage'),
                    width  = $this.width(),
                    height = $this.height(),
                    $fixed = $this.find('.bjui-tablefixed'),
                    fixedH = $fixed.find('.fixedtableThead').height(),
                    newWidth = that.options.newWidth,
                    realWidth
                if ($this.length && $this.is(':hidden')) {
                    if (!$this.hasClass('tab-pane')) {
                        $navtab.show()
                        width  = $this.innerWidth()
                        height = $this.height()
                        fixedH = $fixed.find('.fixedtableHeader').height()
                        $navtab.hide()
                    }
                }
                if (width) {
                    $this.find('.bjui-tablefixed').each(function() {
                        var $fixed = $(this)

                        if (!$fixed.data('resizeGrid')) realWidth = width
                        else realWidth = newWidth

                        $fixed.width(realWidth)
                        $fixed.find('.table').width(realWidth - Tablefixed.SCROLLW)
                        $fixed.find('.fixedtableHeader').width('100%')

                        if (isChrome) {
                            $fixed.find('.fixedtableHeader .table').width(realWidth - Tablefixed.SCROLLW - 1)
                            $fixed.find('.fixedtableScroller').width(realWidth + 2)
                        } else {
                            $fixed.find('.fixedtableHeader .table').width(realWidth - Tablefixed.SCROLLW)
                            $fixed.find('.fixedtableScroller').width(realWidth + 1)
                        }
                    })
                }

                /* resizeH */
                $this.css('overflow', 'hidden')
                $fixed.height(height)
                    .find('.fixedtableScroller').height(height - fixedH)

            })

            var resizeH = function() {
                var _height = that.$fixed.parent().height()

                that.$fixed.parent().css('overflow', 'hidden')
                that.$fixed.height(_height)
                    .find('.fixedtableScroller').height(_height - that.$fixed.find('.fixedtableHeader').height())
            }
        }

        $(window).on(BJUI.eventType.resizeGrid, _resizeGrid)
    }


    // TABLEFIXED PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args     = arguments
        var property = option

        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Tablefixed.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.tablefixed')

            if (!data) $this.data('bjui.tablefixed', (data = new Tablefixed(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.tablefixed

    $.fn.tablefixed             = Plugin
    $.fn.tablefixed.Constructor = Tablefixed

    // TABLEFIXED NO CONFLICT
    // =================

    $.fn.tablefixed.noConflict = function () {
        $.fn.tablefixed = old
        return this
    }

    // TABLEFIXED DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('table[data-toggle="tablefixed"]')

        if (!$this.length) return

        Plugin.call($this)
    })

    /* orderby */
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $this = $(e.target).find('th[data-order-field]')

        if (!$this.length) return

        Plugin.call($this, 'setOrderBy')
    })

    /* selected tr */
    $(document).on('click.bjui.tr.data-api', 'tr[data-id]', function(e) {
        var $this     = $(this),
            $table    = $this.closest('table'),
            multi     = $table.data('selectedMulti'),
            id        = $this.attr('data-id'),
            clsName   = 'selected',
            $selected = $table.closest('.unitBox').find('#bjui-selected')

        $.CurrentNavtab.find('tr[data-id = "' + id + '"]').toggleClass(clsName)
        if (multi) {
            id = []
            $this.siblings('.'+ clsName).add(($this.hasClass(clsName) ? $this : '')).each(function() {
                id.push($(this).attr('data-id'))
            })
            id = id.join(',')
        } else {
            $this.siblings().removeClass(clsName)
            if (!$this.hasClass(clsName)) id = ''
        }
        if ($selected && $selected.length) {
            $selected.val(id)
        } else {
            $selected = $('<input type="hidden" id="bjui-selected" value="'+ id +'">')
            $selected.appendTo($table.closest('.unitBox'))
        }
    })

}(jQuery);
