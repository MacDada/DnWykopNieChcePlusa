/*!
Wykop Suggest
*/
(function($){$.suggest=function(input,options){var $input=$(input).attr("autocomplete","off");var $results=$(document.createElement("ul"));var timeout=false;var prevLength=0;var cache=[];var cacheSize=0;var ids={};var cursorPos=0;$results.addClass(options.resultsClass).appendTo('body');resetPosition();$(window).load(resetPosition).resize(resetPosition);$input.blur(function(){setTimeout(function(){$results.hide();},200);});try{$results.bgiframe();}catch(e){}
$input.keydown(emptyProcessKey);$input.keyup(processKey);function resetPosition(){var offset=$input.offset();$results.css({top:(offset.top+input.offsetHeight)+'px',left:offset.left+'px'});}
function emptyProcessKey(e)
{if(/^13$/.test(e.keyCode)&&$results.is(':visible')&&!getCurrentResult()&&typeof(wykop.params.submitOnEnter)!="undefined"&&wykop.params.submitOnEnter)
{$results.hide();}else if((/27$|38$|40$/.test(e.keyCode)&&$results.is(':visible'))||(/^13$|^9$/.test(e.keyCode)&&getCurrentResult())){if(e.preventDefault)
e.preventDefault();if(e.stopPropagation)
e.stopPropagation();}}
function processKey(e){if(/^13$/.test(e.keyCode)&&$results.is(':visible')&&!getCurrentResult()&&typeof(wykop.params.submitOnEnter)!="undefined"&&wykop.params.submitOnEnter)
{$results.hide();}else if((/27$|38$|40$/.test(e.keyCode)&&$results.is(':visible'))||(/^13$|^9$/.test(e.keyCode)&&getCurrentResult())){if(e.preventDefault)
e.preventDefault();if(e.stopPropagation)
e.stopPropagation();e.cancelBubble=true;e.returnValue=false;switch(e.keyCode){case 38:prevResult();break;case 40:nextResult();break;case 9:case 13:selectCurrentResult();break;case 27:$results.hide();break;}}else if($input.val().length!=prevLength){if(timeout)
clearTimeout(timeout);timeout=setTimeout(suggest,options.delay);prevLength=$input.val().length;}}
function suggest(){cursorPos=$input.getSelectionStart();var q=options.ignoreSpaces?[$input.val()]:$input.val().substr(0,cursorPos).split(/\s+/g);q=$.trim(q[q.length-1]);if(q.length>=options.minchars&&(!options.natural||q.substr(0,1)=="#"||q.substr(0,1)=="@")){cached=checkCache(q);if(cached){displayItems(cached['items']);}else{$.get(options.source+'?search_text='+escape(q),{},function(txt){$results.hide();var items=parseJSON(txt,q);displayItems(items);addToCache(q,items,txt.length);},'json');}}else{$results.hide();}}
function checkCache(q){for(var i=0;i<cache.length;i++)
if(cache[i]['q']==q){cache.unshift(cache.splice(i,1)[0]);return cache[0];}
return false;}
function addToCache(q,items,size){while(cache.length&&(cacheSize+size>options.maxCacheSize)){var cached=cache.pop();cacheSize-=cached['size'];}
cache.push({q:q,size:size,items:items});cacheSize+=size;}
function displayItems(items)
{if(!items.html)return;if(items.size==0)
{$results.hide();if(options.emptyCallback)
{options.emptyCallback($input.val());}
return;}
var html=items.html;$results.html(html).show(0,resetPosition);$results.children('li').mouseover(function(){$results.children('li').removeClass(options.selectClass);$(this).addClass(options.selectClass);}).click(function(e){e.preventDefault();e.stopPropagation();selectCurrentResult();});if(options.autoSelectIfOne&&items.length==1&&items[0].match(/>$/i))
{nextResult();selectCurrentResult();}}
function parseJSON(json,q){return json;}
function getCurrentResult(){if(!$results.is(':visible'))
return false;var $currentResult=$results.children('li.'+options.selectClass);if(!$currentResult.length)$currentResult=false;return $currentResult;}
function selectCurrentResult(){$currentResult=getCurrentResult();if($currentResult){if(options.followLink)
{location.href=$currentResult.find("a").attr("href");}else if(options.resultCallback)
{options.resultCallback($currentResult.text(),ids[$currentResult.text()],$input);}else if(options.addAfterExisting||options.natural)
{var textBefore=$input.val().substr(0,cursorPos);var textAfter=$input.val().substr(cursorPos);var q=textBefore.split(/\s+/g);q=$.trim(q[q.length-1]);$input.val(textBefore.substring(0,textBefore.length-q.length)+$currentResult.data().content+(textAfter.length>0&&textAfter.substr(0,1)!=" "?" ":"")+textAfter);$input.change();$input.setCursorPosition($input.val().length-textAfter.length);}else{$input.val($currentResult.data().content);$input.change();}
$results.hide();if(options.onSelect)
options.onSelect.apply($input[0]);}}
function nextResult(){$currentResult=getCurrentResult();if($currentResult){$currentResult.removeClass(options.selectClass).next().addClass(options.selectClass);}else{$results.children('li:first-child').addClass(options.selectClass);}}
function prevResult(){$currentResult=getCurrentResult();if($currentResult){$currentResult.removeClass(options.selectClass).prev().addClass(options.selectClass);}else{$results.children('li:last-child').addClass(options.selectClass);}}};$.fn.suggest=function(source,options){if(!source)
return;options=options||{};options.source=source;options.delay=options.delay||100;options.resultsClass=options.resultsClass||'ac_results';options.selectClass=options.selectClass||'ac_over';options.matchClass=options.matchClass||'ac_match';options.minchars=options.minchars||3;options.delimiter=options.delimiter||'\n';options.onSelect=options.onSelect||false;options.maxCacheSize=options.maxCacheSize||65536;options.addAfterExisting=options.addAfterExisting||false;options.natural=options.natural||false;options.observing=options.observing||false;options.resultCallback=options.resultCallback||false;options.ignoreSpaces=options.ignoreSpaces||false;options.autoSelectIfOne=options.autoSelectIfOne||false;options.emptyCallback=options.emptyCallback||false;options.followLink=options.followLink||false;this.each(function(){new $.suggest(this,options);});return this;};})(jQuery);jQuery.fn.getSelectionStart=function(){input=this[0];if(typeof input==="undefined")
{return 0;}
var pos=input.selectionStart;return pos;};
