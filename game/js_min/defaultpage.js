function xhrSuccess(){this.callback.apply(this,this.arguments)}function xhrError(){console.error(this.statusText)}function loadFile(e,t){var n=new XMLHttpRequest;n.callback=t,n.arguments=Array.prototype.slice.call(arguments,2),n.onload=xhrSuccess,n.onerror=xhrError,n.open("get",e,!0),n.responseType="arraybuffer",n.send(null)}function decodeSucc(e){this.callback.apply(this.this.arguments)}function decodeErr(){console.error(this.statusText)}function bufferSound(e){console.log(" load sounds ");audiocntxt.decodeAudioData(this.response,function(e){if(e.duration>3&&e.duration<3.1)var t="thruster";if(e.duration>9.1&&e.duration<9.15)var t="droneExpl";if(e.duration>14.1&&e.duration<14.15)var t="pdown";if(e.duration>81.86&&e.duration<81.88)var t="droneAudio";sourceObj[t].buffer=e,sourceObj[t].connect(audiocntxt.destination),sourcenum2+=1,4===sourcenum2&&console.log("load all sounds")})}function initgame(){var e=navigator.userAgent.match("Chrome");audiocntxt=e?new AudioContext:new webkitAudioContext,masterGain=audiocntxt.createGain(),masterGain.connect(audiocntxt.destination),sourceObj.droneExpl=audiocntxt.createBufferSource(),sourceObj.droneAudio=audiocntxt.createBufferSource(),sourceObj.pdown=audiocntxt.createBufferSource(),sourceObj.thruster=audiocntxt.createBufferSource(),loadFile("audio/droneExpl.wav",bufferSound,"loaded droneExpl\n\n"),loadFile("audio/droneAudio.mp3",bufferSound,"loaded droneAudio\n\n"),loadFile("audio/pdown.mp3",bufferSound,"loaded pdown\n\n"),loadFile("audio/thrusters.wav",bufferSound,"loaded thrusters\n\n"),runGame()}function setSoundFx(e){var t=e.currentTarget;"on"==t.value?(t.value="off",t.style.background="#000000",soundFX=0):(t.value="on",t.style.background="#00b300",soundFX=1)}function runGame(){for(var e=document.getElementsByName("radio_3698130"),t=0,n=e.length;t<n;t++)if(e[t].checked){document.getElementById("insideship").value=e[t].value;break}document.body.className+=" custom-background-image";var a=document.getElementById("page");a.style.display="none";var o=document.getElementById("game-content");o.style.display="block";var d=document.createElement("script");d.type="text/javascript",d.src="js_min/require.js",d.setAttribute("data-main","js_min/config.js");var r=document.getElementsByTagName("head")[0];r.appendChild(d)}function navFunc(e){var t=e.target;if(t.id.match("dwnav")){var n=document.getElementById("dronewar1");n.style.display="block",document.getElementById("dwli").className="current-menu-item";var a=document.getElementById("web_app");a.style.display="none",document.getElementById("wali").className=""}if(t.id.match("wanav")){var n=document.getElementById("dronewar1");n.style.display="none",document.getElementById("dwli").className="",n.className="";var a=document.getElementById("web_app");a.style.display="block",document.getElementById("wali").className="current-menu-item"}if("titleLink"==t.id||"bannerImg"==t.id){var o={target:{id:"dwnav"}};navFunc(o)}return!1}function updateNav(e){var t=document.getElementById("site-header-menu"),n=e.target.className;n.match("toggled-on")&&(e.target.className="menu-toggle",t.className="site-header-menu "),n.match("toggled-on")||(e.target.className="menu-toggle toggled-on",t.className="site-header-menu toggled-on")}var url="http://www.dronewar1.com",soundFX=1,audiocntxt,masterGain,sourceObj={},sourcenum2=0,loadgame=document.getElementById("loadGame").addEventListener("click",initgame),startgame=document.getElementById("startGame").addEventListener("click",initgame);document.getElementById("sndfxbutton").addEventListener("click",setSoundFx),document.getElementById("dwnav").addEventListener("click",navFunc),document.getElementById("wanav").addEventListener("click",navFunc),document.getElementById("titleLink").addEventListener("click",navFunc),document.getElementById("bannerLink").addEventListener("click",navFunc),document.getElementById("menu-toggle").addEventListener("click",updateNav),document.getElementById("commentsubmit").addEventListener("submit",function(e){e.preventDefault(),document.getElementById("commentsubmit").disabled=!0;var t=document.getElementById("commentname").value,n=document.getElementById("textarea_1").value,a=new XMLHttpRequest;a.onreadystatechange=function(){4==this.readyState&&200==this.status},a.open("POST",url,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send("name="+t+"&comment="+n);var o=document.getElementById("comnum1").cloneNode(!0);o.id="new_item",o.getElementsByClassName("fn")[0].innerHTML=t;var d=["January","February","March","April","May","June","July","August","September","October","November","December"],r=new Date,u=r.getDate(),c=r.getMonth(),i=r.getFullYear(),l=d[c];l+=1==u?" 1st, ":2==u?" 2nd, ":3==u?" 3rd, ":31==u?" 31st, ":" "+u+"th, ",l+=""+i,o.getElementsByTagName("time")[0].innerHTML=l,o.getElementsByTagName("p")[0].innerHTML=n,document.getElementsByClassName("comment-list")[0].appendChild(o)}),function(){var e=document.getElementById("consoleData");e=JSON.parse(e.value);for(var t=0;t<e.length;t++)dataObj=e[t],console.log("%c"+dataObj,"background: #222; color: #bada55")}();