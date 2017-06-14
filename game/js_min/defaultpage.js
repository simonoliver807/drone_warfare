function xhrSuccess(){this.callback.apply(this,this.arguments)}function xhrError(){console.error(this.statusText)}function loadFile(e,t){var n=new XMLHttpRequest;n.callback=t,n.arguments=Array.prototype.slice.call(arguments,2),n.onload=xhrSuccess,n.onerror=xhrError,n.open("get",e,!0),n.responseType="arraybuffer",n.send(null)}function decodeSucc(e){this.callback.apply(this.this.arguments)}function decodeErr(){console.error(this.statusText)}function bufferSound(e){audiocntxt.decodeAudioData(this.response,function(e){if(e.duration>2&&e.duration<2.5)var t="astex";if(e.duration>9.1&&e.duration<9.15)var t="droneExpl";if(e.duration>81.86&&e.duration<81.88)var t="droneAudio";if(e.duration>14.1&&e.duration<14.15)var t="pdown";if(e.duration>3&&e.duration<3.1)var t="thruster";sourceObj[t].buffer=e,sourceObj[t].connect(audiocntxt.destination),sourcenum2+=1,4===sourcenum2&&console.log("load all sounds")})}function loadmobstyle(){var e=navigator.userAgent;(e.match(/Android/i)||e.match(/webOS/i)||e.match(/iPhone/i)||e.match(/iPad/i)||e.match(/iPod/i)||e.match(/BlackBerry/i)||e.match(/Windows Phone/i))&&(568!=window.innerWidth&&320!=window.innerWidth||(document.getElementById("mobilecss").href="style/i5.css"),667!=window.innerWidth&&375!=window.innerWidth||(document.getElementById("mobilecss").href="style/i6.css"),1024!=window.innerWidth&&768!=window.innerWidth||(document.getElementById("mobilecss").href="style/ipad.css"))}function initgame(e){var t=navigator.userAgent.match("Chrome");audiocntxt=t?new AudioContext:new webkitAudioContext,masterGain=audiocntxt.createGain(),masterGain.connect(audiocntxt.destination),masterGain.gain.value=settingsarr[7]/10,sourceObj.astex=audiocntxt.createBufferSource(),sourceObj.droneExpl=audiocntxt.createBufferSource(),sourceObj.droneAudio=audiocntxt.createBufferSource(),sourceObj.pdown=audiocntxt.createBufferSource(),sourceObj.thruster=audiocntxt.createBufferSource(),loadFile("audio/astex.wav",bufferSound,"loaded astex\n\n"),loadFile("audio/droneExpl.wav",bufferSound,"loaded droneExpl\n\n"),loadFile("audio/droneAudio.mp3",bufferSound,"loaded droneAudio\n\n"),loadFile("audio/pdown.mp3",bufferSound,"loaded pdown\n\n"),loadFile("audio/thrusters.wav",bufferSound,"loaded thrusters\n\n");var n;n=e.target.id.match("loadMultiGame")?1:0,runGame(n)}function setsettings(e){var t=e.target.id,n=document.getElementsByClassName("list-group"),a=t.substring(t.length,t.length-1),d=n[a].children.length,s=document.getElementById("udset");for("none"==s.style.display&&(s.style.display="block",document.getElementById("udsetoff").style.display="none");d--;)n[a].children[d].style.backgroundColor="";t.match("0")&&glowBadge.el&&(glowBadge.el.className="badge badge-default"),"shoot00"==t&&(e.target.style.backgroundColor="#007acc",clearInterval(glowBadge.badgeInterval),glowBadge.setBadge(document.getElementById("sbut"))),"fthrust10"==t&&(e.target.style.backgroundColor="#007acc",clearInterval(glowBadge.badgeInterval),glowBadge.setBadge(document.getElementById("fbut"))),"rthrust20"==t&&(e.target.style.backgroundColor="#007acc",clearInterval(glowBadge.badgeInterval),glowBadge.setBadge(document.getElementById("rbut"))),"pinside31"==t&&(e.target.style.backgroundColor="#007acc",document.getElementById("ibut").className="badge badge-color",document.getElementById("obut").className="badge badge-default",settingsarr[3]=0),"poutside31"==t&&(e.target.style.backgroundColor="#007acc",document.getElementById("obut").className="badge badge-color",document.getElementById("ibut").className="badge badge-default",settingsarr[3]=1),"sfxon42"==t&&(e.target.style.backgroundColor="#007acc",document.getElementById("sfxonbut").className="badge badge-color",document.getElementById("sfxoffbut").className="badge badge-default",settingsarr[4]=1),"sfxoff42"==t&&(e.target.style.backgroundColor="#007acc",document.getElementById("sfxoffbut").className="badge badge-color",document.getElementById("sfxonbut").className="badge badge-default",settingsarr[4]=0),"slin53"==t&&(e.target.style.backgroundColor="#007acc",document.getElementById("slinbut").className="badge badge-color",document.getElementById("sloutbut").className="badge badge-default",settingsarr[5]=1),"slout53"==t&&(e.target.style.backgroundColor="#007acc",document.getElementById("sloutbut").className="badge badge-color",document.getElementById("slinbut").className="badge badge-default",settingsarr[5]=0)}function signup_in(e){e.preventDefault();var t=document.getElementById("usrname").value,n=document.getElementById("psswrd").value,a=document.getElementById("emailinput").value,d=(document.getElementById("loginbutton"),new XMLHttpRequest);d.onreadystatechange=function(){if(4==this.readyState&&200==this.status)if(this.responseText.match("{")){var e=JSON.parse(this.responseText);loadUser(e)}else document.getElementById("valmess").innerHTML=this.responseText},d.open("POST",url,!0),d.setRequestHeader("Content-type","application/x-www-form-urlencoded"),d.send("username="+t+"&password="+n+"&email="+a+"&settings="+settingsarr)}function loadUser(e,t){document.getElementById("navusr").innerHTML="Welcome "+e.username+" |";var n="";settingsarr=e.settings.split(",").map(function(e){return~~e}),document.getElementById("inoutss").style.display="none",document.getElementById("usercont").style.display="none",document.getElementById("sndfxbutrow").style.display="none",document.getElementById("adjgamevol").style.display="none",document.getElementById("adjlooksen").style.display="none";for(var a=0;a<3;a++){if(n="",0==a)var d=document.getElementById("sbut");if(1==a)var d=document.getElementById("fbut");if(2==a)var d=document.getElementById("rbut");32==settingsarr[a]&&(n="spc"),37==settingsarr[a]&&(n="left"),38==settingsarr[a]&&(n="up"),39==settingsarr[a]&&(n="right"),40==settingsarr[a]&&(n="down"),n?d.innerHTML=n:d.innerHTML=String.fromCharCode(settingsarr[a]).toLowerCase()}settingsarr[3]||(document.getElementById("pinside31").style.backgroundColor="#007acc",document.getElementById("ibut").className="badge badge-color"),settingsarr[3]&&(document.getElementById("poutside31").style.backgroundColor="#007acc",document.getElementById("obut").className="badge badge-color"),settingsarr[4]&&(document.getElementById("sfxon42").style.backgroundColor="#007acc",document.getElementById("sfxonbut").className="badge badge-color"),settingsarr[4]||(document.getElementById("sfxoff42").style.backgroundColor="#007acc",document.getElementById("sfxoffbut").className="badge badge-color"),settingsarr[5]&&(document.getElementById("slin53").style.backgroundColor="#007acc",document.getElementById("slinbut").className="badge badge-color"),settingsarr[5]||(document.getElementById("slout53").style.backgroundColor="#007acc",document.getElementById("sloutbut").className="badge badge-color");var s=document.getElementById("looklevel2b"),o=document.getElementById("sndlevel2b");s.style.width=settingsarr[6]+"0%",document.getElementById("looksensvalb").innerHTML=settingsarr[6],o.style.width=settingsarr[7]+"0%",document.getElementById("sndfxvalb").innerHTML=settingsarr[7],document.getElementById("looklevel1b").style.marginBottom="28px",document.getElementById("sndlevel1b").style.marginBottom="28px",s.style.backgroundColor="rgb(0, 122, 204)",o.style.backgroundColor="rgb(0, 122, 204)",ismobile?(document.getElementById("conset").style.display="none",document.getElementById("consethead").style.display="none"):(document.getElementById("adjlooksenb").style.display="none",document.getElementById("adjlookhead").style.display="none",looksen=settingsarr[7],settingsarr[7]=10),currply={id:e.id,username:e.username,password:e.password},updatePages.navFunc({target:{id:"snav"}}),t&&updatePages.navFunc({target:{id:"dwnav"}})}function updateSettings(e){e.preventDefault();var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status)if(4==this.readyState&&200==this.status)if(this.responseText.match("{")){var e=JSON.parse(this.responseText);settingsarr=e.settings.split(",").map(function(e){return~~e})}else document.getElementById("valmess").innerHTML=this.responsetext;else document.getElementById("valmess").innerHTML="Sorry this was a problem, please try again."},t.open("POST",url,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),ismobile||(settingsarr[7]=looksen),t.send("id="+currply.id+"&settings="+settingsarr+"&username="+currply.username);var n=document.getElementById("udset");n.style.display="none",udsetoff.style.display="block",ismobile||(settingsarr[7]=10)}function setButton(e){var t=e.currentTarget;if("insidesf"==t.id&&(settingsarr[3]=0,document.getElementById("outsidesf").style.background="#000000",t.style.background="#4CAF50"),"outsidesf"==t.id&&(settingsarr[3]=1,document.getElementById("insidesf").style.background="#000000",t.style.background="#4CAF50"),"sndfxbutton"==t.id){if(0===currply.username)var n=document.getElementById("sndlevel2a");else var n=document.getElementById("sndlevel2b");"on"==t.value?(t.value="off",t.style.background="#000000",settingsarr[4]=0,n.style.width="0%"):(t.value="on",t.style.background="",settingsarr[4]=1,n.style.width=settingsarr[7]+"0%",document.getElementById("sndfxval").innerHTML=settingsarr[7])}}function lookSettings(e){e.preventDefault();var t,n,a,d,s=0;if(0===currply.username?(t=document.getElementById("looklevel1a"),a=document.getElementById("looklevel2a"),d=document.getElementById("looksensval")):(t=document.getElementById("looklevel1b"),a=document.getElementById("looklevel2b"),d=document.getElementById("looksensvalb")),"mousemove"==e.type||"mouseover"==e.type)n=e.offsetX;else{var o=e.touches[0].target.getBoundingClientRect();n=e.touches[0].pageX-o.left}s=calcSliderVal(n,t.clientWidth,0),a.style.width=s+"0%",d.innerHTML=s,s<10?settingsarr[6]=s:settingsarr[6]=s}function volumeSettings(e){e.preventDefault();var t,n,a,d;if(0===currply.username?(t=document.getElementById("sndlevel1a"),a=document.getElementById("sndlevel2a"),d=document.getElementById("sndfxval")):(t=document.getElementById("sndlevel1b"),a=document.getElementById("sndlevel2b"),d=document.getElementById("sndfxvalb")),"mousemove"==e.type||"mouseover"==e.type)n=e.offsetX;else{var s=e.touches[0].target.getBoundingClientRect();n=e.touches[0].pageX-s.left}settingsarr[4]&&(settingsarr[7]=calcSliderVal(n,t.clientWidth,1),a.style.width=settingsarr[7]+"0%",d.innerHTML=settingsarr[7])}function calcSliderVal(e,t,n){var a=0;return n?(e<=.03*t&&(a=0),e>.03*t&&e<=.1*t&&(a=1)):e<=.1*t&&(a=1),e>.1*t&&e<=.2*t&&(a=2),e>.2*t&&e<=.3*t&&(a=3),e>.3*t&&e<=.4*t&&(a=4),e>.4*t&&e<=.5*t&&(a=5),e>.5*t&&e<=.6*t&&(a=6),e>.6*t&&e<=.7*t&&(a=7),e>.7*t&&e<=.8*t&&(a=8),e>.8*t&&e<=.9*t&&(a=9),e>.9*t&&(a=10),a}function runGame(e){for(var t=document.getElementsByName("radio_3698130"),n=0,a=t.length;n<a;n++)if(t[n].checked){document.getElementById("insideship").value=t[n].value;break}document.body.className+=" custom-background-image";var d=document.getElementById("page");d.style.display="none";var s=document.getElementById("game-content");s.style.display="block";var o=document.createElement("script");o.type="text/javascript",o.src="js_min/require.js",e?o.setAttribute("data-main","js_min/configmulti.js"):o.setAttribute("data-main","js_min/config.js");var l=document.getElementsByTagName("head")[0];l.appendChild(o)}function updateNav(e){var t=document.getElementById("site-header-menu"),n=e.target.className;n.match("toggled-on")&&(e.target.className="menu-toggle",t.className="site-header-menu "),n.match("toggled-on")||(e.target.className="menu-toggle toggled-on",t.className="site-header-menu toggled-on")}function loginAni(){var e=(document.getElementById(".emailinput"),document.getElementById("message")),t=document.getElementById("loginbutton");emailinput.className.match("showemail")?(emailinput.className="hideemail",e.innerHTML='Not registered? <a href="#">Create an account</a>',t.innerHTML="login"):(emailinput.className="hideemail showemail",e.innerHTML='Already registered? <a href="#">Sign In</a>',t.innerHTML="create")}var url="https://www.dronewar1.com",settingsarr=[32,38,40,0,0,0,2.5,5],currply={username:0,password:""},num_emails=1;document.getElementById("");var audiocntxt,masterGain,sourceObj={},sourcenum2=0,ismobile=0,looksen=0,self=this;loadmobstyle();var updatePages=function(){var e={pagetc:"dronewar1",classtc:"dwli"},t=function(e,t,n,a){var e=document.getElementById(e);e.style.display="none",document.getElementById(t).className="";var n=document.getElementById(n);n.style.display="block",document.getElementById(a).className="current-menu-item"};return{navFunc:function(n){window.removeEventListener("keydown",glowBadge.updateBadge,!1);var a=n.target,d="block";a.id.match("dwnav")&&(t(e.pagetc,e.classtc,"dronewar1","dwli"),d="block",e={pagetc:"dronewar1",classtc:"dwli"}),a.id.match("wanav")&&(t(e.pagetc,e.classtc,"web_app","wali"),d="block",e={pagetc:"web_app",classtc:"wali"}),a.id.match("lnav")&&(t("login-page",e.classtc,"login-page","slli"),e={pagetc:"login-page",classtc:"slli"}),a.id.match("snav")&&(document.getElementById("lnav").style.display="none",document.getElementById("snav").style.display="block",t(e.pagetc,e.classtc,"settings","slli"),t("dronewar1","dwli","settings","slli"),t("web_app","wali","settings","slli"),d="none",window.addEventListener("keydown",glowBadge.updateBadge,!1),e={pagetc:"settings",classtc:"slli"}),"titleLink"!=a.id&&"bannerImg"!=a.id||(t(e.pagetc,e.classtc,"dronewar1","dwli"),d="block",e={pagetc:"dronewar1",classtc:"dwli"});document.getElementById("post-187").style.display=d,document.getElementById("comments").style.display=d}}}();document.getElementById("loadGame").addEventListener("click",initgame),document.getElementById("loadMultiGame").addEventListener("click",initgame),document.getElementById("startGame").addEventListener("click",initgame),document.getElementById("sndfxbutton").addEventListener("click",setButton),document.getElementById("insidesf").addEventListener("click",setButton),document.getElementById("outsidesf").addEventListener("click",setButton),document.getElementById("dwnav").addEventListener("click",updatePages.navFunc),document.getElementById("wanav").addEventListener("click",updatePages.navFunc),document.getElementById("lnav").addEventListener("click",updatePages.navFunc),document.getElementById("snav").addEventListener("click",updatePages.navFunc),document.getElementById("titleLink").addEventListener("click",updatePages.navFunc),document.getElementById("bannerLink").addEventListener("click",updatePages.navFunc),document.getElementById("menu-toggle").addEventListener("click",updateNav),document.getElementById("message").addEventListener("click",loginAni),document.getElementById("loginbutton").addEventListener("click",signup_in),document.getElementById("shoot00").addEventListener("click",setsettings),document.getElementById("fthrust10").addEventListener("click",setsettings),document.getElementById("rthrust20").addEventListener("click",setsettings),document.getElementById("pinside31").addEventListener("click",setsettings),document.getElementById("poutside31").addEventListener("click",setsettings),document.getElementById("sfxon42").addEventListener("click",setsettings),document.getElementById("sfxoff42").addEventListener("click",setsettings),document.getElementById("slin53").addEventListener("click",setsettings),document.getElementById("slout53").addEventListener("click",setsettings),document.getElementById("udset").addEventListener("click",updateSettings),document.getElementById("looklevel1a").addEventListener("mousemove",lookSettings),document.getElementById("looklevel1a").addEventListener("mouseover",lookSettings),document.getElementById("looklevel1a").addEventListener("touchmove",lookSettings),document.getElementById("looklevel1a").addEventListener("touchstart",lookSettings),document.getElementById("looklevel1b").addEventListener("mousemove",lookSettings),document.getElementById("looklevel1b").addEventListener("mouseover",lookSettings),document.getElementById("looklevel1b").addEventListener("touchmove",lookSettings),document.getElementById("looklevel1b").addEventListener("touchstart",lookSettings),document.getElementById("sndlevel1a").addEventListener("mousemove",volumeSettings),document.getElementById("sndlevel1a").addEventListener("mouseover",volumeSettings),document.getElementById("sndlevel1a").addEventListener("touchmove",volumeSettings),document.getElementById("sndlevel1a").addEventListener("touchstart",volumeSettings),document.getElementById("sndlevel1b").addEventListener("mousemove",volumeSettings),document.getElementById("sndlevel1b").addEventListener("mouseover",volumeSettings),document.getElementById("sndlevel1b").addEventListener("touchmove",volumeSettings),document.getElementById("sndlevel1b").addEventListener("touchstart",volumeSettings);var glowBadge=function(){var e=1;return{setBadge:function(t){this.el=t,self=this,this.badgeInterval=setInterval(function(){e?(self.el.className="badge badge-color",e=0):(self.el.className="badge badge-default",e=1)},250)},updateBadge:function(e){e.preventDefault();var t=0;if(settingsarr.indexOf(e.keyCode)===-1){32==e.keyCode&&(t="spc"),37==e.keyCode&&(t="left"),38==e.keyCode&&(t="up"),39==e.keyCode&&(t="right"),40==e.keyCode&&(t="down"),t?self.el.innerHTML=t:self.el.innerHTML=e.key;var n=self.el.parentElement.id.substring(self.el.parentElement.id.length-2,self.el.parentElement.id.length-1);settingsarr[n]=e.keyCode}console.log(settingsarr)}}}();document.getElementById("commentsubmit").addEventListener("submit",function(e){e.preventDefault(),document.getElementById("commentsubmit").disabled=!0;var t=document.getElementById("commentname").value,n=document.getElementById("textarea_1").value,a=new XMLHttpRequest;a.onreadystatechange=function(){4==this.readyState&&200==this.status&&console.log(this.responseText)},a.open("POST",url,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send("name="+t+"&comment="+n);var d=document.getElementById("comnum1").cloneNode(!0);d.id="new_item",d.getElementsByClassName("fn")[0].innerHTML=t;var s=["January","February","March","April","May","June","July","August","September","October","November","December"],o=new Date,l=o.getDate(),r=o.getMonth(),i=o.getFullYear(),c=s[r];c+=1==l?" 1st, ":2==l?" 2nd, ":3==l?" 3rd, ":31==l?" 31st, ":" "+l+"th, ",c+=""+i,d.getElementsByTagName("time")[0].innerHTML=c,d.getElementsByTagName("p")[0].innerHTML=n,document.getElementsByClassName("comment-list")[0].appendChild(d)}),window.onload=function(){var e=parseFloat((""+(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)||[0,""])[1]).replace("undefined","3_2").replace("_",".").replace("_",""))||0;e&&e<=10&&(document.getElementById("loadMultiGame").className+=" disablea",document.getElementById("ios10dis").style.display="block");var t=document.getElementById("consoleData");t=JSON.parse(t.value);for(var n=0;n<t.length;n++){var a=t[n];console.log("%c"+a,"background: #222; color: #bada55")}var d=document.getElementById("userdata").value,s=navigator.userAgent;(s.match(/Android/i)||s.match(/webOS/i)||s.match(/iPhone/i)||s.match(/iPad/i)||s.match(/iPod/i)||s.match(/BlackBerry/i)||s.match(/Windows Phone/i))&&(ismobile=1),"0"!=d?(loadUser(JSON.parse(d),1),document.getElementById("looklevel2b").style.backgroundColor="rgb(0, 122, 204)",document.getElementById("sndlevel2b").style.backgroundColor="rgb(0, 122, 204)",document.getElementById("looklevel1b").style.marginBottom="28px",document.getElementById("sndlevel1b").style.marginBottom="28px",ismobile?(document.getElementById("conset").style.display="none",document.getElementById("consethead").style.display="none"):(document.getElementById("adjlooksenb").style.display="none",document.getElementById("adjlookhead").style.display="none",looksen=settingsarr[7],settingsarr[7]=10)):(document.getElementById("outsidesf").style.background="#000000",ismobile||(document.getElementById("adjlooksen").style.display="none",looksen=settingsarr[7],settingsarr[7]=10))},window.onerror=function(e,t,n){if(num_emails<=3){document.getElementById("container").style.display="none";var a=document.getElementById("errScreen");a.style.display="block",a.innerHTML='<div id="errdiv">Sorry drone war 1 is not available at this time </div>';var d=new XMLHttpRequest;return d.open("POST",url,!0),d.setRequestHeader("Content-type","application/x-www-form-urlencoded"),d.send("errormsg="+e+"&url_e="+t+"&l_no="+n+"&userdata="+document.getElementById("userdata").value),num_emails++,!1}};