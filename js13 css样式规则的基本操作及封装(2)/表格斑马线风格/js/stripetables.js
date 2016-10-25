// JavaScript Document
// 这种方案相比直接用 css中的伪类对比：
//   css中的伪类： xx:hover{} 这种用法不是每种浏览器都支持
//   我们现有的方案使用的是js的dom编程来实现的。但这样做的缺点是：用行为层(即js代码)做了"表示层"(即css功能)的事，不是一种理想的工作方式

//		更进一步的方案是使用 className来进行指定
function stripeTables(){
	if(!yc.isCompatible()){return false;}
	var tables=document.getElementsByTagName("table");
	var odd,rows;
	for(var i=0;i<tables.length;i++){
		odd=false;
		rows=tables[i].getElementsByTagName("tr");//获取第i个表格里所有的行
		for(var j=0;j<rows.length;j++){//这里设置斑马线式地显示表格
			if(odd==true){//偶数行改变颜色
			//添加类名 -> 添加显示效果
			//rows[j].style.backgroundColor="#ffc";
			//不要像上面一样直接在js中更改背景颜色，而最好使用css来更改
				yc.addClassName(rows[j],"odd");
				odd=false;
			}else{//索引j:0,2,4...奇数行颜色不变
				odd=true;
			}
		}
	}
}
yc.addLoadEvent(stripeTables);