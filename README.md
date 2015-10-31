# Cha-ne
## A string-friendly langauge

  < 	push current string to the stack
	>	  pop current string for writing
	+	  concat top two entries on stack (str,str)
		  add two numbers (num,num)
		  repeat str num times (num,str)
	*	  writes str2 at the num index of str1 (overwrites) (str1,str2,num)
		  multiply top two numbers of stack (num,num)
		  concat top two entries on stack in a reverse order
	$	  switch top two entries
	v	  pop stack and write to current string (implicit at the }, suppressed if ` is met)
	~	  duplicate the top of the stack
	i	  read entity of input and push to stack
	0-9 	push numeric literal
	/ 	divide top two entries on stack (num,num)
	-	  subtract top two entries on stack (num,num)
		  remove last num characters from end of str (str,num)
	@ 	reverse current string
	U	  sentence case current string
