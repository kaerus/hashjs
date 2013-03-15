hashjs
======

window location hash navigator
* Web component found <a href="https://github.com/kaerus-component">here</a> 
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
		/* assign onChange handler & pollinterval. */
		Hasher.start("!","/",":",start,500);

		function change(path,old){
			if(!old) console.log("hash start path", path.toArray());
			else console.log("hash changed from %s to",old,path.toArray());
		}
		
		document.getElementById('buttons').onclick = click;

		function click(event){
			var target = event.target || event.srcElement;
			Hasher.update(target.id);
		}

	</script>
</body>
```
