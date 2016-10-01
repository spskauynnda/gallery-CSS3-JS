// 通用
var _$ = function(id){
    if (document.getElementById(id)){
        return document.getElementById(id);
    }else{
        return false;
    }
}
var _$c = function(cls){
    if (document.getElementsByClassName(cls)){
        return document.getElementsByClassName(cls);
    }else{
        return false;
    }
}
var g = function(selector){
    var method = selector.substr(0,1) == '.'? 'getElementsByClassName' : 'getElementById';
    return document[method](selector.substr(1));
}

// 随机生成一个整数值
function random(range) {
    var min = Math.min(range[0],range[1]);
    var max = Math.max(range[0],range[1]);
    var diff = max - min;
    return Math.ceil( Math.random()*diff + min );
}
// 计算左右分区的范围
function range(){
    var range = { left: { x:[] , y:[] } , right:{ x:[] , y:[] } };
    var wrap = {
        w : g('#wrap').clientWidth,
        h : g('#wrap').clientHeight
    }
    var photo = {
        w: g('.photo')[0].clientWidth,
        h: g('.photo')[0].clientHeight
    }

    range.left.x = [0 - photo.w / 4 , wrap.w / 2 - photo.w * 5 / 4 ];
    range.left.y = [0 - photo.h / 4, wrap.h - photo.h * 3 / 4];
    range.right.x = [wrap.w / 2 + photo.w / 4 , wrap.w - photo.w / 4 ];
    range.right.y = range.left.y;

    return range;
}

// 输出海报
var data = data;
function addPhotos(){
    var template = _$("wrap").innerHTML;
    var html = [];
    var nav = [];
    for(var s in data){
        var _html = template.replace("{{index}}",s)
                             .replace("{{caption}}",data[s].caption)
                             .replace("{{desc}}",data[s].desc)
                             .replace("{{img}}",data[s].img);
        html.push( _html );
        nav.push( "<span id='nav_" + s + "'   class='i'>&nbsp;</span>" );
    }
    html.push( "<div class='nav'> " + nav.join('') + " </div>" );
    g("#wrap").innerHTML = html.join("");
    rsort( random([0,data.length]) );
}
addPhotos();

// 选中海报并排序
function rsort( N ){

    var photos = [];      //如果 var photos=photo，则传入的并不是一个数组，它只有基本的length动作，而不能对它使用sort进行排序
    var _photo = g('.photo');
    var i;
    for(i in data){
        _photo[i].className = 'photo photo-front';
        /*重排序之前去除所有图片样式*/
        _photo[i].style.left = '';
        _photo[i].style.top = '';
        _photo[i].style['-webkit-transform'] = 'rotate(' + (Math.random()*300 - 150 + 360) + 'deg)';
        photos.push(_photo[i]);
    }
    _photo[N].style['-webkit-transform'] = 'rotate(0deg)';
    g("#photo_" + N).className += " photo-center";
    var sp = photos.splice(N,1);
    // photos.splice(N,1)[0].className += ' photo-center';    //等效于 g("#photo_" + N).className += " photo-center";  g("#photo_" + N) = photos.splice(n,1);

    // 把剩下的海报分成左右两部分
    var photos_left = photos.splice(0,Math.ceil(photos.length/2) );
    var photos_right = photos;
    var ranges = range();
    for (i in photos_left){
        var photo = photos_left[i];
        photo.style.left = random( ranges.left.x ) + 'px';
        photo.style.top = random( ranges.left.y ) + 'px';
    }
    for (i in photos_right){
        var photo = photos_right[i];
        photo.style.left = random( ranges.right.x ) + 'px';
        photo.style.top = random( ranges.right.y ) + 'px';
    }

    // 控制按钮
    var navs = g(".i");
    for (var s = 0; s < navs.length ; s++){
        navs[s].className = navs[s].className.replace(/\s*i_current\s*/," ");
        navs[s].className = navs[s].className.replace(/\s*i_back\s*/," ");
    }
    g('#nav_' + N).className += ' i_current ';
}




// 翻面控制
var turn = function(elem){
    var cls = elem.className;
    var n = elem.id.split("_")[1];
    if ( /photo-front/.test(cls) ){
        cls = cls.replace( /photo-front/,"photo-back" );
        g('#nav_'+ n ).className += ' i_back';
    }else{
        cls = cls.replace( /photo-back/,"photo-front" );
        g('#nav_' + n).className = g('#nav_' + n).className.replace(/\s*i_back\s*/,' ');
    }
    return elem.className = cls;                         /*不能忘*/
}

var pturn = function(){
    for (var i in data){
        // _$c("photo")[i].onclick = function(){
        //     turn(this);
        // }

    }
}

var pselect = function(){
    var photo = g('.photo');
    for (var i = 0; i < photo.length; i++){
        photo[i].index = i;
        photo[i].onclick = function () {
            if ( /photo-center/.test(photo[this.index].className) ){
                turn(this);
            }else{
                rsort(this.index);
            }
        }
        _$c("i")[i].index = i;                  //不用this，就要在外面设置index值，这样turn( _$c('photo')[i] )中的i才会变化)
        _$c("i")[i].onclick = function () {
            if ( /photo-center/.test(photo[this.index].className) ){
                turn(photo[this.index]);
            }else{
                rsort(this.index);
            }
        }
    }

}

window.onload = function(){
     pturn();  pselect();
}


