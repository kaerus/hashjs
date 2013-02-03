/*
 * Hashjs http://github.com/kaerus/hashjs
 * Released under the MIT License, feel free to use, share and modify. 
 */

(function (global) {
    "use strict"

    var PREPEND = '/', SEPARATE = '/', APPEND = '';

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

        get: function(path) {
            if(!path || path === undefined) return Hasher.path;

            var a = path.indexOf(Hasher._p),
                b = path.lastIndexOf(Hasher._a);

            if(a === b) a = 0; 
            if(a < 0) a = 0;
            if(b < 0) b = path.length;   

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
        toArray: function(){
            return Hasher.path.split(Hasher._s);
        },
        arrayToHash: function(a){
            var h = Hasher._p + a.join(Hasher._s) + Hasher._a;

            return h;
        },
        start: function(args){
            var p;  

            Hasher.path = Hasher.uri();

            if( typeof args === 'object' ) {
                p = args.poll;
                Hasher._a = args.append || APPEND;
                Hasher._p = args.prepend || PREPEND;
                Hasher._s = args.separate || SEPARATE;
                Hasher.onStart = args.onStart || Hasher.onStart;
                Hasher.onChange = args.onChange || Hasher.onChange;
            }
            if(window.hasOwnProperty('onhashchange')) {
                addListener(window, 'hashchange', Hasher.event);
            } else {
                // fallback mode
                Hasher._timer = setInterval(Hasher.event, p||250);
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