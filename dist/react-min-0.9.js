/*!
 * React for JavaScript - an easy-rerender template language
 * Version 0.9, http://github.com/marcusphillips/react
 *
 * Copyright 2010, Marcus Phillips
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(){var b;var a={nodes:{},scopes:{},_matchers:{directiveDelimiter:/\s*,\s*/,space:/\s+/,isString:/(^'.*'$)|(^".*"$)/,negation:/!\s*/,isNumber:/\d+/},name:function(d,c){this.scopes[d]=c},getNodeKey:function(c){return(c.reactKey=c.reactKey||js.util.unique("reactNode"))},getScopeKey:function(c){return(c.reactKey=c.reactKey||js.util.unique("reactObject"))},getObjectKey:function(){throw new Error("This method is deprecated - please use getScopeKey() instead")},set:function(c,d,e){c[d]=e;this.changed(c,d)},changed:function(c,e){if(arguments.length<2){for(e in c){this.changed(c,e)}return}if(!c||!c.observers||!c.observers[e]){return}for(var d in c.observers[e]){this._checkListener(c,e,d)}},_checkListener:function(c,e,d){var f=this._interpretListenerString(d);if(!this._listenerIsStillValid(f,c,e)){return}js.errorIf(f.directive[0]==="bindItem","you need recalculations for bindItem (when the key was an itemAlias), but those aren't implemented yet");if(js.among(["within","withinEach","withinItem","for"],f.directive[0])){this._updateTree({node:f.node,fromDirective:f.directiveIndex});return}this._followDirective(f.directive,js.create(this.commands,{node:f.node,scopeChain:f.scopeChain,directiveIndex:f.directiveIndex}))},_interpretListenerString:function(c){var e=c.split(" ");var d=this.nodes[e[0]];var f=+e[1];return{node:d,directiveIndex:f,prefix:e[2],directive:this._getDirectives(d)[f],scopeChain:this._buildScopeChainForNode(d,f)}},_listenerIsStillValid:function(e,c,d){return c===this._lookupInScopeChain(e.prefix+d,e.scopeChain,{returnObject:true})},_buildScopeChainForNode:function(d,f){var k=$(Array.prototype.reverse.apply($(d).parents())).add(d);for(var c=0;c<k.length;c++){var j=k[c];var e=this._getDirectives(j);var g=this._buildScopeChainFromAnchorNames(e.anchored,g);for(var i=0;i<e.length;i++){if(j===d&&(f||0)<=i){break}if(!g){continue}var h=e[i].shift();if(this._extendScopeChainBasedOnDirective[h]){g=this._extendScopeChainBasedOnDirective[h](g,e[i])}}}return g},_buildScopeChainFromAnchorNames:function(e,d){if(e){for(var f=1;f<e.length;f++){var c=e[f];js.errorIf(!this.scopes[c],"could not follow anchored directive, nothing found at react.scopes."+c);d=this._extendScopeChain(d,this.scopes[c],{type:"anchor",key:c})}}return d},_buildScopeChain:function(e,c){c=c||{};var d=c.prefix;if(e){for(var f=0;f<e.length;f++){d=this._extendScopeChain(d,e[f],c)}}return d},_extendScopeChain:function(d,e,c){c=c||{};return{parent:d,scope:e,type:c.type,key:c.key,anchorKey:c.type==="anchor"?c.key:(d||{}).anchorKey}},update:function(){return this._updateTree.apply(this,arguments)},_updateTree:function(e){e=e||{};if(e.nodeType){e={node:arguments[0],scope:arguments[1]}}var c=e.node;js.errorIf(e.scope&&e.scopes,"you must supply only one set of scopes");var d=Array.prototype.slice.apply(c.querySelectorAll("[react]"));var g=js.create(this.commands,{enqueueNodes:function(k){d=d.concat(k);for(var i=0;i<k.length;i++){delete g.bequeathedScopeChains[this.getNodeKey(k[i])];delete g.loopItemTemplates[this.getNodeKey(k[i])]}},bequeathedScopeChains:{},loopItemTemplates:{}});var j=e.scope?[e.scope]:e.scopes?e.scopes:b;if(e.anchor){this.anchor({node:c,scopes:j});j=b}var h=this._buildScopeChain(j,{type:"updateInputs",prefix:this._buildScopeChainForNode(c,e.fromDirective||0)});g.bequeathedScopeChains[this.getNodeKey(c)]=this._updateNodeGivenScopeChain(c,h,g,e.fromDirective);for(var f=0;f<d.length;f++){this._updateNode(d[f],g)}return c},_getParent:function(e,d){var c=$(e).parent()[0];var f=1000;while(f--){if(!c||c===document){return false}else{if(c.getAttribute("react")||d.bequeathedScopeChains[this.getNodeKey(c)]||d.loopItemTemplates[this.getNodeKey(c)]){return c}}c=$(c).parent()[0]}js.error("_getParent() broke")},_updateNode:function(h,f){var e=this.getNodeKey(h);if(typeof f.bequeathedScopeChains[e]!=="undefined"){return}if(f.loopItemTemplates[this.getNodeKey(h)]){f.bequeathedScopeChains[e]=false;return}var c="unmatchable";var g=this._getParent(h,f);while(g!==c){if(!g){f.bequeathedScopeChains[e]=false;return}this._updateNode(g,f);if(f.bequeathedScopeChains[this.getNodeKey(g)]===false){f.bequeathedScopeChains[e]=false;return}c=g;g=this._getParent(h,f)}var d=f.bequeathedScopeChains[this.getNodeKey(g)];f.bequeathedScopeChains[e]=this._updateNodeGivenScopeChain(h,d,f)},_updateNodeGivenScopeChain:function(j,c,g,h){var e=this.getNodeKey(j);var k=this._getDirectives(j);var d=function(l,i){c=this._extendScopeChain(c,l,i)};for(var f=h||0;f<k.length;f++){this._followDirective(k[f],js.create(g,{node:j,directiveIndex:f,scopeChain:c,pushScope:d}))}return c},_getDirectives:function(f){var c=(f.getAttribute("react")||"").split(this._matchers.directiveDelimiter);var e=this;var g=js.map(c,function(i,h){return js.trim(h).replace(e._matchers.negation,"!").split(e._matchers.space)});if(g[0]&&g[0][0]==="anchored"){var d=g.shift()}g=js.filter(g,function(h){return !!h[0]});g.anchored=d;return g},_setDirectives:function(e,f){var d=f.anchored;f=js.filter(f,function(g){return !!g[0]});f.anchored=d;if(f.anchored){f.unshift(f.anchored)}var c=js.map(f,function(h,g){return g.join(" ")});e.setAttribute("react",c.join(", "))},_prependDirective:function(c,e){var d=this._getDirectives(c);d.unshift(e);this._setDirectives(c,d)},_followDirective:function(f,d){try{var e=f.shift();js.errorIf(!this.commands[e],e+" is not a valid react command");this.commands[e].apply(d,f)}catch(c){var f=this._getDirectives(d.node)[d.directiveIndex];js.log("Failure during React update: ",{"original error":c,"while processing node":d.node,"index of failed directive":d.directiveIndex,"directive call":f[0]+"("+f.slice(1).join(", ")+")","scope chain description":this._describeScopeChain(d.scopeChain),"(internal scope chain object) ":d.scopeChain});throw c}},_describeScopeChain:function(c){var d=[];do{d.push(["scope: ",c.scope,", type of scope shift: "+c.type+(c.key?"(key: "+c.key+")":"")+(c.anchorKey?", anchored to: "+c.anchorKey+")":"")])}while(c=c.parent);return d},anchor:function(e){e=e||{};if(e.nodeType){e={node:arguments[0],scope:arguments[1]}}var h=e.node;var g=e.scope?[e.scope]:e.scopes;var d=this.getNodeKey(h);this.nodes[d]=h;var j=this._getDirectives(h);j.anchored=["anchored"];for(var f=0;f<g.length;f++){var c=this.getScopeKey(g[f]);this.scopes[c]=g[f];j.anchored.push(c)}this._setDirectives(h,j);return e.node},_observeScope:function(f,i,k,e,h,d,j){var g=this.getNodeKey(e);this.nodes[g]=e;var c=e["directive "+h+" observes"]=e["directive "+h+" observes"]||[];c.push({object:f,key:k,didMatch:j});f.observers=f.observers||{};f.observers[k]=f.observers[k]||{};f.observers[k][g+" "+h+" "+i]=true},_disregardScope:function(f,h){var d=this.getNodeKey(f);var g=f["directive "+h+" observes"];for(var e=0;e<g.length;e++){var c=g[e];delete c.object.observers[c.key][d+" "+h]}delete nodes.observing[h];if(!js.size(nodes.observing)){delete this.nodes[d]}},_Fallthrough:function(c){this.key=c},_lookupInScopeChain:function(i,g,k){if(!g){return}k=k||{};var e;var h;if(i[0]==="!"){e=true;i=i.slice(1)}if(this._matchers.isString.test(i)){return i.slice(1,i.length-1)}var j=i.split(".");var d=j.shift();do{var c=g.scope;h=c[d];if(g.anchorKey&&k.listener&&!k.suppressObservers){this._observeScope(c,"",d,k.listener.node,k.listener.directiveIndex,g.anchorKey,h!==b)}if(h instanceof this._Fallthrough){d=h.key}else{if(h!==b){break}}}while((g=g.parent));var f=d+".";while(j.length){c=h;if(c===b||c===null){return k.returnObject?false:js.error("can't find keys "+j.join(".")+" on an undefined object")}if(g.anchorKey&&!k.returnObject&&!k.suppressObservers){this._observeScope(c,f,j[0],k.listener.node,k.listener.directiveIndex,g.anchorKey,true)}f=f+j[0]+".";h=c[j.shift()]}if(k.returnObject){return c}if(typeof h==="function"){h=h.call(c)}return e?!h:h}};a.integrate={jQuery:function(){jQuery.fn.update=function(c){a.update(this,c)}}};a._extendScopeChainBasedOnDirective=js.create(a,{within:function(d,c){return this._extendScopeChain(d,this._lookupInScopeChain(c[0],d,{suppressObservers:true}),{type:"within",key:c[0]})},withinItem:function(d,c){return this._extendScopeChain(d,this.scopeChain.scope[c[0]],{type:"withinItem",key:c[0]})},bindItem:function(e,d){var c={};if(d.length===3){c[d[1]]=d[0]}c[js.last(d)]=new this._Fallthrough(d[0]);return this._extendScopeChain(e,c,{type:"itemBindings",key:d[0]})}}),a.commands=js.create(a,{lookup:function(d,c){c=c||{};c.listener={node:this.node,directiveIndex:this.directiveIndex};return this._lookupInScopeChain(d,this.scopeChain,c)},anchored:function(c){this.pushScope(this.scopes[c],{type:"anchor",key:c})},within:function(c){this.pushScope(this.lookup(c),{type:"within",key:c})},contain:function(c){this.node.innerHTML="";var d=this.lookup(c);jQuery(this.node)[d&&d.nodeType?"append":"text"](d)},classIf:function(c,e){this.node.classIfs=this.node.classIfs||{};var g=this.lookup(c);var d;var f=c+" "+e;if(g){d=this.lookup(e);if(d){$(this.node).addClass(d);this.node.classIfs[f]=d}}else{d=this.node.classIfs[f]||this.lookup(e);if(d){$(this.node).removeClass(d);delete this.node.classIfs[f]}}},_createItemNodes:function(f){var j=jQuery(this.node).children();js.errorIf(j.length<2,"looping nodes must contain at least 2 children - one item template and one results container");var k=j.first();k.addClass("reactItemTemplate");this.loopItemTemplates[this.getNodeKey(k[0])]=k[0];var m=$(j[1]);var l=m.children();var g=this.scopeChain.scope;js.errorIf(g===null||g===b,"The loop command expected a collection, but instead encountered "+g);var h=[];for(var e=0;e<g.length;e++){var c=l[e];if(!c){c=k.clone().removeClass("reactItemTemplate")[0];js.errorIf(this._matchers.space.test(e),"looping not currently supported over colletions with space-filled keys");var d=f(e);this._prependDirective(c,d);this.enqueueNodes([c].concat(Array.prototype.slice.apply(c.querySelectorAll("[react]"))))}h.push(c)}if(g.length!==l.length){m.html(h)}},withinEach:function(){this._createItemNodes(function(c){return["withinItem",c]})},withinItem:function(c){js.errorIf(this.scopeChain.scope.length-1<+c,"Tried to re-render a node for an index the no longer exists");js.errorIf(!this.scopeChain.scope[c],"Could not find anything at key "+c+" on the scope object");this.within(c)},"for":function(d,e){var c=arguments;this._createItemNodes(function(f){return["bindItem",f].concat(Array.prototype.slice.call(c))})},bindItem:function(d,e,f){if(f===b){f=e;e=b}var c={};if(e!==b){c[e]=d}c[f]=new this._Fallthrough(d);this.pushScope(c,{type:"bindItem",key:d})},showIf:function(c){jQuery(this.node)[this.lookup(c)?"show":"hide"]()},visIf:function(c){jQuery(this.node).css("visibility",this.lookup(c)?"visible":"hidden")},attr:function(c,d){js.errorIf(arguments.length!==2,"the attr directive requires 2 arguments");c=this.lookup(c);d=this.lookup(d);if(!js.among(["string","number"],typeof c)){js.log("bad attr name: ",c);js.error("expected attr name token "+c+" to resolve to a string or number, not "+typeof c)}else{if(!js.among(["string","number"],typeof d)){js.log("bad attr value: ",d);js.error("expected attr value token "+d+" to resolve to a string or number not, not "+typeof d)}}jQuery(this.node).attr(c,d)},attrIf:function(e,c,d){if(this.lookup(e)){$(this.node).attr(this.lookup(c),this.lookup(d))}else{$(this.node).removeAttr(this.lookup(c))}},checkedIf:function(c){$(this.node).attr("checked",this.lookup(c))}});window.react=a}());