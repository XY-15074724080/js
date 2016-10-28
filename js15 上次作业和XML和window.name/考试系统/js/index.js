function ShowQuestions(questions){ 
			this.que=questions;
		}
		var timer;
		ShowQuestions.prototype={
			showque:function(){
				var ques=document.getElementById("questions");
				//插入剩余时间的div
				var timebox=document.createElement("div");
				timebox.innerHTML="剩余时间(单位 s)：";
				var time=document.createElement("span");
				timebox.appendChild(time);
				var setTime=new Date().getTime()+20000;
				timer=setInterval(function(){
					var innertime=parseInt( ( setTime-new Date().getTime() )/1000 );
						if(innertime==0){
							clearInterval(timer);
							submit(timer);
						}
						time.innerHTML=innertime;
				}, 50)
				document.body.insertBefore(timebox,ques);

				//插入所有的题目
				for(var i=0;i<this.getTotal();i++){
					var num=document.createElement("span");
					num.id="q"+i;
					num.innerHTML=this.que[i][0]+"、";
					ques.appendChild(num);
					var question=document.createElement("span");
					question.innerHTML=this.que[i][1];
					ques.appendChild(question);
					var options=document.createElement("p");
					for(var j=0;j<4;j++){
						var inp=document.createElement("input");
						inp.type="radio";
						inp.name="ans"+i;
						inp.value=j+1;

						//给每个选项绑定一个值改变事件
						(function(i,j){
							yc.addEvent(inp,"change",function(){
								ansarr[i]=j+1;
								console.log(ansarr);
								sqlhelper.exesql("delete from answer");
								sqlhelper.exesql("insert into answer(num,answer) values(1,'"+ansarr.join()+"')");
							});
						})(i,j);


						var ans=document.createElement("span");
						ans.innerHTML="&#"+(65+j)+":、"+this.que[i][2+j];

						options.appendChild(inp);
						options.appendChild(ans);
					}
					ques.appendChild(options);
					ques.appendChild(document.createElement("hr") );
				}

				var btn=document.createElement("input");
				btn.type="button";
				btn.value="提交试卷";
				btn.onclick=submit;
				ques.appendChild(btn);

				//加入恢复答案的按钮
				var getlastans=document.createElement("button");
				getlastans.innerHTML="恢复上次答案";
				getlastans.onclick=function(){ SqlHelper.select("answer","answer","num=?",[1],showlastans);}
				yc.prependChild(document.body.getlastans);

			},
			getTotal:function(){
				return this.que.length;
			}
		}

		function showlastans(rows){
			if(!rows || rows==false){
				return;
			}
			var answers=rows.item(0).answer;
			ansarr=answers.split(",");
			var allp=document.getElementsByTagName("p");
			for(var i=0;i<allp.length;i++){
				var allopt=allp[i].getElementsByTagName("input");
				for(var j=0;j<allopt.length;j++){
					if(ansarr[i]==j+1){
						allopt[j].checked=true;
					}
				}
			}
		}

		function submit(){
			clearInterval(timer);

			var allinput=document.getElementsByTagName("input");
			for(var i=0;i<allinput.length;i++){
				allinput[i].disabled=true;
			}

			var ans=[];
			for(var i=0;i<allque.que.length;i++){
				var num="ans"+i;
				var answer=document.getElementsByName(num);
				//var flag=true;

				for(var j=0;j<answer.length;j++){
					if(answer[j].checked){
						ans.push(answer[j].value);
						flag=false;
					}
				}
				if(flag){
						ans.push("0");
				}
			}

			var score=0;
			for(var j=0;j<allque.que.length;j++){
				if(ans[j]==allque.que[j][6]){
					score+=10;
				}
			}

			var newpage="submit.html#"+(allque.que.length*10)+"_"+score;
			window.open(newpage,"new window","width=300,height=300");
			close();
		}


		var sqlhelper=new SqlHelper("Questions",2);

		var queFields={"num":"int not null primary key","que":"text","opt1":"text","opt2":"text","opt3":"text","opt4":"text","ans":"int"};
		sqlhelper.createTable("question",queFields);
		sql1="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(1,'中国的首都','北京','长沙','上海','重庆',1)";
		sql2="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(2,'中国的首都','北京','长沙','上海','重庆',1)";
		sql3="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(3,'中国的首都','北京','长沙','上海','重庆',1)";
		sql4="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(4,'中国的首都','北京','长沙','上海','重庆',1)";
		sql5="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(5,'中国的首都','北京','长沙','上海','重庆',1)";
		sqlhelper.exesql(sql1);
		sqlhelper.exesql(sql2);
		sqlhelper.exesql(sql3);
		sqlhelper.exesql(sql4);
		sqlhelper.exesql(sql5);


		var ansarr=new Array(5);
		for(var i=0;i<ansarr.length;i++){
			ansarr[i]=0;
		}
		var ansFields={"num":"int not null primary key","answer":"text"};
		sqlhelper.createTable("answer",ansFields);
		sqlhelper.exesql("insert into answer(nun,answer) values(1,'"+ansarr.join()+"')");