/*
Everything is implicitly treated as a string character, and the strings are printed implicitly after execution

Program 1: Hello, World!
	Hello, World!

If you want to perform commands, you must enclose them within {...}. To use {, }, use the escape character \. Or, if you simply wish to use a single command, you use the vertical bar character |.

Within this "command set", you can use the following expressions:
	<		push current string to the stack
	>		pop current string for writing
	+		concat top two entries on stack (str,str)
			add two numbers (num,num)
			repeat str num times (num,str)
	*		writes str2 at the num index of str1 (overwrites) (str1,str2,num)
			multiply top two numbers of stack (num,num)
			concat top two entries on stack in a reverse order
	$		switch top two entries
	v		pop stack and write to current string (implicit at the }, suppressed if ` is met)
	~		duplicate the top of the stack
	i		read entity of input and push to stack
	0-9		push numeric literal
	/		divide top two entries on stack (num,num)
			writes str2 at the num index of str1 (inserts) (numstr1,str2)
	-		subtract top two entries on stack (num,num)
			remove last num characters from end of str (str,num)
	@		reverse current string
	U		sentence case current string
	R		push a random number between 0 and the popped number
	l		push the length of the top string
	L		push the length of the current string
	c		copy current string to stack
	s		pops an integer (a), top string (s), next string (t) and puts t at every ath index in s (num,str,str)
	?		pops top byte; if it is truthy, execute next command, otherwise skip it
	n		converts string to number
	N		converts number to string
	(…) 	loop until top of stack is zero
	[…]		
	=		pushes 1 if top of stack is equal to current string
	

To use shorthand for a word, use the :...:. This will write that sequence to the current string
*/

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
	console.log(a,b);
	a.reverse().map(function(e,i){
		console.log(e*Math.pow(b,i));
		return f+=e*Math.pow(b,i);
	});
	return f;
}

function toBase93(number){
	 str = "!\"#$%&'()*+,-./0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
	 return toBaseArr(number,93).map(function(e){return str[e]}).join("");
}

function check(a,b){
	if(Array.isArray(b)&&b.length>1){
		return check(a,b.pop())||check(a,b);
	} else {
		if(b==a) return true;
		return false;
	}
}

function fromBase93(a){
	str = "!\"#$%&'()*+,-./0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
	a=a.split("").map(function(e){
		var escp = check(e,"nsStdDwW0123456789".split(""));
		return str.search((escp?"\\":"")+e);
	});
	console.log(a);
	return fromBaseArr(a,93);
}

function alph(number,str){	
	str = str || "\"#$%&'()*+,-./0123456789:" + 
	             ";<=>?@ABCDEFGHIJKLMNOPQRST" + 
	             "UVWXYZ[\\]_`abcdefghijklmn" +
				 "opqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª" +
				 "«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄ" +
				 "ÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞ" + 
				 "ßàáâãäåæçèéêëìíîïðñòóôõö÷ø" +
				 "ùúûüýþÿ";
	
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
		return str.search("\\"+e);
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
	"/": function(o){
		if(o.checkTypes("number","number")){
			var a = o.stack.pop();
			var b = o.stack.pop();
			o.stack.push(b/a);
		} else if(o.checkTypes("number","string","string")){
			var num  = o.stack.pop();
			var str2 = o.stack.pop().split("");
			var str1 = o.stack.pop().split("");
			var st11 = str1.slice(0,num);
			var st12 = str1.slice(num,str1.length);
			o.stack.push(st11.concat(str2,st12).join(""));
		}
	},
	"-": function(o){
		if(o.checkTypes("number","number")){
			var a = o.stack.pop();
			var b = o.stack.pop();
			o.stack.push(b-a);
		}
	},
	"*": function(o){
		/*
		*	writes str2 at the num index of str1 (overwrites) (str1,str2,num)
		multiply top two numbers of stack (num,num)
		concat top two entries on stack in a reverse order*/
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
		} else if(o.checkTypes("number","number")){
			o.stack.push(o.stack.pop()*o.stack.pop())
		}
	},
	"~": function(o){
		var a = o.stack.pop();
		o.stack.push(a,a);
	},
	"$": function(o){
		var a = o.stack.pop();
		var b = o.stack.pop();
		o.stack.push(a,b);
	},
    "}": function(o){
		if(!o.graveMet) o.curStr += o.stack.pop();
		o.mode = 1;
	},
	"@": function(o){
		o.curStr = o.curStr.split("").reverse().join("");
	},
	"`": function(o){
		o.graveMet = true;
	},
	"U": function(o){
		o.curStr = o.curStr.replace(/(^\w{1}|\.\s*\w{1})/gi,function(x){
			return x.toUpperCase();
		});
	},
	"R": function(o){
		o.stack.push(Math.floor(Math.random()*o.stack.pop()));
	},
	"l": function(o){
		if(o.checkTypes("string")){
			var str = o.stack.pop();
			o.stack.push(str,str.length);
		} else if(o.checkTypes("number")){
			var num = o.stack.pop();
			o.stack.push(num,num,Math.log10(num));
		}
	},
	"L": function(o){
		o.stack.push(o.curStr.length);
	},
	"c": function(o){
		o.stack.push(o.curStr);
	},
	"?": function(o){
		if(!o.stack.pop()){
			o.stack.index++;
		}
	},
	"s": function(o){
		if(o.checkTypes("number","string","string")){
			// pops an integer (a), top string (s), next string (t) and puts t at every ath index in s (num,str,str)
			var n = o.stack.pop();
			var t = o.stack.pop();
			var s = o.stack.pop();
			r = new RegExp(".{1,"+n+"}","g");
			console.log(s,r,t,s.match(r));
			s=s.match(r).join(t);
			o.stack.push(s);
		}
	},
	"n": function(o){
		o.stack.push(+o.stack.pop());
	},
	"N": function(o){
		o.stack.push(""+o.stack.pop());
	},
	"=": function(o){
		o.stack.push(+(o.stack.pop()==o.curStr));
	}
}

function Chaine(code){
	this.code     = code.split("");
	this.stepNum  = 0;
	this.index    = 0;
	this.mode     = 1;
	this.stack    = [];
	this.input    = [];
	this.curStr   = "";
	this.command  = cmd;
	this.baseStr  = "";
	this.running  = true;
	this.graveMet = false;
}

function STDOUT(a){
	document.getElementById("output").innerHTML += (a+"").replace(/\n/g,"<br>");
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
		this.step();
		setTimeout(function r(a){
			a.run();
		},1,this);
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

function exp(){
	location.href = location.href.slice(0,location.href.indexOf("?")+1?location.href.indexOf("?"):location.href.length)+"?"+encodeURIComponent("code="+code.value+"||input="+input.value).replace(/'/g,"%27").replace(/"/g,"%22");
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
					case "^":
						this.mode = 5;
					break;
					default:
						this.curStr += this.code[this.index];
					break;
				}
			break;
			case 3:	// single command mode
				this.mode = 1;
				this.graveMet = true;
			case 2:	// multiline command mode
				var func = this.code[this.index];
				var comm = this.get(func);
				if(comm){
					comm(this);
				} else {
					throw new Error(func+" is not a valid command!");
				}
				this.graveMet = false;
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
			case 5:
				if(this.code[this.index]=="^"){
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
	q=decodeURIComponent(window.location.href.replace(/\+/g,  " "));o={};q=q.slice(q.indexOf("?")+1,q.length).split("||").map(function(e){var f=e.split("=");o[f[0]]=f[1];return o});
	if(o.code) code.value = o.code;
	if(o.input) input.value = o.input;
});
function set(){
	output.innerHTML = "";
	instance = new Chaine(code.value);
	instance.feed(input.value);
	stats.innerHTML = "Stack: "+JSON.stringify(instance.stack)+"<br>Current string: \""+instance.curStr+"\"<br>Command: --";
}

function outStep(){
	instance.step();
	stats.innerHTML = "Stack: "+JSON.stringify(instance.stack)+"<br>Current string: \""+instance.curStr+"\"<br>Command: "+instance.code[instance.index-1];
}
