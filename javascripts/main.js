function logBase(number,base){
	return Math.log(number)/Math.log(base);
}

function toBaseArr(n,b){
	h = Math.ceil(logBase(n,b));
	a = new Array(h+1) .fill(0);
	while(n){
		h = Math.floor(logBase(n,b));
		n-=Math.pow(b,h);
		a[h]++;
	}
	a.pop();
	return a.reverse();
}

function fromBaseArr(a,b){
	f = 0;
	a.reverse().map(function(e,i){
		return f+=e*Math.pow(b,i);
	});
	return f;
}

function toBase93(number){
	 str = "!\"#$%&'()*+,-./0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
	 return toBaseArr(number,93).map(function(e){return str[e]}).join("");
}

function getEntry(word){
	word = word.toLowerCase();
	var index = wordList.indexOf(word);
	if(index+1){
		return toBase93(index);
	}
	return -1;
}

function fromEntry(b93){
	str = "!\"#$%&'()*+,-./0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
	b93 = b93.split("").map(function(e){
		return str.search(e);
	});
	return wordList[fromBaseArr(b93,93)];
}

function repeat(str,times){
	var t = "";
	while(times){
		times--;
		t+=str;
	}
	return t;
}

cmd = {
	"<": function(o){
		o.stack.push(o.curStr);
		o.curStr = "";
	},
	">": function(o){
		o.curStr = o.stack.pop();
	},
	"v": function(o){
		o.curStr += o.stack.pop();
	},
	"i": function(o){
		o.stack.push(o.input.pop());
	},
	"+": function(o){
		if(o.checkTypes("string","string")){
			o.stack.push(o.stack.pop()+o.stack.pop());
		} else if(o.checkTypes("number","number")){
			o.stack.push(+o.stack.pop()+ +o.stack.pop());
		} else if(o.checkTypes("number","string")){
			var a = o.stack.pop();
			o.stack.push(repeat(o.stack.pop(),a));
		}
	},
	"*": function(o){
		/*
		*	writes str2 at the num index of str1 (overwrites) (str1,str2,num)
		multiply top two numbers of stack (num,num)
		concat top two entries on stack in a reverse order*/
		console.log(o.getTypes(3),o.stack);
		if(o.checkTypes("number","string","string")){
			var num  = o.stack.pop();
			var str2 = o.stack.pop().split("");
			var str1 = o.stack.pop().split("");
			str1.length += str2.length + num;
			// populate array
			for(var i=0;i<str1.length;i++){
				str1[i] = str1[i]||" ";
			}
			
			// replace array
			for(var i=0;i<str2.length;i++){
				str1[i+num] = str2[i];
			}
			o.stack.push(str1.join(""));
		}
	},
	"~": function(o){
		var a = o.stack.pop();
		o.stack.push(a,a);
	},
    "}": function(o){
		o.curStr += o.stack.pop();
		o.mode = 1;
	}
}

function Chaine(code){
	this.code    = code.split("");
	this.stepNum = 0;
	this.index   = 0;
	this.mode    = 1;
	this.stack   = [];
	this.input   = [];
	this.curStr  = "";
	this.command = cmd;
	this.baseStr = "";
	this.running = true;
}

function STDOUT(a){
	document.getElementById("output").innerHTML += a + "<br>";
}

Chaine.prototype.reset = function(){
	this.stepNum = 0;
	this.index   = 0;
	this.mode    = 1;
	this.stack   = [];
	this.input   = [];
	this.curStr  = "";
	this.command = cmd;
	this.running = true;
}

Chaine.prototype.feed = function(input){
	input = input.toString().split("\n");
	for(var i=0;i<input.length;i++){
		if(input[i][0]=="\""&&input[i].endsWith("\"")){
			this.input.push(input[i].slice(1,-1));
		} else if(+input[i]==input[i]){
			this.input.push(+input[i]);
		}
	}
}

Chaine.prototype.get = function(f){
	if(+f==f){
		return (function(o){o.stack.push(+f)});
	} else {
		return this.command[f];
	}
}

Chaine.prototype.run = function(toStep){
	if(toStep){
		while(this.index<=toStep){
			this.step();
		}
	} else {
		while(this.running){
			this.step();
		}
	}
}

Chaine.prototype.getTypes = function(n){
	var r = this.stack.concat([]);
	var a = [];
	for(var i=0;i<n;i++){
		a.push(typeof r.pop());
	}
	return a;
}

Chaine.prototype.checkTypes = function(){
	var a = Array.from(arguments);
	var c = this.getTypes(a.length);
	var b = true;
	for(var i=0;i<c.length;i++){
		if(c[i]!=a[i]){
			b = false;
			break;
		}
	}
	return b;
}

Chaine.prototype.step = function(){
	if(this.running){
		if(this.index>=this.code.length){
			this.running = false;
			STDOUT(this.curStr);
			while(this.stack.length){
				STDOUT(this.stack.pop());
			}
			return this;
		}
		switch(this.mode){
			case 1:	// string mode
				switch(this.code[this.index]){
					case "{":
						this.mode = 2;
					break;
					case "|":
						this.mode = 3;
					break;
					case "\\":
						this.index++;
						this.curStr += this.code[this.index];
					break;
					case ":":
						this.mode = 4;
					break;
					default:
						this.curStr += this.code[this.index];
					break;
				}
			break;
			case 3:	// single command mode
				this.mode = 1;
			case 2:	// multiline command mode
				var func = this.code[this.index];
				var comm = this.get(func);
				if(comm){
					comm(this);
				} else {
					throw new Error(func+" is not a valid command!");
				}
			break;
			case 4:
				if(this.code[this.index]==":"){
					this.mode = 1;
					this.curStr += fromEntry(this.baseStr);
					this.baseStr = "";
				} else {
					this.baseStr += this.code[this.index];
				}
			break;
		}
		this.index++;
		this.stepNum++;
	}
	return this;
}

// page-specific attributes v
var code;
var input;
var output;
var step;
var run;
var stats;
var instance;
window.addEventListener("load",function(){
	code   = document.getElementById("code");
	input  = document.getElementById("input");
	output = document.getElementById("output");
	stats  = document.getElementById("stats");
	step   = document.getElementById("step");
	run    = document.getElementById("run");
	step.disabled = true;
	run.disabled = true;
	q=window.location.href;o={};q=q.slice(q.indexOf("?")+1,q.length).split("||").map(function(e){var f=e.split("=");o[f[0]]=f[1];return o});
	if(o.code) code.value = o.code;
	if(o.input) input.value = o.input;
});
function set(){
	output.innerHTML = "";
	instance = new Chaine(code.value);
	instance.feed(input.value);
	stats.innerHTML = "Stack: "+JSON.stringify(instance.stack)+"<br>Current string: \""+instance.curStr+"\"<br>Command: --";
	step.disabled = false;
	run.disabled = false;
}

function outStep(){
	instance.step();
	stats.innerHTML = "Stack: "+JSON.stringify(instance.stack)+"<br>Current string: \""+instance.curStr+"\"<br>Command: "+instance.code[instance.index-1];
}
