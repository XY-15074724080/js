// JavaScript Document
(function(){
	
	//============================给window添加了一个属性（命名空间）
	//可在window顶层对象中定义任意个自定义的对象
	if(!window.yc){
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



	//================================带过滤的eval操作================
	function parseJson(str,filter){
		var result=eval("("+str+")");
		if(filter!=null&& typeof( filter )=='function'){
			for(var i in result){
				result[i]=filter( i ,result[i] );//修改过滤之后的值
			}
		}
		return result;
	}
	window['yc']['parseJson']=parseJson;
	//==============================================================




	//=======================控制显示和隐藏的操作=======================
	//开关操作
	function toggleDisplay(node,value){
		if(!(node=$(node))){return false;}
		if(node.style.display!='none'){
			node.style.display='none';
		}else{
			node.style.display=value||'';
		}
		return true;
	}
	window['yc']['toggleDisplay']=toggleDisplay;
	//==================================================================




})()



//================================扩展全局对象的操作===========================
//扩展全局的 Object.prototype=xxx
//Object,array->js中的原生对象
Object.prototype.toJSONString=function(){
	//需求：给Object 类的prototype添加一个功能 toJSONString(),将属性的值以json格式输出
	//{"name":"zs","age":20,"sex":男}
	//for(var i in person)	person[i]取出值
	var jsonarr=[];
	for(var i in this){//如果之后再调用toJSONString()会迭代 Object -> 所有的属性 ->造成迭代太多，内存溢出
		if(this.hasOwnProperty(i)){//判断它有没有这个属性
			jsonarr.push("\""+i+"\""+":\""+this[i]+"\"");//=>"键":"值"
		}
	}
	var r=jsonarr.join(",\n");//数组拼接成字符串
	r="{"+r+"}";//加上大括号表示一个对象
	return r;//返回json字符串
}

//{"name":"zs","age":30}
//=>[{"name":"zs","age":30},{"name":"zs","age":30}]
Array.prototype.toJSONString=function(){
	var json=[];
	for(var i=0;i<this.length;i++)
		json[i]=(this[i]!=null) ? this[i].toJSONString() : "null";
	return "["+json.join(",")+"]";
}

String.prototype.toJSONString=function(){
	return '"'+this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){
		var a=arguments[0];
		return (a=='\n') ? '\\n':(a == '\r') ? '\\r':(a == '\t') ? '\\t':"";})+'"';
}

Boolean.prototype.toJSONString=function(){return this;};
Function.prototype.toJSONString=function(){return this;};
Number.prototype.toJSONString=function(){return this;};
RegExp.prototype.toJSONString=function(){return this;};
//====================================================================