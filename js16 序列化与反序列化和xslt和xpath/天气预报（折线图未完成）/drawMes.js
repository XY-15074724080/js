function loadXML(file){
			try{
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");//Microsoft.XMLDOM  通用版本的xml
				xmlDoc.async=false;//将加载方式设为同步
				xmlDoc.load(file);//与加载xml字符串区别：前面用的是 loadXML（字符串）
			}catch(e){
				try{
					xmlDoc=document.implementation.createDocument("","",null);
					xmlDoc.async=false;
					xmlDoc.load(file);
				}catch(e){
					try{
						var xmlhttp = new window.XMLHttpRequest();
						xmlhttp.open("GET",file,false);
						xmlhttp.send(null);
						xmlDoc = xmlhttp.responseXML.documentElement;
					}catch(e){
						alert("您的浏览器不能正常加载文件。请切换到兼容模式，或者更换浏览器");
					}
				}
			}
			return xmlDoc;
		}

var xmlDoc = loadXML("hengyang.xml");//外部本地文件

yc.$("cityname").innerHTML = xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue;
yc.$("weather").innerHTML = xmlDoc.getElementsByTagName("string")[4].childNodes[0].nodeValue;
yc.$("xray").innerHTML = xmlDoc.getElementsByTagName("string")[6].childNodes[0].nodeValue;
yc.$("date").innerHTML = xmlDoc.getElementsByTagName("string")[7].childNodes[0].nodeValue;
yc.$("descripe").innerHTML = xmlDoc.getElementsByTagName("string")[9].childNodes[0].nodeValue;
yc.$("weapic").src ='images/weather/a_'+ xmlDoc.getElementsByTagName("string")[10].childNodes[0].nodeValue;
yc.$("wendu").innerHTML = xmlDoc.getElementsByTagName("string")[8].childNodes[0].nodeValue;

function drawTable(obj,index,xmlDoc){
	var tr=document.createElement("tr");
	for(var i=0;i<5;i++){
		var td=document.createElement("td");
		var reg=new RegExp(".gif");
		index+=5;
		var nodevalue=xmlDoc.getElementsByTagName("string")[index].childNodes[0].nodeValue;
		if(reg.test(nodevalue)){
			var img=document.createElement("img");
			img.setAttribute("src", 'images/weather/a_'+ nodevalue) ;
			var img2=document.createElement("img");
			img2.setAttribute("src", 'images/weather/'+ xmlDoc.getElementsByTagName("string")[index+1].childNodes[0].nodeValue) ;

			td.appendChild(img);
			td.appendChild(img2);
			tr.appendChild(td);
		}else{
			td.innerHTML=nodevalue;
		}
		tr.appendChild(td);
	}
	obj.appendChild(tr);
	return obj;
}

var thead=yc.$("thead");
var tbody=yc.$("tbody");
drawTable(thead,2,xmlDoc);
for(var i=0;i<3;i++){
	drawTable(tbody,3+i,xmlDoc);
}

