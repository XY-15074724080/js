// JavaScript Document
UserData={//只适用于ie低版本
	storageObject:null,//用来存所有的键值对的对象
	init:function(){//初始化的方法，因为存或取的时候一定要指定节点，要有行为
		if(!this.storageObject){
			//设置存储对象(节点) -> DOM方法
			this.storageObject=document.createElement("div");
			this.storageObject.addBehavior("#default#userData");//给节点指定行为
			this.storageObject.style.display="none";//不显示在页面上
			document.body.appendChild(this.storageObject);
		}
	},
	set:function(key,value){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.setAttribute(key, value);//对象中有数据
		//将对象的数据序列化到磁盘上， save()中的参数就是文件名
		this.storageObject.save("a");//要存到本地文件a 上
		return value;
	},
	get:function(key){
		if(!this.storageObject){
			init();
		}
		//从磁盘上读取 a这个文件，将a中的数据反序列化到节点div的userdata中
		this.storageObject.load("a");//加载本地文件a
		return this.storageObject.getAttribute(key);
	},
	del:function(key){
		if(!this.storageObject){
			init();
		}
		this.storageObject.removeAttribute(key);
		this.storageObject.save("a");//删除完div中的userdata中的数据后，再覆盖a文件中的数据
	},
	isAvailable:function(){
		return ('\v' == 'v');//判断是否为ie浏览器   ie:'\v' -> v
							//在其它浏览器中，'\v'当成转义字符看，表示垂直制表位
	}
};