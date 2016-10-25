// JavaScript Document
function prepareSlideShow(){
	if(!yc.isCompatible()){return false;}
	if(!yc.$("linklist")){return false;}
	if(!yc.$("preview")){return false;}
	//为图片应用样式
	var preview=yc.$("preview");
	//设置图片样式
	preview.style.position="absolute";
	preview.style.left="0px";
	preview.style.top="0px";
	//取得列表中所有的链接
	var list=yc.$("linklist");
	var links=list.getElementsByTagName("a");
	
	/*
	for(var i=0;i<links.length;i++){
		yc.addEvent(links[i],'mouseover',function(){
			yc.moveElement("preview",(i+1)*(-100),0,10);
		});
	}//这里闭包中取到的i不是循环值，而是最终值，因为没有触发事件时，循环是会一直往下执行的，i的值就已经变了，当触发了事件之后，i就是循环之后的值
	//解决方法：设法存下每次循环的i的值，再传入事件里就行了
	*/
	
	//为每一个link绑事件
	/*方案一：写三个事件绑定
	links[0].onmouseover=function(){
		yc.moveElement("preview",-100,0,10);
	}
	links[1].onmouseover=function(){
		yc.moveElement("preview",-200,0,10);
	}
	links[2].onmouseover=function(){
		yc.moveElement("preview",-300,0,10);
	}
	*/
	
	/*方案二：如果要用循环，如何处理
			给当前的节点增加一个属性，来存当前的索引值，然后事件激活后，使用这个属性取值
	for(var i=0;i<links.length;i++){
		links[i].index=i;
		yc.addEvent(links[i],'mouseover',function(){
			yc.moveElement("preview",this.index*(-100),0,10);
		});
	}
	*/

	//为每一个link绑事件
	//使用闭包来实现		方案三
	for(var i=0;i<links.length;i++){//自调用的匿名函数，自调用自己，保存了当前i的值到index
		(function(index){
			yc.addEvent(links[index],'mouseover',function(){
				//alert(index);
				yc.moveElement("preview",(index+1)*(-100),0,10);
			});
		})(i);
	}
}

yc.addLoadEvent(prepareSlideShow);