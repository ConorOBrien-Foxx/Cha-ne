# Cha-ne
## A string-friendly langauge
Everything is implicitly treated as a string character, and the strings are printed implicitly after execution. If you want to perform commands, you must enclose them within {...}. To use {, }, use the escape character \. Or, if you simply wish to use a single command, you use the vertical bar character |. To use shorthand for a word, use the :...:. This will write that sequence to the current string. 


    <    push current string to the stack
    >    pop current string for writing
    +    concat top two entries on stack (str,str)
         add two numbers (num,num)
         repeat str num times (num,str)
    *    writes str2 at the num index of str1 (overwrites) (str1,str2,num)
         multiply top two numbers of stack (num,num)
         concat top two entries on stack in a reverse order
    $    switch top two entries
    v    pop stack and write to current string (implicit at the }, suppressed if ` is met)
    ~    duplicate the top of the stack
    i    read entity of input and push to stack
    0-9  push numeric literal
    /    divide top two entries on stack (num,num)
    -    subtract top two entries on stack (num,num)
         remove last num characters from end of str (str,num)
    @    reverse current string
    U    sentence case current string
