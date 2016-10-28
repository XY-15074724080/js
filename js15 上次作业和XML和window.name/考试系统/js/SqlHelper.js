// JavaScript Document
//封装sqlite
function SqlHelper(dbname,size){ 
	this.dbname=dbname;
	this.size=size;
	this.init();
}

SqlHelper.prototype={
	init:function(){//初始化一个数据
		if(!this.db){
			if(window.openDatabase){//判断该浏览器是否支持websql的API
				this.db=openDatabase(this.dbname,1.0,"database",this.size*1024*1024);
			}else{
				return false;
			}
		}
	},
	//sql: select * from xxx
	exesql:function(sql,replace){
		if(replace){
			this.db.transaction(function(tx){tx.executeSql(sql,replace);});
		}else{
			this.db.transaction(function(tx){tx.executeSql(sql,[]);});
		}
	},
	createTable:function(tableName,fields){
		var sql = 'CREATE TABLE IF NOT EXISTS '+tableName+' (';
		for(i in fields){
			if(fields.hasOwnProperty(i)){
				sql+=i+" "+fields[i]+",";
			}
		}
		sql = sql.substr(0,sql.length-1);//去掉最后一个字段的逗号(,)

		sql += ")";

		this.exesql(sql);
	},
	select:function(tableName,selectFields,whereStr,whereParams,callback){
		var sql = "SELECT " + selectFields + " FROM " +tableName;
		if(typeof(whereStr) != "undefined" && typeof(whereParams) != "undefined" && whereStr != ""){
			sql += " where " + whereStr;
		}
		this.db.transaction(function(tx){
			tx.executeSql(sql,whereParams,function(tx,results){
				if(results.rows.length<1){
					if(typeof(callback) == 'function'){
						callback(false);
					}
				}else{
					if(typeof(callback) == 'function'){
						callback(results.rows);
					}
				}
			},function(tx,error){
				return false;
			});
		});
	}
}