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
        path: null,
        onStart: null,   
        onChange: null,
        _a: APPEND,
        _p: PREPEND,
        _s: SEPARATE,
        _f: POLLINTERVAL,

        get: function(path) {
            if(!path || path === undefined) path = Hasher.path;

            var a = path.indexOf(Hasher._p),
                b = path.lastIndexOf(Hasher._a);

            if(a < 0) a = 0;
            else a+=Hasher._p.length;
            if(b <= 0) b = path.length;   

            return path.substr(a,b);
        },
        set: function(path){
            if(Hasher.path !== path){
                var old = Hasher.path;
                Hasher.path = path; 
                Hasher.onChange(Hasher.get(path), Hasher.get(old));
            }
        },
        update: function(path){

            if(Object.prototype.toString.call(path) === '[object Array]'){
                path = Hasher.arrayToPath(path);
            } else {
                path = Hasher._p + Array.prototype.join.call(arguments,Hasher._s) + Hasher._a;
            }    

            if(path !== Hasher.path){
                Hasher.set(path); 
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
        toArray: function(path){
            return Hasher.get(path).split(Hasher._s);
        },
        arrayToPath: function(array){
            var h = Hasher._p + array.join(Hasher._s) + Hasher._a;

            return h;
        },
        start: function(){
            var i = 0;  

            Hasher.path = Hasher.uri();

            /* configure hash divisors */
            if(typeof arguments[i] === 'string') Hasher._p = arguments[i++];
            if(typeof arguments[i] === 'string') Hasher._s = arguments[i++];
            if(typeof arguments[i] === 'string') Hasher._a = arguments[i++];

            /* event callbacks */
            if(typeof arguments[i] === 'function') Hasher.onStart = arguments[i++];
            if(typeof arguments[i] === 'function') Hasher.onChange = arguments[i++];

            /* poll interval in msec (used in fallback mode only) */
            if(typeof arguments[i] === 'number') Hasher._f = arguments[i++];

            if(window.hasOwnProperty('onhashchange')) {
                addListener(window, 'hashchange', Hasher.event);
            } else {
                /* fallback mode */
                Hasher._timer = setInterval(Hasher.event, Hasher._f);
            }

            if(Hasher.onStart) Hasher.onStart(Hasher.get());
        },
        stop: function() {
            if(window.hasOwnProperty('onhashchange')) {
                removeListener(window, 'hashchange', Hasher.event);
            } else {
                clearInterval(Hasher._timer);
                delete Hasher._timer;
            }
        },

    }; 
   
    if (typeof exports === 'object') {  
        module.exports = Hasher;
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return Hasher; });
    } else { global.Hasher = Hasher; }

}(this));