var re = /(\w+)\s(\w+)/; 
var str = "zara ali"; 
var newstr = str.replace(re, "$2, $1"); 
console.log(newstr); // ali, zara