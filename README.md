hashjs
======

window location hash navigator

Usage
-----
```
hasher().on('start',function(path){
		$.get(path+'.html',function(html){
			$("#content").empty().append(html);
		});
		nav = path;
	}).on('change', function(path){
		if(nav !== path){
			$.get(path+'.html',function(html){
				$("#content").empty().append(html);
			});
			nav = path;
		}
	});
```