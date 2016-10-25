// JavaScript Document
// 本版本的优点：将img和p从html中删除，由DOM来动态创建和管理
function preparePlaceHolder(){
	//能力检测
	if(!yc.isCompatible()){return false;}
	if(!yc.$("imagegallery")){return false;}
	//创建id为placeholder的节点
	var placeholder=document.createElement("img");
	//设置placeholder的属性
	placeholder.setAttribute("src","images/placeholder.png");
	placeholder.setAttribute("id","placeholder");
	placeholder.setAttribute("alt","图片浏览");
	
	//创建图片描述的节点
	var description=document.createElement("p");
	//设置实现
	description.setAttribute("id","description");
	var desctext=document.createTextNode("请选择一张图片");
	description.appendChild(desctext);
	
	//获得ul容器
	var gallery=document.getElementById("imagegallery");
	yc.insertAfter(placeholder,gallery);//这里用我们自定义的insertAfter函数把placeholder添加到容器的后面
	yc.insertAfter(description,placeholder);
}

function showPic(whichPic){
	//如果不存在placeholder，则无法显示图片，程序无法运行
	if(!yc.$("placeholder")){return false;}
	var source=whichPic.getAttribute("href");//图片的地址
	
	var placeholder=yc.$("placeholder");
	if(placeholder.nodeName!="IMG"){return false;}
	
	placeholder.setAttribute("src",source);//在placeholder中显示图片
	
	//如果description不存在，则不显示
	if(yc.$("description")){
		var text=whichPic.getAttribute("title")?whichPic.getAttribute("title"):"";
		var description=yc.$("description");
		if(description.firstChild.nodeType==3){//nodeType等于3：代表元素或属性中的文本内容
			description.firstChild.nodeValue=text;	
		}
	}
	return true;
}

//这个函数用于做浏览器测试和检测，这样js代码不再依赖于那些没有保证的假设。可以保证js代码能平稳退化
function preparePic(){
	if(!yc.isCompatible()){return false;}
	//在页面上指定了容器ul的id，这样就可以通过js一次性地给所有的a元素加入事件
	if(!yc.$("imagegallery")){return false;}
	var gallery=yc.$("imagegallery");
	var links=gallery.getElementsByTagName("a");
	for(var i=0;i<links.length;i++){
		links[i].onclick=function(){//this -> link[i]
			return showPic(this)?false:true;//只要  这个onclick绑定的函数返回值是false，才不会运行<a href="">
		}
	}
}

yc.addLoadEvent(preparePlaceHolder);
yc.addLoadEvent(preparePic);//这里自定义了一个addLoadEvent函数，使当页面中有其它window.onload在执行的时候不覆盖已有的 页面加载完成时执行的事件