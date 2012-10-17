/*
 * Hashjs http://github.com/kaerus/hashjs
 * Inspired from hasher <http://github.com/millermedeiros/hasher> by Miller Medeiros (thanks!)
 * Released under the MIT License, feel free to use, share and modify. 
 */

define(['utils'],function(utils){


var POLL_INTERVAL = 250,                                    // only used in setInterval fallback  
    MSIE = /*@cc_on!@*/0,                                   // IE specific conditional comment   
    ONHASHCHANGE = window.hasOwnProperty('onhashchange'),   // FF3.6+, IE8+, Chrome 5+, Safari 5+
    LOCAL = (window.location.protocol === 'file:'),         
    PREPEND = '/', SEPARATE = '/', APPEND = '';


function Hasher(initialize) {
    if(!(this instanceof Hasher)) {
      return new Hasher(Array.prototype.slice.call(arguments));
    } 
    var self = this;    
    
    utils.Emitter.call(this);
    
    this.url = '';
    this._hash = null;
    this.append = APPEND;
    this.prepend = PREPEND;
    this.separate = SEPARATE; 

    /* Constructor initialized */ 
    if(initialize) this.init(initialize);
 
    /* make singleton */
    Hasher = self;
}

utils.inherit(Hasher, utils.Emitter);

Hasher.prototype.parse = function(hash) {
    hash = hash || this._hash;
    if(!hash) return '';
    var regexp = new RegExp('^\\'+ this.prepend +'|\\'+ this.append +'$', 'g');
    return hash.replace(regexp, '');
}

Hasher.prototype.get = function(){
    return this.parse(this._hash);
}

Hasher.prototype.addListener = function(elm, eType, fn){
    if(elm.addEventListener){
        elm.addEventListener(eType, fn, false);
    } else if (elm.attachEvent){
        elm.attachEvent('on' + eType, fn);
    }
}

Hasher.prototype.removeListener = function(elm, eType, fn){
    if(elm.removeEventListener){
        elm.removeEventListener(eType, fn, false);
    } else if (elm.detachEvent){
        elm.detachEvent('on' + eType, fn);
    }
}   

Hasher.prototype.changeTo = function(newHash){
    //newHash = decodeURIComponent(newHash); //fix IE8 while offline
    newHash.replace('%3A','?'); //fix IE8 while offline
    if(this._hash !== newHash){
        var oldHash = this._hash;
        this._hash = newHash; 
        this.emit('change',this.parse(newHash), this.parse(oldHash));
    }
}

Hasher.prototype.init = function(args) {
    this.url = window.location.href;
    this._hash = this.getURI();
    if( typeof args === 'object' ) {
        this.append = args.append || APPEND;
        this.prepend = args.prepend || PREPEND;
        this.separate = args.separate || SEPARATE;
    }
    this.start();
    //setTimeout(this.start,0);
}

Hasher.prototype.replace = function(path){
    if(path !== this._hash){
        this.changeTo(path);
        window.location.replace('#'+ encodeURI(path));
    }
}

Hasher.prototype.toString = function(){
    return '[hasher hash="'+ this.getHash() +'"]';
}

Hasher.prototype.checkPath = function(){
    console.log("checkpath", Hasher);
    var uri = Hasher.getURI();
    if(uri !== Hasher._hash){
        Hasher.changeTo(uri);
    }
}

Hasher.prototype.start = function(){
    console.log("start: ", this);
    if(ONHASHCHANGE){
        this.addListener(window, 'hashchange', this.checkPath);
    }else {
        this._intervalID = setInterval(this.checkPath, POLL_INTERVAL);
    }

    this.isActive = true;
    this.emit('start',this.get());
}

Hasher.prototype.stop = function(){
    if(!this.isActive) return;

    if(ONHASHCHANGE){
        this.removeListener(window, 'hashchange', this.checkPath);
    }else{
        clearInterval(this._intervalID);
        this._intervalID = undefined;
    }

    this.isActive = false;
    this.emit('stop',this.getURL());
}


Hasher.prototype.getURI = function(){
    // parse full URL instead of getting window.location.hash because 
    // Firefox decode hash value (and all the other browsers don't)
    // also because of IE8 bug with hash query in local file.
    var hash = /#(.*)$/, 
        result = hash.exec( window.location.href );
    return (result && result[1])? decodeURIComponent(result[1]) : '';
}

Hasher.prototype.baseURL = function(){
    return this.url.replace(/(\?.*)|(\#.*)/, ''); 
}

Hasher.prototype.toArray = function(){
    return this.parse().split(this.separate);
}

Hasher.prototype.arrayToHash = function(/*['p1','p2','pn']*/){
    var paths = Array.prototype.slice.call(arguments),
        path = paths.join(this.separate);
        path = path || this.prepend + path.replace(/^\#/, '') + this.append;

    if(MSIE && LOCAL){
        path = path.replace(/\?/, '%3F'); // IE8 local file bug 
    }
    return path;
}

Hasher.prototype.set = function(path){
    if(path !== this._hash){
        this.changeTo(path); 
        // encodeURI to preserve '?', '/', '#'.
        window.location.hash = '#'+ encodeURI(path); 
    }
}

/* Expose Hasher */
return Hasher;
    
});
