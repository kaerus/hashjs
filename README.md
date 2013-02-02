hashjs
======

window location hash navigator

Usage
-----
```
<!DOCTYPE html>
<html>
	<head><title>Hash test</title></head>
<body>
	<div id="buttons">
		<button href="#one" id="one">One</button>
		<button href="#two" id="two">Two</button>
		<button href="#three" id="three">Three</button>
	</div>	
	<script src="./hashjs.js"></script>
	<script>
		var hash = Hasher;
		
		hash.onChange = change;
		hash.onStart = start;
		hash.start();

		function change(path,old){
			console.log("hash changed from %s to",old,path);
		}

		function start(path){
			console.log("hash path is", path);
		}
		
		document.getElementById('buttons').onclick = click;

		function click(e){
			hash.update(e.srcElement.id);
		}


	</script>
</body>
```