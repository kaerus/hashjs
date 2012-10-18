hashjs
======

window location hash navigator

Usage
-----
```
var nav = "";

/* setup hasher */
Hasher().on('start',function(path){
	reset_content(path);
}).on('change', function(path){
	if(nav !== path){
		reset_content(path)
	}
});

function reset_content(path){
	$.get(path+'.html',function(html){
		$("#content").empty().append(html);
		nav = path;
	});
}
```