define(function(require) {
    /* 搜索框的聚焦和失焦事件 */ 
    $('#kw').on({
        focus: function() {
            $('#search-quick-kw').hide(0);
            $('#search-btn').addClass('search-btn-h');
        },
        blur: function() {
            if ($(this).val() == '') {           //移出时只有搜索框为空才显示热词
                $('#search-quick-kw').show(0);
            }
            $('#search-btn').removeClass('search-btn-h');
        }
    });

    /* 顶部用户名光标移入移出事件 */
    $('.user-menu').hover(
        function(){
            $(this).find('.arrow').addClass('arrow-curr');
            $(this).find('.user-menu-sub').fadeIn(70);
        },
        function(){
            $(this).find('.arrow').removeClass('arrow-curr');
            $(this).find('.user-menu-sub').fadeOut(70);
        }
    );

    /* 侧边导航的光标移入事件 */ 
    $('#nav-aside ul').on('mouseenter', function() {
        $(this).find('.sub').css('minHeight', $(this).outerHeight());
    });

    /* 热门推荐切换导航的样式变化 */ 
    $('#hotLessonTags li').each(function(k) {
        var self = $(this);
        self.on('mouseenter', function() {
            self.siblings('.curr').removeClass('curr');
            self.addClass('curr');

            var items = $('#hot-lessons .list');
            items.filter('.curr').removeClass('curr');
            items.eq(k).addClass('curr');
        });
    });

    /* 热门推荐切换 */ 
    $('#hot-lessons li').hover(
        function() {
            var self=$(this);
            self.find('p').not('.free-icon').stop(true, true).slideDown(180);
            self.find('.dis-n').fadeIn(180);
            self.css('zIndex', 10);
            self.children('div').css('zIndex', 10);
        },
        function() {
            var self=$(this);
            self.find('p').not('.free-icon').stop(true, true).slideUp(180);
            self.find('.dis-n').fadeOut(180);
            self.css('zIndex', 0);
            self.children('div').css('zIndex', 0);
        }
    );

    /* 职业路径图的光标移入移出的边框变化 */ 
    var items = $('.learning-path a');
    var index;
    items.hover(
        function() {
            index = items.index(this);
            if (index + 1 > 5) {
                items.eq(index - 5).addClass('border-b-colored');
            }
        },
        function() {
            items.eq(index - 5).filter('.border-b-colored').removeClass('border-b-colored');
        }
    );

    /* 根据html样式名动态添加'敬请期待'课程 */ 
    items.filter('.coming-soon').attr('href', 'javascript:void(0)').find('button').addClass('disabled').text('敬请期待');
    var x = $('.wrapper .wiki dl a').css('transform-origin');

    /* 回到顶部 */ 
    $('#top').on('click', function() {
        $('html,body').animate({
            scrollTop: 0
        }, 300);
    });

    /* 根据DOM结构动态生成相应的右侧锚点 */
    var linkTargets=$('.linkTargets');  //锚点的对应DOM元素
    linkTargets.each(function(i){
        var _self=linkTargets[i];
            li=document.createElement('li'),
            a=document.createElement('a');
        $(a).attr({'href':'#'+$(this).attr('id'), 'title':$(this).attr('id')}).html(i+1).appendTo($(li));
        $(li).addClass('linkTo').insertBefore($('#top'));  //动态追加
    });

    /* 右侧锚点实时切换高亮状态 */ 
    var linkTos=$('.linkTo');        //右侧锚点导航
    $(window).bind('scroll',switchLinktoClass); //滚动时执行   
    switchLinktoClass();                        //确保刷新时也能执行
    $('.linkTo').bind('click',clickToSwitch);   //确保点击底部锚点导航时生效
    //右侧导航样式切换方法
    function switchLinktoClass(){
        var scrollTop=$(document).scrollTop();
        linkTargets.each(function(i){
            if($(document).scrollTop() >= $(this).offset().top){ //滚动达到或超过某个元素时
                $(linkTos[i]).siblings('.linkTo').removeClass('curr');  //取消之前的高亮元素样式
                $(linkTos[i]).addClass('curr');   //给对应的导航高亮样式
            }
        })
    }
    //点击锚点导航
    function clickToSwitch(){
        $(this).siblings('.linkTo').removeClass('curr');
        $(this).addClass('curr');
    }

    /* 在线客服左侧的弹出提示 */ 
    var tips;
    var right;
    $('#online-service').hover(
        function() {
            var widthParent = $('#online-service').width();
            tips = $(this).find('.tips');
            right = tips.css('right');
            tips.stop(false, true).fadeIn(0).animate({
                'right': widthParent
            }, 100);
        },
        function() {
            tips.stop(false, true).animate({
                'right': right
            }, 100).fadeOut(100);
        }
    );

    /* 关闭右侧广告 */ 
    $('.close').click(function() {
        $(this).parent().css('visibility', 'hidden');
    });


    /* 以下为轮播图代码 */

    /* 声明轮播元素 */ 
    var banner=$('#banner');
    var bannerList = banner.children('ul');
    var thumbs = banner.find('.thumbs');
    var numVis=1;
    appendThumb(bannerList, thumbs);
    var numClone=clone(bannerList, numVis);

     
     /* 设置自动轮播 */ 
     var intervalSlide = setInterval(function() {
         slideAuto(bannerList, numVis, numClone);   //设置轮播自动定时滚动
     }, 1000);

     /* 光标移入移出轮播图时的事件 */ 
     banner.hover(
         function() {
             clearInterval(intervalSlide);          //光标移入时停止轮播
         },
         function() {
             intervalSlide = setInterval(function() {          //光标移出时继续轮播
                 slideAuto(bannerList, numVis, numClone);
             }, 1000);
         }
     );

     /* 轮播的前一个/下一个按钮点击事件 */ 
    banner.find('.slide-arrow').on('click', function() {
         if ($(this).hasClass('slide-arrow-next')) {
             slideAuto(bannerList, numVis, numClone);  //点击后一个则调用滚动函数
         } else {
             slidePrev(bannerList, numVis, numClone);  //点击前一个则调用向前滚动函数
         }
    });

     /* 轮播索引按键点击事件 */ 
     var thumbs = banner.find('.thumb');
     thumbs.each(function(index) {
         $(this).on('click', function() {
             slideAuto(bannerList, numVis, numClone, index);
         });
     });

    /* 设置无需自动滚动需要点击滚动的元素 */ 
    setSlides($('#partners'),6);   //设置战略合作企业滚动
    setSlides($('#schools'),7);   //设置合作高校滚动
    setSlides($('#medias'),6);   //设置媒体报道滚动
});

/* 以下是公用函数 */ 

function setSlides(obj,num){ /* 无需自动滚动需要点击滚动函数 */
    var banner=obj;
    var bannerList = banner.children('ul');
    var numVis=num;
    var numClone=clone(bannerList, numVis);

     /* 轮播的前一个/下一个按钮点击事件 */ 
    banner.find('.slide-arrow').on('click', function() {
         if ($(this).hasClass('slide-arrow-next')) {
             slideAuto(bannerList, numVis, numClone);
         } else {
             slidePrev(bannerList, numVis, numClone);
         }
    });
}


/* 根据实际轮播数目动态添加索引按键 */ 
function appendThumb(obj, toWhat) {
    obj.children().each(function(index) {
        var className = (index == 0) ? 'thumb dis-ib cursor curr' : 'thumb dis-ib cursor';
        $('<span>').addClass(className).appendTo($('#banner p'));
    });
}

/* 根据每次可见数目克隆轮播，便于轮播更顺畅 */ 
function clone(obj, numVis) {
    var numClone = 0;
    obj.children().each(function(index) {
        if (index < numVis) {
            $(this).clone().appendTo(obj);
            numClone++;
        } else {
            return false;   
        }
    });
    obj.width(activeWidth(obj).wTotal);
    return numClone;
}

/* 动态获取轮播父元素和每个轮播图宽度 */ 
function activeWidth(obj) {
    var first = obj.children().first();
    var wEach = first.outerWidth(true);
    var wTotal = wEach * obj.children().length;
    return {
        'wTotal': wTotal,
        'wEach': wEach
    };
}


var global={};         //定义公共对象，用于放置不同滚动元素的id，防止各元素互相影响
function newVar(obj){
    var id=obj[0].id;
    global[id]={i:0};  //添加元素id
}

/* 轮播自动从右向左滚动 */ 
function slideAuto(obj, numVis, numClone, currIndex) {
    var id=obj[0].id;                      //根据元素id执行不同元素的各自滚动事件
     if(!global.hasOwnProperty(id)){
        newVar(obj);
    }
    var self=global[id];
    num=obj.children().length;
    wEach = activeWidth(obj).wEach;
    if (currIndex === undefined) { 
        if (self.i < num - numClone) {
            self.i++;
            thumbSwitch(obj, self.i < num - numClone ? self.i : 0);
        } else {                             //如果滚动超界,让元素立即返回原位
            obj.css('right', 0);
            self.i = 1;
            thumbSwitch(obj, self.i);
        }
        obj.stop(true, true).animate({
            right: self.i * wEach
        }, 300);
    } else {
        obj.stop(true, true).animate({       //然后继续滚动
            right: currIndex * wEach
        }, 300);
        thumbSwitch(obj, currIndex);      
    }
}

/* 轮播前一个 */ 
function slidePrev(obj, numVis, numClone) {
    var id=obj[0].id;
    if(!global.hasOwnProperty(id)){
        newVar(obj);
    }
    var self=global[id];
    num = obj.children().length;
    wEach = activeWidth(obj).wEach;
    offset = (num - numClone) * wEach;
    if (self.i == 0) {
        obj.css('right', offset);
        self.i = num - numClone - 1;
        obj.stop(true, true).animate({
            right: self.i * wEach
        }, 300);
    } else {
        self.i--;
        obj.stop(true, true).animate({
            right: self.i * wEach
        }, 300);
    }
    thumbSwitch(obj, self.i);
    
}

/* 轮播索引按键样式切换 */ 
function thumbSwitch(obj, index) {
    index = Math.abs(index);
    thumbs = obj.parent().find('.thumb');
    thumbs.filter('.curr').removeClass('curr');
    thumbs.eq(index).addClass('curr');
}
