// JavaScript Document
function showPic(whichPic){
	var pichref=whichPic.getAttribute("href");//获取a标签的href属性，即图片的地址
	
	var placeholder=yc.$("placeholder");//获取图片容器
	placeholder.setAttribute("src",pichref);//设置容器所链接的图片地址
	
	var text=whichPic.getAttribute("title"); //获取图片的title属性
	var description=yc.$("description");
	
	description.firstChild.nodeValue=text;//更改图片描述部位的值
}
//这个版本在a标签里设置了图片的地址，然后只传过来自身的节点来改进代码的
//当用户禁用了js之后，浏览器可以根据a标签的href找到图片