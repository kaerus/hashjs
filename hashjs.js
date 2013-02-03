/*
 * Hashjs http://github.com/kaerus/hashjs
 * Released under the MIT License, feel free to use, share and modify. 
 */

(function (global) {
    "use strict"

    var PREPEND = '', SEPARATE = '/', APPEND = '', POLLINTERVAL = 250;

    function addListener(elm, eType, fn){
        if(elm.addEventListener){
            elm.addEventListener(eType, fn, false);
        } else if (elm.attachEvent){
            elm.attachEvent('on' + eType, fn);
        }
    }

    function removeListener(elm, eType, fn){
        if(elm.removeEventListener){
            elm.removeEventListener(eType, fn, false);
        } else if (elm.detachEvent){
            elm.detachEvent('on' + eType, fn);
        }
    }   

    /* singleton */
    var Hasher = {
        hash: { 
            path:null,            
            onChange: null,
            poll: POLLINTERVAL,
            _a: APPEND,
            _p: PREPEND, 
            _s: SEPARATE, 
            change: function(path){
                if(this.path !== path){
                    var old = this.path;
                    this.path = path; 
                    this.onChange(this, this.toString(old));
                }               
            },
            toString: function(path){
                if(!path || path === undefined) path = this.path;

                var a = path.indexOf(this._p),
                    b = path.lastIndexOf(this._a);

                if(a < 0) a = 0;
                else a+=this._p.length;
                if(b <= 0) b = path.length;   

                return path.substr(a,b);
            },  
            toArray: function(path){ 
                return this.toString(path).split(this._s) 
            },
            toPath: function(array){            
                return this._p + array.join(this._s) + this._a;
            }
        },  
        get: function(path) {
            return this.hash.toString(path);
        },
        set: function(path){
            this.hash.change(path);
        },
        update: function(path){
            if(Object.prototype.toString.call(path) === '[object Array]'){
                path = this.hash.toPath(path);
            } else {
                path = this.hash._p + Array.prototype.join.call(arguments,this.hash._s) + this.hash._a;
            }    

            if(path !== this.hash.path){
                this.hash.change(path); 
                window.location.hash = '#'+ encodeURI(path); 
            }
        },
        event: function(event) {
            var path = Hasher.uri(event.newURL);
            Hasher.set(path);
        },
        uri: function(url){
            url = url || window.location.href;
            var h = url.indexOf('#');

            return h < 0 ? '' : decodeURIComponent(url.substr(h+1,url.length));
        },
        start: function(){
            var i = 0;  

            this.hash.path = this.uri();

            /* configure hash divisors */
            if(typeof arguments[i] === 'string') this.hash._p = arguments[i++];
            if(typeof arguments[i] === 'string') this.hash._s = arguments[i++];
            if(typeof arguments[i] === 'string') this.hash._a = arguments[i++];

            /* register onChange callback */
            if(typeof arguments[i] === 'function') this.hash.onChange = arguments[i++];

            /* poll interval in msec (used in fallback mode only) */
            if(typeof arguments[i] === 'number') this.hash.poll = arguments[i++];

            if(window.hasOwnProperty('onhashchange')) {
                addListener(window, 'hashchange', this.event);
            } else {
                /* fallback mode */
                this._timer = setInterval(this.event, this.hash.poll);
            }

            if(this.hash.onChange) this.hash.onChange(this.hash);
        },
        stop: function() {
            if(window.hasOwnProperty('onhashchange')) {
                removeListener(window, 'hashchange', this.event);
            } else {
                clearInterval(this._timer);
                delete this._timer;
            }
        },

    }; 
   
    if (typeof exports === 'object') {  
        module.exports = Hasher;
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return Hasher; });
    } else { global.Hasher = Hasher; }

}(this));