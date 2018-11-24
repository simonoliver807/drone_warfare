define(["socket_io","oimo"],function(t,s){function i(){this.socket=t.connect(url),this.startgame=2,this.player_self=new e,this.player_set={},this.playercount=0,this.server_updates=[],this.local_time=.016,this.host=0,this.gameid,this.tvec3=new s.Vec3,this.pvec3=new s.Vec3,this.tquat=new s.Quaternion,this.pquat=new s.Quaternion,this.droneprev=new s.Vec3,this.dronetarget=new s.Vec3,this.bodys,this.ms1y={y:0,t:0},this.ms2y={y:0,t:0},this.firstStream=1,this.respawn={restart:0,firepx:0},this.respawning=0,this.subvec=new s.Vec3,this.ply1,this.ply2,this.ply2mesh,this.client_smooth=1,this.current_time=0,this.plyudcount=0,this.udtarget=0,this.udprevious=0,this.point=0,this.next_point=0}var e=function(){this.index=Math.random()<.5?0:1,this.pos=new s.Vec3,this.ghostpos=new s.Vec3,this.destpos=new s.Vec3,this.state="new player",this.old_state=new s.Vec3,this.cur_state=new s.Vec3,this.state_time=(new Date).getTime(),this.inputs=[]};return i.prototype.v_lerp=function(t,s,i){return{x:this.lerp(t.x,s.x,i),y:this.lerp(t.y,s.y,i),z:this.lerp(t.z,s.z,i)}},i.prototype.lerp=function(t,s,i){var e=Number(i);return e=Math.max(0,Math.min(1,e)),t*(1-e)+s*e},i.prototype.setply1ply2=function(t,s,i,e){this.ply1=t,this.ply2=s,this.ply2mesh=i,this.player_self.pos.set(this.ply1.body.position.x,this.ply1.body.position.y,t.body.position.z),this.add_player(this.player_self.id,[this.ply1.body.position.x,this.ply1.body.position.y,t.body.position.z],10),this.bodys=e},i.prototype.start=function(){var t=this;this.client_create_configuration(),this.client_connect_to_server(),this.create_timer(),this.client_create_ping_timer(),setTimeout(function(){String(window.location).indexOf("debug")!=-1&&t.client_create_debug_gui()},0)},i.prototype.client_create_configuration=function(){this.heading=0,this.net_latency=.001,this.net_ping=.001,this.last_ping_time=.001,this.fake_lag=0,this.fake_lag_time=0,this.net_offset=100,this.buffer_size=2,this.target_time=.01,this.oldest_tick=.01,this.client_time=.01,this.server_time=.01,this.dt=.001,this.dte=0,this.pdt=.16,this.fps=0,this.fps_avg_count=0,this.fps_avg=0,this.fps_avg_acc=0,this.serverfps=0,this.fpsamplerate=0,this.lit=0,this.llt=(new Date).getTime(),this.pldata,this.currpos,this.numofdrones,this.dronebodys,this.pl2dronesarr=[],this.expartarr=[],this.exrtmarr=[],this.exrtm_t=[],this.tbdnum=0,this.ud,this.temparrDrone=[],this.tmpnum=0},i.prototype.client_connect_to_server=function(){this.socket.on("disconnect",this.client_ondisconnect.bind(this)),this.socket.on("onserverupdate",this.client_onserverupdate_received.bind(this)),this.socket.on("setdrone",this.setdrone.bind(this)),this.socket.on("respawnply",this.respawnply.bind(this)),this.socket.on("resetply",this.resetply.bind(this)),this.socket.on("gamestart",this.ongamestart.bind(this)),this.socket.on("setlatency",this.client_onnetmessage.bind(this))},i.prototype.client_ondisconnect=function(t){},i.prototype.respawnply=function(t){this.respawning||(this.respawn.restart=1,this.respawn.firepx=t.firepx)},i.prototype.resetply=function(t){this.bodys[0].body.position.x=t.x,this.bodys[0].body.position.y=t.y,this.bodys[0].body.position.z=t.z},i.prototype.ongamestart=function(t){this.player_self.id=t.playerid,this.gameid=t.id,t.host&&(this.host=1)},i.prototype.setdrone=function(t){if(this.bodys&&1===this.firstStream){this.host?document.getElementById("respawntxt").innerHTML="Player 2 Joined":document.getElementById("respawntxt").innerHTML="loading game";for(var s=0,i=new Float32Array(t[this.player_self.id].pldata),e=this.bodys.length-1;e>=0;e--)if("drone"==this.bodys[e].name){if(this.bodys[e].body.position.x=i[s],this.bodys[e].body.position.y=i[s+1],this.bodys[e].body.position.z=i[s+2],this.bodys[e].id=i[s+3],this.bodys[e].ld=i[s+4],this.bodys[e].setdrone=1,this.bodys[e].ld&&(this.bodys[e].nrtm=1),!(s<i.length))break;s+=5}this.socket.emit("dataload1",{id:this.player_self.id,gid:this.gameid}),this.firstStream=0}},i.prototype.client_onserverupdate_received=function(t){if(!this.firstStream){for(this.startgame=1,t.vals.pldata=new Float32Array(t.vals.pldata),this.server_time=t.t,10==this.fpsamplerate?(this.serverfps=Math.floor(1/t.fps),this.fpsamplerate=0):this.fpsamplerate++,this.client_time=this.server_time-this.net_offset/1e3,void 0===this.player_set[t.vals.playerid]&&this.add_player(t.vals.playerid,[t.vals.pldata[0],t.vals.pldata[1],t.vals.pldata[2]],20),this.server_updates.push(t),this.server_updates.length>=60*this.buffer_size&&this.server_updates.splice(0,1),this.ud=this.server_updates[this.server_updates.length-1].vals.pldata.length-2;this.ud>14&&(this.tbdnum=this.server_updates[this.server_updates.length-1].vals.pldata[this.ud]+"",this.tbdnum.match("7777")||this.tbdnum.match("8888")||this.tbdnum.match("9999")||this.tbdnum.match("6666"));)this.exrtmarr=this.exrtmarr.concat(~~this.tbdnum.substr(0,this.tbdnum.length-4),this.server_updates[this.server_updates.length-1].t,this.tbdnum.slice(this.tbdnum.length-4,this.tbdnum.length)),this.server_updates[this.server_updates.length-1].vals.pldata[this.ud-3]=0,this.server_updates[this.server_updates.length-1].vals.pldata[this.ud-2]=0,this.server_updates[this.server_updates.length-1].vals.pldata[this.ud-1]=0,this.server_updates[this.server_updates.length-1].vals.pldata[this.ud]=0,this.server_updates[this.server_updates.length-1].vals.pldata[this.ud+1]=0,this.ud-=5,this.ud-=5;this.oldest_tick=this.server_updates[0].t}},i.prototype.client_create_ping_timer=function(){setInterval(function(){this.last_ping_time=(new Date).getTime()-this.fake_lag,this.socket.emit("sendlatency",{latency:this.last_ping_time})}.bind(this),1e3)},i.prototype.create_timer=function(){setInterval(function(){this.dt=(new Date).getTime()-this.dte,this.dte=(new Date).getTime(),this.local_time+=this.dt/1e3}.bind(this),4)},i.prototype.client_create_debug_gui=function(){this.gui=new dat.GUI({width:200});var t=this.gui.addFolder("Your settings");t.add(this,"heading").listen(),t.open();var s=this.gui.addFolder("Debug view");s.add(this,"fps_avg").listen(),s.add(this,"local_time").listen(),s.open();var i=this.gui.addFolder("Connection");i.add(this,"net_latency").step(.001).listen(),i.add(this,"net_ping").step(.001).listen();var e=i.add(this,"fake_lag").min(0).step(.001).listen();e.onChange(function(t){this.socket.send("l."+t)}.bind(this)),i.open();var h=this.gui.addFolder("Networking");h.add(this,"net_offset").min(.01).step(.001).listen(),h.add(this,"server_time").step(.001).listen(),h.add(this,"client_time").step(.001).listen(),h.add(this,"serverfps").step(.001).listen(),h.open()},i.prototype.update=function(t,s,i,e,h,a,r){var o=(new Date).getTime();this.pdt=this.lastframetime?(o-this.lastframetime)/1e3:.016,this.lastframetime=o,this.client_process_net_updates(),this.client_handle_input(t,s,i,e,h,a,r),this.client_refresh_fps()},i.prototype.client_process_net_updates=function(){if(this.server_updates.length){this.current_time=this.client_time,this.plyudcount=this.server_updates.length-1,this.udtarget=null,this.udprevious=null;for(var t=0;t<this.plyudcount;t++)if(this.point=this.server_updates[t],this.next_point=this.server_updates[t+1],this.current_time>this.point.t&&this.current_time<this.next_point.t){this.udtarget=this.next_point,this.udprevious=this.point;break}if(this.udtarget||(this.udtarget=this.server_updates[0],this.udprevious=this.server_updates[0]),this.udtarget&&this.udprevious){this.target_time=this.udtarget.t;var i=this.target_time-this.current_time,e=this.udtarget.t-this.udprevious.t,h=i/e;if(this.updatedrones(this.udtarget.vals.pldata,this.udprevious,this.udtarget.t),this.updatems(this.udtarget),this.udtarget.vals.playerid!=this.player_self.id){var a=this.udtarget.vals.playerid,r=this.udtarget.vals?this.tvec3.set(this.udtarget.vals.pldata[0],this.udtarget.vals.pldata[1],this.udtarget.vals.pldata[2]):new s.Vec3,o=this.udprevious.vals?this.pvec3.set(this.udprevious.vals.pldata[0],this.udprevious.vals.pldata[1],this.udprevious.vals.pldata[2]):r;if(this.ply2mesh.userData.tquat.set(this.udtarget.vals.pldata[3],this.udtarget.vals.pldata[4],this.udtarget.vals.pldata[5],this.udtarget.vals.pldata[6]),this.ply2mesh.userData.pquat.set(this.udprevious.vals.pldata[3],this.udprevious.vals.pldata[4],this.udprevious.vals.pldata[5],this.udprevious.vals.pldata[6]),this.udtarget.vals.pldata[7]?this.ply2mesh.children[5].material.visible=!0:this.ply2mesh.children[5].material.visible=!1,this.player_set[a])if(this.player_set[a].destpos=this.v_lerp(o,r,h),this.ply2mesh.userData.tquat.slerp(this.ply2mesh.userData.pquat,h),this.ply2mesh.quaternion.set(this.ply2mesh.userData.tquat.x,this.ply2mesh.userData.tquat.y,this.ply2mesh.userData.tquat.z,this.ply2mesh.userData.tquat.w),this.client_smooth){this.player_set[a].pos=this.v_lerp(this.player_set[a].pos,this.player_set[a].destpos,this.pdt*this.client_smooth);var p=new s.Vec3;p.sub(this.ply2.body.position,this.player_set[a].pos),p.x>.01||p.x<-.01||p.y>.01||p.y<-.01||p.z>.01||p.z<-.01?(this.ply2.body.position.set(this.player_set[a].pos.x,this.player_set[a].pos.y,this.player_set[a].pos.z),this.ply2.body.sleepPosition.set(this.player_set[a].pos.x,this.player_set[a].pos.y,this.player_set[a].pos.z),this.ply2mesh.position.set(100*this.player_set[a].pos.x,100*this.player_set[a].pos.y,100*this.player_set[a].pos.z)):(this.player_set[a].pos.x=this.ply2.body.position.x,this.player_set[a].pos.y=this.ply2.body.position.y,this.player_set[a].pos.z=this.ply2.body.position.z)}else this.ply2.body.position.set(this.player_set[a].destpos.x,this.player_set[a].destpos.y,this.player_set[a].destpos.z)}}}},i.prototype.updatedrones=function(t,s,i){for(var e=0,h=15,a=0,r=4;r<this.bodys.length;r++){if(this.bodys[r].id===t[h]&&!a&&!this.bodys[r].disabled){this.bodys[r].body.sleeping||this.bodys[r].body.sleep(),this.droneprev.copy(this.bodys[r].body.position),this.dronetarget.set(t[h-3],t[h-2],t[h-1]),this.subvec.sub(this.dronetarget,this.droneprev);var o=this.expartarr.indexOf(this.bodys[r].id);o==-1?(this.subvec.x>.01||this.subvec.x<-.01||this.subvec.y>.01||this.subvec.y<-.01||this.subvec.z>.01||this.subvec.z<-.01)&&(this.bodys[r].setdrone?(this.bodys[r].body.sleepPosition.copy(this.dronetarget),this.bodys[r].body.position.copy(this.bodys[r].body.sleepPosition),this.bodys[r].setdrone=0):(this.bodys[r].body.sleepPosition.copy(this.v_lerp(this.droneprev,this.dronetarget,this.pdt*this.client_smooth)),this.bodys[r].body.position.copy(this.bodys[r].body.sleepPosition))):(this.bodys[r].body.sleepPosition.copy(this.dronetarget),this.bodys[r].body.position.copy(this.bodys[r].body.sleepPosition),this.expartarr.splice(o,1)),e=1,this.bodys[r].ld!=t[h+1]&&(this.bodys[r].ld=t[h+1])}this.bodys[r].id===t[h]&&!a&&this.bodys[r].disabled&&(e=1);var p=this.exrtmarr.indexOf(this.bodys[r].id);if(p!=-1&&this.exrtmarr[p+1]<i&&(this.exrtmarr[p+2].match("9999")&&(this.bodys[r].tbd=1,this.expartarr.push(this.bodys[r].id)),this.exrtmarr[p+2].match("8888")&&!this.bodys[r].rtm&&(this.bodys[r].rtm=1,this.host?this.bodys[r].ld=1:this.bodys[r].ld=2),this.exrtmarr[p+2].match("7777")&&(this.bodys[r].disabled=0,this.bodys[r].setdrone=1),this.exrtmarr[p+2].match("6666")&&(this.bodys[r].nrtm=1),this.exrtmarr.splice(p,3)),e&&(h+=5,e=0),h>t.length-2&&(a=1),a&&!this.exrtmarr.length)break}for(var r=this.exrtmarr.length-2;r>=0;)this.exrtmarr[r]<i&&this.exrtmarr.splice(r-1,3),r-=3},i.prototype.updatems=function(t){this.ms1y.y=t.vals.pldata[8],this.ms1y.t=t.vals.pldata[9],this.ms2y.y=t.vals.pldata[10],this.ms2y.t=t.vals.pldata[11]},i.prototype.client_handle_input=function(t,s,i,e,h,a,r){this.numofdrones!=h.length&&(this.pldata=new Float32Array(8*h.length+14),this.numofdrones=h.length),this.temparrDrone=[],this.pldata[0]=t.x,this.pldata[1]=t.y,this.pldata[2]=t.z,this.pldata[3]=s.x,this.pldata[4]=s.y,this.pldata[5]=s.z,this.pldata[6]=i.x,this.pldata[7]=i.y,this.pldata[8]=i.z,this.pldata[9]=i.w,this.pldata[10]=e,this.pldata[11]=this.local_time,this.pldata[12]=a.y,this.pldata[13]=r.y,this.currpos=14;for(var o=0;o<h.length;o++){var p=h[o].id+"";p.match("9999")||p.match("8888")||p.match("7777")||p.match("6666")?this.temparrDrone=this.temparrDrone.concat(h[o].body.position.x,h[o].body.position.y,h[o].body.position.z,h[o].body.linearVelocity.x,h[o].body.linearVelocity.y,h[o].body.linearVelocity.z,h[o].id,h[o].ld):(this.pldata[this.currpos]=h[o].body.position.x,this.pldata[this.currpos+1]=h[o].body.position.y,this.pldata[this.currpos+2]=h[o].body.position.z,this.pldata[this.currpos+3]=h[o].body.linearVelocity.x,this.pldata[this.currpos+4]=h[o].body.linearVelocity.y,this.pldata[this.currpos+5]=h[o].body.linearVelocity.z,this.pldata[this.currpos+6]=h[o].id,this.pldata[this.currpos+7]=h[o].ld,this.currpos+=8)}if(this.temparrDrone.length)for(var d=0;d<this.temparrDrone.length;d++)this.pldata[this.currpos]=this.temparrDrone[d],this.currpos++;var n=[this.pldata.buffer,this.player_self.id,this.gameid];this.socket.emit("setgd",n)},i.prototype.levelGen=function(t){this.socket.emit("levelgen",{x982y:t,gid:this.gameid,id:this.player_self.id,firepx:this.respawn.firepx})},i.prototype.client_onnetmessage=function(t){this.net_ping=(new Date).getTime()-parseFloat(t.latency),this.net_latency=this.net_ping/2},i.prototype.client_refresh_fps=function(){this.fps=1/this.pdt,this.fps_avg_acc+=this.fps,this.fps_avg_count++,this.fps_avg_count>=10&&(this.fps_avg=this.fps_avg_acc/10,this.fps_avg_count=1,this.fps_avg_acc=this.fps)},i.prototype.add_player=function(t,s,i){this.playercount++,this.player_set[t]=new e(this),this.player_set[t].id=t,this.player_set[t].cur_state.set(s[0],s[1],s[2]),this.player_set[t].pos.set(s[0],s[1],s[2]),this.player_set[t].index=parseInt(i),console.log("Player joined: "+this.playercount+" total")},i.prototype.gcd=function(t){return"host"==t?this.host:"ms1y"==t?this.ms1y:"ms2y"==t?this.ms2y:void 0},i});