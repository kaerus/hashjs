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


function Hasher(init) {
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

    function _addListener(elm, eType, fn){
        if(elm.addEventListener){
            elm.addEventListener(eType, fn, false);
        } else if (elm.attachEvent){
            elm.attachEvent('on' + eType, fn);
        }
    }

    function _removeListener(elm, eType, fn){
        if(elm.removeEventListener){
            elm.removeEventListener(eType, fn, false);
        } else if (elm.detachEvent){
            elm.detachEvent('on' + eType, fn);
        }
    }   

    this.parse = function(hash) {
        hash = hash || self._hash;
        if(!hash) return '';
        var regexp = new RegExp('^\\'+ self.prepend +'|\\'+ self.append +'$', 'g');
        return hash.replace(regexp, '');

    }

    this.get = function(){
        return self.parse(self._hash);
    }

    this.changeTo = function(newHash){
        //newHash = decodeURIComponent(newHash); //fix IE8 while offline
        newHash.replace('%3A','?'); //fix IE8 while offline
        if(self._hash !== newHash){
            var oldHash = self._hash;
            self._hash = newHash; 
            self.emit('change',self.parse(newHash), self.parse(oldHash));
        }
    }

    this.getURI = function(){
        // parse full URL instead of getting window.location.hash because 
        // Firefox decode hash value (and all the other browsers don't)
        // also because of IE8 bug with hash query in local file.
        var hash = /#(.*)$/, 
            result = hash.exec( window.location.href );
        return (result && result[1])? decodeURIComponent(result[1]) : '';
    }

    this.checkPath = function(){
        var uri = self.getURI();
        if(uri !== self._hash){
            self.changeTo(uri);
        }
    }

    this.baseURL = function(){
        return self.url.replace(/(\?.*)|(\#.*)/, ''); 
    }

    this.toArray = function(){
        return self.parse().split(self.separate);
    }

    this.arrayToHash = function(/*['p1','p2','pn']*/){
        var paths = Array.prototype.slice.call(arguments),
            path = paths.join(self.separate);
        path = path || self.prepend + path.replace(/^\#/, '') + self.append;

        if(MSIE && LOCAL){
            path = path.replace(/\?/, '%3F'); // IE8 local file bug 
        }
        return path;
    }

    this.set = function(path){
        if(path !== self._hash){
             self.changeTo(path); 
            // encodeURI to preserve '?', '/', '#'.
            window.location.hash = '#'+ encodeURI(path); 
        }
    }

    this.replace = function(path){
        if(path !== self._hash){
            self.changeTo(path);
            window.location.replace('#'+ encodeURI(path));
        }
    }

    this.toString = function(){
        return '[hasher hash="'+ self.get() +'"]';
    }

    this.start = function(){
        if(ONHASHCHANGE){
            _addListener(window, 'hashchange', self.checkPath);
        }else {
            self._intervalID = setInterval(self.checkPath, POLL_INTERVAL);
        }

        self.isActive = true;
        self.emit('start',self.get());
    }

    this.stop = function(){
        if(!self.isActive) return;

        if(ONHASHCHANGE){
            _removeListener(window, 'hashchange', self.checkPath);
        }else{
            clearInterval(self._intervalID);
            self._intervalID = undefined;
        }

        self.isActive = false;
        self.emit('stop',self.getURL());
    }

    this.init = function(args) {
        self.url = window.location.href;
        self._hash = self.getURI();
        if( typeof args === 'object' ) {
            self.append = args.append || APPEND;
            self.prepend = args.prepend || PREPEND;
            self.separate = args.separate || SEPARATE;
        }
        setTimeout(self.start,0);
    }
    
    /* Constructor initialized */ 
    if(init) this.init(init);

    /* make singleton */
    Hasher = this;
}

utils.inherit(Hasher,utils.Emitter);

/* Expose Hasher */
return Hasher;
    
});