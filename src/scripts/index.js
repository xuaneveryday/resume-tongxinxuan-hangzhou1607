var $ = require('./common/libs/zepto-modules/zepto');
require('./common/libs/zepto-modules/event');
require('./common/libs/zepto-modules/ajax');
require('./common/libs/zepto-modules/touch');


var Swiper=require('./common/libs/swiper/swiper.min.js');
var swiperAni=require('./common/libs/swiper/swiper.animate1.0.2.min.js');
var IScroll=require('./common/libs/iscroll/iscroll.js');

/*if(localStorage.hasIntro){

}*/
$('.swiper-container').show();
$('#mainContainer').hide();


var swiper = new Swiper('.swiper-container',{
    onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
    swiperAni.swiperAnimateCache(swiper); //隐藏动画元素 
    swiperAni.swiperAnimate(swiper); //初始化完成开始动画
    }, 
    onSlideChangeEnd: function(swiper){ 
    swiperAni.swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
    } 
});





var myScroll;
var Audio=document.getElementsByTagName('audio')[0];
var Music=document.getElementById('music');
var bstop=true;
Music.onclick=function(){
	if(bstop){
		Audio.pause();
		$('#music').removeClass('rolate');
		bstop=false;
	}else{
		Audio.play();
		$('#music').addClass('rolate');
		bstop=true;
	}
}
$('#enter').on('tap',function(){
	$('.swiper-container').hide();
	$('#mainContainer').show();
	$('#music').hide();
	// Audio.pause();
	localStorage.hasIntro=true;
	var num=0;
	var myScroll; 
	$('.footer-skill').tap(function(){
		num=$(this).index();
		var targetApi=$(this).attr('id');
		$(this).addClass('active').siblings().removeClass('active');
		$('#scroller ul').eq(num).show().siblings().hide();
		
	})
	$.post('http://localhost:8000/project',function(data1){
		for(var i=0;i<data1.length;i++){
			var str='';
			str+='<li><article><div class="message mess"><div class="title">';
			str+='<h1>'+data1[i].name+'</h1>';
			str+='<div class="pic"><img src="'+data1[i].image+'"></div>';
			str+='<div class="talk">'+data1[i].description+'</div>';
			str+='<div class="time"><div>网址：'+data1[i].url+'</div></div>';
			str+='<div class="time"><div>'+data1[i].detail+'</div></div>';
			str+='<div class="time">'+data1[i].tech+'</div>';
			str+='<div class="time">'+data1[i].person+'</div>';
			str+='<div class="time">'+data1[i].difficulty+'</div>';
			str+='</div></div></article></li>';
			$('#scroller .ultwo').append(str);
		}
		var myScroll;
		myScroll = new IScroll('#wrapper', { mouseWheel: true });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	$.post('http://localhost:8000/skill',function(data2){
		console.log(data2)
		for(var i=0;i<data2.length;i++){
			var str='';
			str+='<li><img src="'+data2[i].img+'"><p>'+data2[i].name+'</p><p>熟悉度：'+data2[i].level+'</p><p>时间：'+data2[i].time+'</p></li>';
			$('#scroller .ulone').append(str);
		}
		var myScroll;
		myScroll = new IScroll('#wrapper', { mouseWheel: true });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	$.post('http://localhost:8000/work',function(data3){
		for(var i=0;i<data3.length;i++){
			var str='';
			str+='<li>';
			str+='<div><p><span>工作公司：</span></p><p>'+data3[i].name+'</p></div>';
			str+='<div><p><span>公司类型：</span></p><p>'+data3[i].category+'</p></div>';
			str+='<div><p><span>公司网址：</span></p><p>'+data3[i].url+'</p></div>';
			str+='<div><p><span>工作时间：</span></p><p>'+data3[i].time+'</p></div>';
			str+='<div><p><span>工作职位：</span></p><p>'+data3[i].posts+'</p></div>';
			str+='<div><p><span>汇报对象：</span></p><p>'+data3[i].reportto+'</p></div>';
			str+='<div><p><span>公司人数：</span></p><p>'+data3[i].peoples+'</p></div>';
			str+='<div><p><span>公司项目：</span></p><p>'+data3[i].projects+'</p></div>';
			str+='</li>';
			$('#scroller .ulthree').append(str);
		}
		var myScroll;
		myScroll = new IScroll('#wrapper', { mouseWheel: true });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		myScroll.scrollTo(0,0);
		myScroll.refresh();
	});
	
})