// JavaScript Document
/*
给每一行加入事件，以实现切换效果
 */
function highlightRows(){//高亮效果
	if(!yc.isCompatible()){return false;}
	var rows=document.getElementsByTagName("tr");//取出每一行
	for(var i=0;i<rows.length;i++){

		rows[i].onmouseover=function(){//给每一行绑定 鼠标移入 事件
			this.style.fontWeight="bold";
			this.style.color="#f00";
		}
		rows[i].onmouseout=function(){//给每一行绑定 鼠标移出 事件
			this.style.fontWeight="normal";//这里添加的是行内样式，不方便之后的修改，所以还需改进
			this.style.color="#000";
		}
	}
}

yc.addLoadEvent(highlightRows);