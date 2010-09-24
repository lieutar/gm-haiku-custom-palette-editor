// ==UserScript==
// @name        Haiku Custom Palette EDITor
// @namespace   http://www.hatena.ne.jp/lieutar/
// @include     http://wedata.net/items/*
// ==/UserScript==

location.href = "javascript:"+encodeURIComponent(uneval(
function () {
if(!String($('h2').get(0).firstChild.nodeValue).
   match(/hatena-CustomPalletForHaiku/)) return;

var N_0 = "0".charCodeAt(0);
var N_9 = "9".charCodeAt(0);
var A_A = "a".charCodeAt(0);
var HEX = '0123456789ABCDEF';

var rgb = function(name){
  var c = String(name).toLowerCase().
	    match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/);
  return ({ r: unhexlify(c[1]) / 255,
	    g: unhexlify(c[2]) / 255,
	    b: unhexlify(c[3]) / 255 } );
};

var unhexlify = function(src){
  var c = src.charCodeAt(0);
  var d = src.charCodeAt(1);
  var R = (( d > N_9 ? (10 + d - A_A) : d - N_0 ) +
	   16 * ( c > N_9 ? (10 + c - A_A) : c - N_0 ));
  return R;
};

var hexlify = function(n){
  var y = Math.round(n);
  return HEX.charAt(Math.floor(y / 16)) + HEX.charAt(y % 16);
};

var gray = function(v){
  var y = Math.round(255 * v);
  var p = hexlify(y);
  return p + p + p;
};

var hue = function(c){
  if(c.r == c.g && c.g == c.b) return '999999';
  if(c.r > c.g){
    if(c.g > c.b){
      // r > g > b
      return hexlify(255) + hexlify(255 * c.g / c.r) + hexlify(0);
    }else if(c.r > c.b){
      // r > b > g
      return hexlify(255) + hexlify(0) + hexlify(255 * c.b / c.r);
    }else {
      // b > r > g
      return hexlify(255 * c.r / c.b) + hexlify(0) + hexlify(255);
    }
  }else{
    if(c.r > c.b){
      // g > r > b
      return hexlify(255 * c.r / c.g) + hexlify(255) + hexlify(0);
    }else if(c.g > c.b){
      // g > b > r
      return hexlify(0) + hexlify(255) + hexlify(255 * c.b / c.g);
    }else{
      // b > g > r
      return hexlify(0) + hexlify(255 * c.g / c.b) + hexlify(255);
    }
  }
};

var saturation = function(c){
  var max = Math.max(c.r, c.g, c.b);
  var min = Math.min(c.r, c.g, c.b);
  return gray((max - min)/max);
};

var value = function(c){
  return gray( c.r * 0.29891 + c.g * 0.58661 + c.b * 0.11448 );
};

var clear = function(e){
  while(e.firstChild) e.removeChild(e.lastChild);
};

var makepeace = function(parent){
  var peace = document.createElement('div');
  parent.appendChild(peace);
  peace.style.cssText =
      'float: left;' +
      'width: 10px; height:16px;' +
      'text-align: center;' +
      'font-weight: 900';
  return peace;
};

var modifySample = function(coldata){
  if(coldata == preColors) return;
  preColors = coldata;
  clear(sample);
  clear(ssample);
  clear(hsample);
  clear(vsample);
  var colors = coldata.split(/\s+/);
  for(var i=0,l=colors.length;i<l;i++){
    var color = colors[i];
    var peace  = makepeace(sample);
    var hpeace = makepeace(hsample);
    var speace = makepeace(ssample);
    var vpeace = makepeace(vsample);
    hpeace.style.height = '8px';
    speace.style.height = '8px';
    peace.style.height = '32px';
    if(color.match(/^[A-Fa-f0-9]{6}$/)){
      var c     = rgb(color);
      peace.style.backgroundColor = '#'+ color;
      vpeace.style.backgroundColor = '#' + value(c);
      speace.style.backgroundColor = '#' + saturation(c);
      hpeace.style.backgroundColor = '#' + hue(c);
    }else{
      peace.appendChild(document.createTextNode('?'));
      vpeace.appendChild(document.createTextNode('?'));
      hpeace.appendChild(document.createTextNode('?'));
    }
  }
};



var textarea = $('textarea').get(0);
if(!textarea || textarea.id != 'data[colors]') return;

textarea.style.fontSize = '11px';
textarea.rows = 25;
var sample  = document.createElement('div');
var vsample = document.createElement('div');
var hsample = document.createElement('div');
var ssample = document.createElement('div');
textarea.parentNode.insertBefore(sample, textarea);
sample.parentNode.insertBefore(vsample, sample);
vsample.parentNode.insertBefore(hsample, vsample);
hsample.parentNode.insertBefore(ssample, hsample);
var preColors = '';
vsample.style.clear = ssample.style.clear =
    hsample.style.clear = sample.style.clear = 'left';

(function(){
   modifySample(textarea.value);
   setTimeout(arguments.callee, 100);
})();


})) + '()';
