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
		/* configure the hash string "#!xxx/yyy:" */
		/* assign event callbacks & pollinterval. */
		Hasher.start("!","/",":",start,change,500);

		function change(path,old){
			console.log("hash changed from %s to",old,Hasher.toArray(path));
		}

		function start(path){
			console.log("hash path is", path);
		}
		
		document.getElementById('buttons').onclick = click;

		function click(e){
			Hasher.update(e.srcElement.id);
		}
	</script>
</body>
```