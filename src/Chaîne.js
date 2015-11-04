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
	*		reverse the stack
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
	Q		pushes a newline to the stack
	R		push a random number between 0 and the popped number
	r		apply following regular expression and replace all matches with the top of the stack/nothing.
			e.g. r\d+/ replaces all digits in the string.
			there are also extra control sequences:
			\a	uppercase alphabet
			\A	non uppercase alphabet
			\l	lowercase alphabet
			\L	non lowercase alphabet
			\c	alphabetic characters
			\C	non alphabetic characters
			\p	punctuation
			\P	non punctuation
	l		push the length of the top string
	L		push the length of the current string
	c		copy current string to stack
	s		pops an integer (a), top string (s), next string (t) and puts t at every ath index in s (num,str,str)
	?		pops top byte; if it is truthy, execute next command, otherwise skip it
	n		converts string to number
	N		converts number to string
	(…) 	loop until top of stack is zero
	[…]		pop n and duplicate inner n times
	=		pushes 1 if top of stack is equal to current string
	@		takes the index in the word list equivalent to the character code of the byte
	#		performs b action until a newline is met
	&C		saves the current string as variable C
	^C		pushes C to the stack
	y		r, but nonglobal
	«…»		comment
	

To use shorthand for a word, use the :...:. This will write that sequence to the current string
*/

function hex(v){
	new Hexdump(v,{container:'hexdump',width:'10',ascii:true,byteGrouping:1,html:true,lineNumber:true,style:{lineNumberLeft:'',lineNumberRight: ':',stringLeft:' | ',stringRight:' |',hexLeft:'',hexRight:'',hexNull:'.g',stringNull:' '}});
}

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
		return str.indexOf(e);
	});
	console.log(a);
	return fromBaseArr(a,93);
}

function alph(number,str){	
	str = "\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]_`abcdefghijklmnopqrstuvwxyz{|}~\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF"
	return toBaseArr(number,str.length).map(function(e){return str[e]}).join(""); 
}

function arcAlph(s,str){
	return fromBaseArr(s.split("").map(function(e){
		return str.indexOf(e);
	}),str.length);
}

function g2ent(word){
	
}

function f2ent(word){
	
}

function byteEnt(word){
	var index = (wordList.indexOf(word.toLowerCase())).toString(2);
	//console.log(index,parseInt(index,2));
	index = index.match(/.{1,16}/g);
	//console.log(index);
	var s = "";
	for(var i=0;i<index.length;i++){
		s += String.fromCharCode(parseInt(index[i],2)+33);
	}
	return (s.length==1)?s+" ":s;
}

function unByte(word){
	var a = word[0];
	var b = word[1]||" ";
	var c = (a.charCodeAt()-33).toString(2);
	var d;
	if(b!=" "){
		d = (b.charCodeAt()-33).toString(2);
		return wordList[parseInt(c+d,2)];
	} else {
		return wordList[parseInt(c,2)];
	}
	return c;
}

function stringEnt(str){
	str = str.split(/\s/g);
	for(var i=0;i<str.length;i++){
		var index = wordList.indexOf(str[i].toLowerCase());
		if(index+1){
			str[i] = byteEnt(str[i]);
		}
	}
	return str
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
	return wordList[fromBase93(b93)];
}
function unnest(x){
	var depth = 0;
	x = x.split("");
	for(var i=0;i<x.length;i++){
		if(x[i]=="["&&(x[i-1]||"")!="\\"){
			depth++;
			if(depth>1){
				x[i] = "";
			}
		} else if(x[i]=="]"&&(x[i-1]||"")!="\\"){
			depth--;
			if(depth>0){
				x[i] = "";
			}
		}
	}
	return x.join("");
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
		o.curStr += o.stack.pop();
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
		} else if(o.checkTypes("number","string")){
			var a = o.stack.pop();
			o.stack.push(o.stack.pop().slice(0,-a));
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
		o.graveMet = false;
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
	"u": function(o){
		o.curStr=o.curStr.split(" ");
		r = o.curStr.pop().split("");
		r[0] = r[0].toUpperCase();
		o.curStr.push(r.join(""));
		o.curStr=o.curStr.join(" ");
	},
	"R": function(o){
		o.stack.push(Math.floor(Math.random()*o.stack.pop()));
	},
	"r": function(o){
		var f=o.code.join("").search(/[^\\]\//,o.index);
		var regBody = o.code.slice(o.index+1,f+1).join("");
		regBody = regBody.replace(/\\a/g,"[A-Z]").replace(/\\A/g,"[^A-Z]").replace(/\\l/g,"[a-z]").replace(/\\L/g,"[^a-z]").replace(/\\c/g,"[A-Za-z]").replace(/\\C/g,"[^A-Za-z]").replace(/\\p/g,"[.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>¿¡]").replace(/\\p/g,"[^.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>¿¡]").replace(/\\>/g,function(){
			return o.stack.pop();
		}).replace(/\\</g,function(){
			var r=o.stack.pop();
			o.stack.push(r,r);
			return "";
		});
		// lets remove this inner character sets!
		regBody = unnest(regBody);
		var regex = new RegExp(regBody,"g");
		console.log(regex);
		var repl = o.stack.pop() || "";
		o.curStr = o.curStr.replace(regex,repl);
		o.index = o.code[o.index-1]=="{"?f+2:f;
		// ensure wrapping
		var func = o.code[o.index];
		var comm = o.get(func);
		if(comm){
			comm(o);
		} else {
			throw new Error(func+" is not a valid command! (index: "+o.index+")");
		}
	},
	"y": function(o){
		var f=o.code.join("").search(/[^\\]\//,o.index);
		var regBody = o.code.slice(o.index+1,f+1).join("");
		regBody = regBody.replace(/\\a/g,"[A-Z]").replace(/\\A/g,"[^A-Z]").replace(/\\l/g,"[a-z]").replace(/\\L/g,"[^a-z]").replace(/\\c/g,"[A-Za-z]").replace(/\\C/g,"[^A-Za-z]").replace(/\\p/g,"[.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>¿¡]").replace(/\\p/g,"[^.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>¿¡]").replace(/\\>/g,function(){
			return o.stack.pop();
		}).replace(/\\</g,function(){
			var r=o.stack.pop();
			o.stack.push(r,r);
			return "";
		});
		// lets remove this inner character sets!
		regBody = unnest(regBody);
		var regex = new RegExp(regBody);
		console.log(regex);
		var repl = o.stack.pop() || "";
		o.curStr = o.curStr.replace(regex,repl);
		o.index = o.code[o.index-1]=="{"?f+2:f;
		// ensure wrapping
		var func = o.code[o.index];
		var comm = o.get(func);
		if(comm){
			comm(o);
		} else {
			throw new Error(func+" is not a valid command! (index: "+o.index+")");
		}
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
	"j": function(o){
		if(o.checkTypes("string","string")){
			var t = o.stack.pop();
			var s = o.stack.pop();
			o.stack.push(s.split(t).join(""));
		}
	},
	"e": function(o){
		o.stack.push(" ");
	},
	"n": function(o){
		o.stack.push(+o.stack.pop());
	},
	"N": function(o){
		o.stack.push(""+o.stack.pop());
	},
	"=": function(o){
		o.stack.push(+(o.stack.pop()==o.curStr));
	},
	"[": function(o){
		// lets find this bracket's depth!
		var depthArr = o.code.map(function(){return 0});
		var depth = 0;
		for(var i=0;i<o.code.length;i++){
			if(o.code[i]=="[") depthArr[i] = depth++;
			else if(o.code[i]=="]") depthArr[i] = --depth;
		}
		// get index of matching
	},
	"*": function(o){
		o.stack = o.stack.reverse();
	},
	"Q": function(o){
		o.stack.push("\n");
	},
	"&": function(o){
		o.index++;
		o.vars[o.code[o.index]] = o.curStr;
		o.curStr = "";
	},
	"^": function(o){
		o.index++;
		o.curStr += o.vars[o.code[o.index]]||"";
	},
	"o": function(o){
		STDOUT(o.stack.pop());
	},
	"J": function(o){
		o.index -= o.stack.pop();
	},
	"=": function(o){
		o.stack.push(+(o.stack.pop()===o.stack.pop()));
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
	this.runnings = [];
	this.vars     = {};
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

Chaine.prototype.run = function(toStep,f){
	if(toStep){
		while(this.index<=toStep){
			this.step();
		}
	} else {
		//this.step();
		setTimeout(function r(a){
			progress(a);
			a.run();
		},+document.getElementById("scanspeed").value,this);
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
						o.graveMet = false;
						this.mode = 2;
					break;
					case "|":
						o.graveMet = true;
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
					case "#":
						this.mode = 6;
						this.t = this.stack.pop()||" ";
					break;
					case "@":
						this.curStr += unByte(this.code[++this.index]+this.code[++this.index]);
					break;
					case String.fromCharCode(171):
						this.mode = 7;
					break;
					default:
						this.curStr += this.code[this.index];
					break;
				}
			break;
			case 3:	// single command mode
				this.mode = 1;
				o.graveMet = true;
			case 2:	// multiline command mode
				var func = this.code[this.index];
				var comm = this.get(func);
				if(comm){
					comm(this);
				} else {
					throw new Error(func+" is not a valid command! (index: "+this.index+")");
				}
				//console.log(this.stack);
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
			case 6:
				if(this.code[this.index]=="\n"){
					this.mode = 1;
					this.curStr = this.curStr.split(this.t);
					this.curStr.pop();
					this.curStr = this.curStr.join(this.t);
				} else {
					this.curStr += unByte(this.code[this.index]+this.code[++this.index])+this.t;
				}
			break;
			case 7:
				if(this.code[this.index]==String.fromCharCode(187)) this.mode = 1;
			break;
		}
		this.index++;
		this.stepNum++;
	}
	return this;
}

function updateByteCount(){
	bytes.innerHTML = bS(code.value);
}

function bS(text, options) {
	var crlf = /(\r?\n|\r)/g,
	whitespace = /(\r?\n|\r|\s+)/g;
	// Set option defaults
	options = options || {};
	options.lineBreaks = options.lineBreaks || 1;
	options.ignoreWhitespace = options.ignoreWhitespace || false;
	
	var length = text.length,
		nonAscii = length - text.replace(/[\u0100-\uFFFF]/g, '').length,
		lineBreaks = length - text.replace(crlf, '').length; 
	
	if (options.ignoreWhitespace) {
		// Strip whitespace
		text = text.replace(whitespace, '');
		
		return text.length + nonAscii;
	}
	else {
		return length + nonAscii + Math.max(0, options.lineBreaks * (lineBreaks - 1));
	}
}

// page-specific attributes v
var code;
var input;
var output;
var step;
var run;
var stats;
var bytes;
var instance;
var disp;
window.addEventListener("load",function(){
	code   = document.getElementById("code");
	input  = document.getElementById("input");
	output = document.getElementById("output");
	stats  = document.getElementById("stats");
	step   = document.getElementById("step");
	run    = document.getElementById("run");
	bytes  = document.getElementById("bytecount");
	disp   = document.getElementById("disp");
	updateByteCount();
	code.addEventListener("keyup",updateByteCount);
	code.addEventListener("change",updateByteCount);
	q=decodeURIComponent(window.location.href.replace(/\+/g,  " "));o={};q=q.slice(q.indexOf("?")+1,q.length).split("||").map(function(e){var f=e.split("=");o[f[0]]=f[1];return o});
	if(o.code) code.value = o.code;
	if(o.input) input.value = o.input;
});

function progress(a){
	document.getElementById("prog").style.width = Math.floor(100*a.index/a.code.length)+ "%";
	/*if(a.code[a.index]=="\n"){
		a.offSet++;
	} else {
		var q = document.getElementById("e"+(a.index-a.offSet));
		if(q) q.style.background = "green";
		var r = document.getElementById("e"+(a.index-1-a.offSet));
		if(r) r.style.background = "none";
	}*/
	outStep();
	return false;
}

//var prevSet = 0;

function set(){
	//if(prevSet) exp();
	//prevSet = 1;
	document.getElementById("prog").style.width = "0%";
	output.innerHTML = "";
	instance = new Chaine(code.value);
	/*instance.offSet = 0;
	var maxWidth = 0;
	var codeS = code.value.split("\n");
	codeS.map(function(e){
		maxWidth = Math.max(e.length,maxWidth);
	});
	var table = "<table>";
	var tempIndex = 0;
	var dispIndex = 0;
	for(var i=0;i<=codeS.length;i++){
		table += "<tr>"
		for(var j=0;j<maxWidth;j++){
			if(code.value[tempIndex]=="\n"){
				if(!j) table += "<td></td>";
				j = maxWidth;
				++tempIndex;
			} else {
				table += "<td width=\"20px\" id=e"+(dispIndex)+">"+(code.value[tempIndex]||"")+"</td>";
				if(code.value[tempIndex]) tempIndex++;
				if(code.value[dispIndex]) dispIndex++;
			}
		}
		table += "</tr>"
	}
	table.innerHTML += "</table>";
	disp.innerHTML = table;*/
	instance.feed(input.value);
	stats.innerHTML = "Stack: "+JSON.stringify(instance.stack)+"<br>Current string: \""+instance.curStr+"\"<br>Command: --<br>Grave met: "+instance.graveMet;
}

function outStep(){
	instance.step();
	stats.innerHTML = "Stack: "+JSON.stringify(instance.stack)+"<br>Current string: "+JSON.stringify(instance.curStr)+"<br>Command: "+instance.code[instance.index-1]+"<br>Grave met: "+instance.graveMet;
}

// file:///C:/Users/Conor%20O'Brien/Documents/Programming/~N-Z/Programming%20Languages/Cha%C3%AEne/Cha%C3%AEne.html?code%3DWe%27re%20no%20strangers%20to%20love%0AYou%20know%20the%20rules%20and%20so%20do%20I%0AA%20full%20commitment%27s%20what%20I%27m%20thinking%20of%0AYou%20wouldn%27t%20get%20this%20from%20any%20other%20guy%0AI%20just%20wanna%20tell%20you%20how%20I%27m%20feeling%0AGotta%20make%20you%20understand%0A%0A|%3CNever%20gonna%20give%20you%20up%0ANever%20gonna%20let%20you%20down%0ANever%20gonna%20run%20around%20and%20desert%20you%0ANever%20gonna%20make%20you%20cry%0ANever%20gonna%20say%20goodbye%0ANever%20gonna%20tell%20a%20lie%20and%20hurt%20you{%3C~%3E%26D}%0A%0A{%3C%24%3E~}|%3CWe%27ve%20known%20each%20other%20for%20so%20long%0AYour%20heart%27s%20been%20aching%20but%0AYou%27re%20too%20shy%20to%20say%20it%0AInside%20we%20both%20know%20what%27s%20been%20going%20on{%3C~%3E%26E%3E}%0AWe%20know%20the%20game%20and%20we%27re%20gonna%20play%20it%0AAnd%20if%20you%20ask%20me%20how%20I%27m%20feeling%0ADon%27t%20tell%20me%20you%27re%20too%20blind%20to%20see%0A%0A{~~%3E}|%3C%28Ooh%2C%20give%20you%20up%29{%3C~%3EQ%3E}|%3C%28Ooh%29%0ANever%20gonna%20give%2C%20never%20gonna%20give%0A%28Give%20you%20up%29%0A{%3C~%3E}{%3C*%3E%3E%3E}%0A%0A|^E%0A%0AI%20just%20wanna%20tell%20you%20how%20I%27m%20feeling%0AGotta%20make%20you%20understand%0A%0A{^DQQ^DQQ^DQQ%3C^D%24%3E%24e%24y/%3E%2F%60}||input%3D
