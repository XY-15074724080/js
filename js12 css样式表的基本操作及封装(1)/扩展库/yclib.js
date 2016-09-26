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
	




	//////////////////////////////////////////////////////////////////////
	//////////   样式表操作第一弹：设置样式规则  ////////////////////////
	//////////->增强了行内样式，缺点：文档混乱，缺乏可重用性/////////////
	/////////////////////////////////////////////////////////////////////


	/*
		将word-word 转换为 wordWord 	例：font-size -> fontSize
	*/
	function camelize(s){//使用驼峰命名法
		return s.replace(/-(\w)/g,function(strMath,p1){//这里使用了正则表达式的分组  例：s:font-size -> strMath:-s   p1:s
			return p1.toUpperCase();//转换成大写的  即 s -> S
		});
	}
	window['yc']['camelize']=camelize;


	/*
		将wordWord转换为word-word
		*/
	function uncamelize(s,sep){
		sep = sep || '-' ;//sep：分隔符 	判断有没有分隔符，没有就使用默认的
		//([a-z])([A-Z]) -> 一个小写字母和一个大写字母连在一起
		//例：fontSize   -> tS
		return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){//match:tS 	p1:t 	p2:S
			return p1 + sep + p2.toLowerCase();//这里把 S->s
		});
	}
	window['yc']['uncamelize']=uncamelize;



	/*
		通过id修改单个元素的样式      styles:{"backgroundColor":"red"}
		*/
	function setStyleById(element,styles){
		//取得对象的引用
		if(!(element=$(element))){
			return false;
		}
		//遍历styles对象的属性，并应用每个属性
		for(property in styles){
			if(!styles.hasOwnProperty(property)){//容错	  判断有没有这个属性的 值
				continue;//continue语句中断循环中的迭代，如果出现了指定的条件，然后继续循环中的下一个迭代。而break语句跳出循环后，会继续执行该循环之后的代码
			}
			if(element.style.setProperty){//      setProperty("background-color" )
				//DOM2样式规范   setProperty(propertyName,value,priority);
				//propertyName：属性名    value：值    priority：优先级
				element.style.setProperty(uncamelize(property,'-'),styles[property],null);//属性名将wordWord转换为word-word
			}else{// 但是IE浏览器不支持 setProperty()方法。为了保证兼容性
				//使用备用方法  element.style["background"]="red"
				//而ie里面的属性是采用驼峰命名法的，所以这里还做了一个属性名转换的的机制camelize(property)
				element.style[camelize(property)]=styles[property];
			}
			//转换属性名的格式是为了传进来的 styles的属性 的格式 不管是wordWord还是word-word都可以用
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;

	/*
	通过标签名修改多个样式：调用举例：yc.setStylesByTagName('a',{'coloe':'red'});
		tagname：标签
		styles：样式对象	
		parent：父标签的id号
	*/
	function setStylesByTagName(tagname,styles,parent){
		parent = $(parent) || document;
		var elements=parent.getElementsByTagName(tagname);//取出父标签下所有的标签
		for(var e=0;e<elements.length;e++){
			setStyleById(elements[e],styles);//调用setStylesById函数 在每个元素中设置样式
		}
	}
	window['yc']['setStylesByTagName']=setStylesByTagName;

	/*
	通过类名修改多个元素的样式
		parent：父元素的id    tag：标签名   className：标签上的类名	styles：样式对象
	*/
	function setStylesByClassName(parent,tag,className,styles){
		if(!(parent=$(parent))){
			return false;
		}
		var elements=getElementsByClassName(className,tag,parent);//调用getElementsByClassName函数取出所有同类名的元素
		for(var e=0;e<elements.length;e++){//html中的多个元素可以有同一个类名，所以取出来的同类名的元素可以有多个，在这里迭代所有同类名元素
			setStyleById(elements[e],styles);//调用setStylesById函数 在每个元素中设置样式
		}
		return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;

	////////////////////////////////////////////////////////////////////////////
	///////////////  样式表操作第二弹：基于className切换样式  //////////////////
	////////////////////////////////////////////////////////////////////////////

	/*
	//取得元素中类名的数组
	//一个元素中类名可以有多个：class="a b c  d" 
	//不可以有class="a"class="b"这种一个元素带有两个类名的情况，因为后一个会覆盖前一个的内容
	//element：要查找类名的元素
	 */
	function getClassNames(element){
		if(!(element=$(element))){
			return false;
		}
		//用一个空格替换多个空格，再基于空格分割类名
		return element.className.replace(/\s+/,' ').split(' ');
		//这里考虑到书写不规范，出现多个空格的情况
		//split()方法把字符串拆分成数组，这里返回一个数组
	}
	window['yc']['getClassNames']=getClassNames;

	/*
		检查元素中是否存在某个类
		element：要查找类名的元素
		className：要查找的类名
	 */
	function hasClassName(element,className){
		if(!(element=$(element))){
			return false;
		}
		var classes=getClassNames(element);//取出包括所有类名的数组
		for(var i=0;i<classes.length;i++){//遍历所有类名
			if( classes[i] === className){//这里要完全匹配
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;
	
	/*
		为元素添加类
		element：要添加类名的元素
		className：要添加的类名
	*/
	function addClassName(element,className){
		if(!(element=$(element))){
			return false;
		}
		//将类名添加到当前className的末尾，如果没有类名，则不包含空格
		var space=element.className?' ':'';//元素本来有类名，就在后面加个空格，没有就不加
		element.className+= space + className;//元素的类名 等于 元素本来有的类名加上空格 再加上新增的类名(如果元素本来没有类名就会直接添上新增的类名)
		return true;
	}
	window['yc']['addClassName']=addClassName;

	/*
		从元素中删除类
		*/
	function removeClassName(element,className){
		if(!(element=$(element))){
			return false;
		}
		//先获取所有的类
		var classes=getClassNames(element);
		//循环遍历数组 删除匹配的项
		//因为从数组中删除项会使数组变短，所以要反向删除
		var length=classes.length;
		var a=0;
		for(var i=length-1;i>=0;i--){
			if(classes[i]===className){
				delete(classes[i]);//delete只将数组中下标为i的元素改为 undefined
				a++;
			}
		}
		element.className=classes.join(' ');//重置元素的类名
		//判断删除是否成功...
		return (a>0 ? true : false );
	}
	window['yc']['removeClassName']=removeClassName;
	
	
	
	
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

