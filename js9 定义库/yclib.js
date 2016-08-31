// JavaScript Document
//库：放一些内置函数的扩展（String,Array,Object）
//		放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个命名空间（对象）中
(function(){
	
	//============================给window添加了一个对象（命名空间）
	//可在window顶层对象中定义任意个自定义的对象
	if(!window.yc){//判断是否已经有人定义了yc这个对象
		//两种写法
		//window.yc={};
		window['yc']={};//这里定义了一个yc对象
	}
	//================================================
	



	//==============================浏览器能力检测======================
	//判断当前浏览器是否兼容这个库：浏览器能力检测
	//假设浏览器在这里的检测过不了，那么之后的很多功能都用不了了
	function isCompatible(other){
		//===：既保证内容，又保证类型相等
		//other===false：判断浏览器引擎是否支持false这个关键字
		if(other===false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName){
			return false;
		}
		return true;
	}
	window['yc']['isCompatible']=isCompatible;
	//=================================================================
	



	//===========================获取页面元素的操作======================
	//<div id="a">  <div id="b"
	//$("dddd");   var array=$("a","b")  =>一个参数则返回一个对象	array=>2 	array=0
	//如果参数是一个字符串，则返回一个对象
	//如果参数是多个字符串，则返回一个数组
	function $(){
		var elements=new Array();
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];//取出所给参数的每个值
			//alert(typeof element);
			//如果这个元素是一个string,则表明这是一个id
			if(typeof element=='string'){
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			
			elements.push(element);
		}
		return elements;
	}
	//在yc对象中扩展$
	/*
	window.yc.prototype={
		$:function(){}
	}//方法一
	*/

	//window.yc.$=$;//方法二

	window['yc']['$']=$;//方法三
	//===============================================================





	//================================替换模板文字的操作==============
	//替换模板文字  str：模板文字中包含	{属性名}
	//				o：是对象，格式{属性名:值}
	//以o对象中对应的属性名的值来替换str模板
	function supplant(str,o){
		//		/g：整个字符串全部匹配
		//		/正则/：正则表达式的标志
		//		{()}：() 分组，将匹配的值存起来
		return str.replace(/{([a-z]*)}/g,function(a,b){
			//console.log(a+"\t"+b);//a:{border}	b:border
			var r=o[b];		//o["border"]=>2s
			//return typeof r==='string' ? r : a;
			return r;
		});
	}
	window['yc']['supplant']=supplant;
	//================================================================



})()

