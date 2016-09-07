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
	
	/*
		页面加载事件
	*/
	function addLoadEvent(func){
		//将现有的window.onload事件处理函数的值存入变量oldOnLoad
		var oldOnLoad=window.onload;
		//如果在这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给它
		if(typeof window.onload!='function'){
			window.onload=func;
		}else{
			//如果在这个处理函数上已经绑定了一些函数，则将新函数追加到现有指令的尾部
			window.onload=function(){
				oldOnLoad();//如果以前这个页面有函数，则调用以前的函数
				func();//再调当前函数
			}
		}
		//func();
	}
	window['yc']['addLoadEvent']=addLoadEvent;
	
	




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

	


	//================================增加、移除事件的操作=============
	//增加事件：node:节点	type:事件类型('click')	listener:监听器函数
	function addEvent(node,type,listener){
		if(!isCompatible()){return false;}//判断是否兼容这个库，如果不兼容则后面的很多功能用不了
		if(!(node=$(node))){return false;}//判断节点是否为空
		//W3C添加事件的方法
		if(node.addEventListener){
			node.addEventListener(type,listener,false);
			return true;
		}else if(node.attachEvent){
			//IE的事件
			node['e'+type+listener]=listener;//给node节点增加一个属性避免重名，绑了一个函数
			node[type+listener]=function(){
				node['e'+type+listener]( window.event );//window.event是浏览器生成的事件，不加进去那么之后就不能获取鼠标位置等数据
				//在W3C里面可以自动获取，而在IE里需要添加进去才能之后获取位置等数据
				//相当于listener(window.event)
				//激活listener
			}
			node.attachEvent('on'+type,node[type+listener]);//IE的事件名是以on开头的
			return true;
		}
	}
	window['yc']['addEvent']=addEvent;
	
	


	/*
		移除事件
	*/
	function removeEvent(node,type,listener){
		if(!(node=$(node))){return false;}//判断节点是否为空
		//W3C添加事件的方法
		if(node.removeEventListener){
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){
			//IE的事件
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
		}
		return false;
	}
	window['yc']['removeEvent']=removeEvent;
	//小结：
	//1.添加事件时用的函数必须与删除时用的函数要是同一个函数
	/*var show=function(){
			alert("hello");
		}
		yc.addEvent("show","click",show);//添加事件时用了一个函数
		yc.removeEvent("show","click",show);//删除事件时用了一个函数

		// yc.addEvent("show","click",function(){  alert("hello"); }  );
		// yc.removeEvent("show","click",function(){  alert("hello"); }  );//错误，无法移除，因为匿名函数是两个函数
		*/
	//==============================================================






	//=====================================根据类名统计节点=============
	//	className：要找的类名	tag：要查找的标签
	//	getElementsByClassName:IE不支持
	//	需求：让IE也支持		查找页面的父框架的标签下的类名
	function getElementsByClassName(className,tag,parent){
		parent=parent || document;
		if(!(parent=$(parent))){return false;}//判断节点是否存在
		//查看所有匹配的标签
		//tag取这种标签的类，等于"*"取所有标签		parent选取父标签
		var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);//parent.all=>document.all ：所有标签的一个集合
		//IE浏览器不支持getElementsByClassName属性，但是支持getElementsByTagName属性
		var matchingElements=new Array();
		//创建一个正则表达式，来判断className是否正确
		className=className.replace(/\-/g,"\\-");//用"\-"替换类名中的"-"
		//CSS的类名称中可以有-符号，但是在正则中-是需要转义的	例：a-b
		var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");//\s:空格	在字符串里面需要转义		这里考虑到用户书写不规范
		//我们在html中如果不小心设置类名时前面和后面有空格，和没有空格的参数比是不相等的，所以要比较类名
		var element;
		//检查每个元素
		for(var i=0;i<allTags.length;i++){//迭代所有标记
			element=allTags[i];
			if(regex.test(element.className)){
				matchingElements.push(element);
			}
		}
		return matchingElements;
	}
	window['yc']['getElementsByClassName']=getElementsByClassName;
	//==================================================================






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




	/////////////////////////////////////////////////////////////////////
	////////////////////////	DOM中的节点操作补充 ////////////////////////
	//////////////////////////////////////////////////////////////////////
	//标准：a.appendChild(b)	在a是子节点的最后加入b
	//		a.insertBefore(b)	在a的前面加入一个b
			
	//----新增的第一个函数：给referencenode的后面加入一个node------
	function insertAfter(node,referencenode){
		if(!(node=$(node))){return false;}
		if(!(referencenode=$(referencenode))){return false;}
		var parent=referencenode.parentNode;
		if(parent.lastChild==referencenode){//当前节点referencenode是最后一个节点，就直接appendChild进去
			parent.appendChild(node);
		}else{//当前节点referencenode还有兄弟节点
			parent.insertBefore(node,referencenode.nextSibling);
		}
	}
	window['yc']['insertAfter']=insertAfter;

	//标准（删除节点）：node.removeChild(childNode)	=>一次只能删除一个子节点
	
	//----新增的第二个函数：一次删除所有的子节点-----------
	function removeChildren(parent){
		if(!(parent=$(parent))){return false;}
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		}
		//返回父元素，以实现方法连缀
		return parent;
	}
	window['yc']['removeChildren']=removeChildren;

	//在一个父节点的第一个子节点前面添加一个新节点
	//----新增的第三个函数-----------
	function prependChild(parent,newChild){
		if(!(parent=$(parent))){return false;}
		if(!(newChild=$(newChild))){return false;}
		if(parent.firstChild){//查看parent节点下是否有子节点
			//如果有一个子节点，就在这个子节点前添加
			parent.insertBefore(newChild,parent.firstChild);
		}else{//如果没有子节点则直接添加
			parent.appendChild(newChild);
		}
		return parent;//返回父元素，以实现方法连缀
	}
	window['yc']['prependChild']=prependChild;
	//=======================================================================
	
	
	
})()



//================================扩展全局对象的操作===========================
//扩展全局的 Object.prototype=xxx
//Object,array->js中的原生对象
Object.prototype.toJSONString=function(){
	//需求：给Object 类的prototype添加一个功能 toJSONString(),将属性的值以json格式输出
	//{"name":"zs","age":20,"sex":男}
	//for(var i in person)	person[i]取出值
	var jsonarr=[];
	for(var i in this){//之后再调用toJSONString()会迭代 Object -> 所有的属性 ->造成迭代太多，内存溢出
		if(this.hasOwnProperty(i)){//判断它有没有这个属性	容错处理
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






