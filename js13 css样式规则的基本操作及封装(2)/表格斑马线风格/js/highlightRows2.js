// JavaScript Document
/*
给每一行加入事件，以实现切换效果
 */
function highlightRows2(){//高亮效果
	if(!yc.isCompatible()){return false;}
	var rows=document.getElementsByTagName("tr");//取出每一行
	for(var i=0;i<rows.length;i++){

		rows[i].onmouseover=function(){//给每一行绑定 鼠标移入 事件
			yc.removeClassName(this,'mouseout');
			yc.addClassName(this,'mouseover');
		}
		rows[i].onmouseout=function(){//给每一行绑定 鼠标移出 事件
			yc.removeClassName(this,'mouseover');
			yc.addClassName(this,'mouseout');
		}
	}
}

yc.addLoadEvent(highlightRows2);