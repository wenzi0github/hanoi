// http://watercold.sinaapp.com/2012/06/hanoi/
var Hnt = (function(){
	var Hnt      = {};

	Hnt.options = {
		"speed":4.2,
		"chgColor":true,
		"color":"red",
		"n":4
	};

	Hnt.movie    = [];	// 移动动画存储数组

	Hnt.A        = [];	// 三个底盘
	Hnt.B        = [];
	Hnt.C        = [];

	Hnt.A.name   = "A";	// 底盘的名称
	Hnt.B.name   = "B";
	Hnt.C.name   = "C";

	Hnt.A.val    = "1";	// 底盘的序号
	Hnt.B.val    = "2";
	Hnt.C.val    = "3";

	Hnt.A.num    = 0;	// 底盘当前的盘子数
	Hnt.B.num    = 0;
	Hnt.C.num    = 0;

	// 初始化
	Hnt.init = function(opt){
		$("#block").html('');

		Hnt.movie = [];

		Hnt.options = $.extend(Hnt.options, opt);
		Hnt.A.num    = Hnt.options.n;
		Hnt.B.num    = 0;
		Hnt.C.num    = 0;

		Hnt.initBlock(Hnt.options.n);
		Hnt.move(Hnt.options.n, "A", "B", "C");
		$("#numrange").attr("disabled", "true");
		$("#start").attr("disabled", "true");
		Hnt.start();
	}

	// 汉诺塔算法
	Hnt.move = function(n, a, b, c){
		if(n==1){
			Hnt.handle(n, a, c);
		}else{
			Hnt.move(n-1, a, c, b);
			Hnt.handle(n, a, c);
			Hnt.move(n-1, b, a, c);
		}
	}

	/**
	 * 移动动画存储
	 * @param	m 		当前移动的盘子的编号
	 * @param 	_from   从哪个底盘开始移动
	 * @param 	_to 	移动到哪个底盘上
	 */
	Hnt.handle = function(m, _from, _to){
		var _fromBottom = Hnt.getAccessBottom(_from);
		var _toBottom   = Hnt.getAccessBottom(_to);

		var width = Hnt.getAccessWidth(_from, _to);
		var accessWidth = _from<_to?"+="+width:"-="+width;

		// $("#plate"+m).animate({"left":accessWidth}, width*Hnt.options.speed);
		

		Hnt.movie.push({"sno":m, "bottom":"170px", "left":"", "t":(170-_fromBottom)*Hnt.options.speed});
		Hnt[_from].num--;
		Hnt.movie.push({"sno":m, "bottom":"", "left":accessWidth, "t":width*Hnt.options.speed});
		Hnt.movie.push({"sno":m, "bottom":_toBottom, "left":"", "t":(170-_toBottom)*Hnt.options.speed});
		Hnt[_to].num++;
		
	}

	Hnt.start = function(order){
		order = order || 0;
		if(order < Hnt.movie.length){
			var t = parseInt(Hnt.movie[order].t);
			Hnt.play(Hnt.movie[order]);
			order++;

			setTimeout(function(){
				Hnt.start(order);
			}, t);
		}else{
			alert("移动完成");
			$("#numrange").removeAttr("disabled");
			$("#start").removeAttr("disabled");
		}
	}

	Hnt.play = function(movie){
		// var movie  = Hnt.movie.pop();
		var sno    = movie.sno;
		var t      = movie.t;
		var bottom = movie.bottom;
		var left   = movie.left;

		if(bottom != ""){
			$("#plate"+sno).animate({"bottom":bottom}, t);
		}else if(left != ""){
			$("#plate"+sno).animate({"left":left}, t);
		}
	}

	// 初始化盘子
	Hnt.initBlock = function(n){
		// var n      = Hnt.options.n;
		var h      = '';
		var widthP = 0; // 每层盘子减少的宽度

		if(n<3){
			widthP = 60;
		}else if(n<7){
			widthP = 30;
		}else if(n<9){
			widthP = 20;
		}else{
			widthP = 16;
		}

		for(var i=1; i<=n; i++){
			var bottom = 20+(n-i)*16;
			var width  = 160-(n-i)*widthP;
			var left   = 70+(n-i)*widthP/2;
			h += '<div id="plate'+i+'" class="plate" style="bottom:'+bottom+'px;width:'+width+'px;left:'+left+'px;">'+i+'</div>';
		}
		$("#block").html(h);
	}

	// 获取每个底座最上面的那个盘子的bottom值
	Hnt.getAccessBottom = function(dipan){
		var num = Hnt[dipan].num;
		return 20+16*num;
	}

	Hnt.getAccessWidth = function(_from, _to){
		var _fromVal = Hnt[_from].val;
		var _toVal   = Hnt[_to].val;

		// var width = Math.abs(_toVal-_fromVal)*250;
		// return _toVal-_fromVal>0?"+="+width:"-="+width;
		return Math.abs(_toVal-_fromVal)*250;
	}

	return Hnt;
})();
$(function(){
	Hnt.initBlock(4);
})