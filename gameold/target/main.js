define(["gameinit","v3d"],function(e,t){"use strict";return function(){var n,o,i,a=new e,s=document.getElementById("container"),r=1/60,d=a.getObj("v3d"),c=0,h=0,l=0,g=0,m=.01*d.w,u=.01*d.h,v=d.w-m,w=m,y=d.h-u,p=u,f=0,b=0,E=0,k=0,T=0;return{init:function(){try{window.oncontextmenu=function(){return!1},window.addEventListener("resize",this.onWindowResize,!1),n=document.getElementById("accel");document.getElementById("accelCont"),document.getElementById("tapaccel"),document.getElementById("mobcon");a.createWorld(r),a.lgd(1),o=!1,d.initLight(),d.initPoints(),10!==settingsarr[6]&&(l=d.w/2,g=d.h/2,f=d.w/2,b=d.h/2);var e=navigator.userAgent;e.match(/Android/i)||e.match(/webOS/i)||e.match(/iPhone/i)||e.match(/iPad/i)||e.match(/iPod/i)||e.match(/BlackBerry/i)||e.match(/Windows Phone/i)?(d.ismobile=!0,this.loadMobileEvents(e)):this.loadEvents()}catch(e){document.getElementById("loadingScreen").style.display="none";var t=document.getElementById("errScreen");t.style.display="block",t.innerHTML='<div id="errdiv">Sorry drone war 1 is not available at this time </div>'}},handleKeyDown:function(e){if(e.preventDefault(),70==e.keyCode&&document.body.webkitRequestFullScreen(),settingsarr.indexOf(e.keyCode)!==-1){var t=a.getObj("keys");t[e.which]=1}},handleKeyUp:function(e){var t=a.getObj("keys");t[e.which]=0,e.keyCode!=settingsarr[1]&&e.keyCode!=settingsarr[2]||settingsarr[4]&&(d.thruster.stop(),d.pThrust=0)},handleMouseMove:function(e){0===t.mm&&(t.mm=1),10===settingsarr[6]||"mobcon"!=e.target.id?("mobcon"==e.target.id?(c=(e.pageX-mobcon.offsetLeft)/13*100,h=(e.pageY-mobcon.offsetTop)/13*100,l=c,g=h,t.clientx=c,t.clienty=h):(c=e.clientX,h=e.clientY,l=e.clientX,g=e.clientY,t.clientx=e.clientX,t.clienty=e.clientY),t.msePos.set(c/d.w*2-1,2*-(h/d.h)+1,.5),t.pageX=c,t.pageY=h,l>v?d.startRot=1:l<w?d.startRot=1:g>y?d.startRot=1:g<p?d.startRot=1:d.startRot=0):(f=(e.pageX-mobcon.offsetLeft)/13*100,b=(e.pageY-mobcon.offsetTop)/13*100,T||(T=setInterval(this.updateLookSen,16)))},updateLookSen:function(){E=f/d.w*2-1,k=2*-(b/d.h)+1,l<d.w&&l>0&&(l+=settingsarr[6]*E),g<d.h&&g>0&&(g+=-settingsarr[6]*k),l>=d.w&&(l=d.w-1),l<=0&&(l=1),g>=d.h&&(g=d.h-1),g<=0&&(g=1),t.msePos.set(l/d.w*2-1,2*-(g/d.h)+1,.5),t.pageX=l,t.pageY=g,l>v?d.startRot=1:l<w?d.startRot=1:g>y?d.startRot=1:g<p?d.startRot=1:d.startRot=0},showWebAppPage:function(e){if(e.target.id.match("yesplease")){a.gspause()||a.gspause(1),document.getElementById("level1Img").style.display="none",document.getElementById("page").style.display="block",document.getElementById("game-content").style.display="none";var t={target:{id:"wanav"}};navFunc(t)}document.getElementById("popup").style.display="none"},loadEvents:function(){window.addEventListener("keydown",this.handleKeyDown,!1),window.addEventListener("keyup",this.handleKeyUp,!1),window.scrollTo(0,document.body.clientHeight),window.addEventListener("mousemove",this.handleMouseMove,!1)},loadMobileEvents:function(e){function n(){event.preventDefault();for(var e=0;e<event.changedTouches.length;e++)"addforce"==event.changedTouches[e].target.id&&(l[settingsarr[1]]=1),"minusforce"==event.changedTouches[e].target.id&&(l[settingsarr[2]]=1),"gamecanvas"==event.changedTouches[e].target.id&&(o?(l[settingsarr[0]]=0,o=0):(l[settingsarr[0]]=1,o=1))}function r(){event.preventDefault();for(var e=0;e<event.changedTouches.length;e++)"addforce"==event.changedTouches[e].target.id&&(l[settingsarr[1]]=0,settingsarr[4]&&(d.thruster.stop(),d.pThrust=0)),"minusforce"==event.changedTouches[e].target.id&&(l[settingsarr[2]]=0,settingsarr[4]&&(d.thruster.stop(),d.pThrust=0)),"mobcon"==event.changedTouches[e].target.id&&(mobcon.style.opacity="1")}function c(){event.preventDefault();for(var e=0;e<event.changedTouches.length;e++)"mobcon"==event.changedTouches[e].target.id&&(i.handleMouseMove(event.changedTouches[e]),mobcon.style.opacity="0.1")}function h(){event.preventDefault(),T&&(clearInterval(T),T=0)}i=this,mobcon.style.display="block";var l=a.getObj("keys");if(e.match(/iPhone/))if(t.bincam){var g=5;d.camdist=4.9}else{var g=.1;d.camdist=.09}if(e.match(/iPad/))if(t.bincam){var g=7;d.camdist=6.9}else{var g=.1;d.camdist=.09}d.camera.position.z=g,d.tmpsightz=g*-1,d.tmpVCPprev=new d.tvec(0,0,g);var m=document.getElementById("addforce"),u=document.getElementById("minusforce");m.style.display="block",u.style.display="block",s.addEventListener("touchstart",n,!1),s.addEventListener("touchend",r,!1),s.addEventListener("touchmove",c,!1),s.addEventListener("touchend",h,!1)},onWindowResize:function(){d.camera.aspect=window.innerWidth/window.innerHeight,d.camera.fov=360/Math.PI*Math.atan(d.tanFOV*(window.innerHeight/window.innerHeight)),d.camera.updateProjectionMatrix(),d.renderer.setSize(window.innerWidth,window.innerHeight),d.h=window.innerHeight,d.w=window.innerWidth,m=.01*d.w,u=.01*d.h,v=d.w-m,w=m,y=d.h-u,p=u,d.controls.handleResize()}}}});