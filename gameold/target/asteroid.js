define(["three","lib/improvedNoise"],function(e,t){return function(){var r,n,a,i,o,s,u,c,l,d,p=10,h=new t,v=[];v.push([[0,0,0],[-10,-10,10],[10,-10,10],[-10,10,10],[10,10,10],[-10,-10,-10],[10,-10,-10],[-10,10,-10],[10,10,-10]]),v.push([[0,0,0],[-10,-10,10],[10,-10,10],[-10,10,10],[10,10,10],[10,-10,-10],[10,10,-10]]),v.push([[0,0,0],[-10,-10,10],[10,-10,10],[-10,10,10],[10,10,10]]),v.push([[-10,-10,10],[10,-10,10],[-10,10,10]]),v.push([[-10,-10,10],[10,-10,10]]);var m=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};return{initMat:function(t){l={9:[4,3],7:[2,3],5:[1,2]},c=(new e.TextureLoader).load("images/planets/mercury.jpg"),o=document.getElementById("mtrfs").textContent,s=document.getElementById("mtrvs").textContent;var n=e.UniformsUtils.merge([e.UniformsLib.lights]),i=new e.Vector3(window.innerWidth,window.innerHeight);n.camera={type:"v3",value:new e.Vector3(0,0,20)},n.camdir={type:"v3",value:new e.Vector3(0,0,-1)},n.iResolution={type:"v2",value:i},n.lightdir={type:"v3",value:new e.Vector3(0,0,1)},n.newPosVar={type:"f",value:0},n.rockcolor={type:"v3",value:new e.Vector3},n.texture={type:"t",value:c},n.texture.wrapS=e.RepeatWrapping,n.texture.wrapT=e.RepeatWrapping,a=new e.RawShaderMaterial({uniforms:n,vertexShader:s,fragmentShader:o,lights:!0}),r=new e.DodecahedronGeometry(m(35,40),0);for(var u=0;u<r.vertices.length;u++){var d=h.noise(r.vertices[u].x,r.vertices[u].y,r.vertices[u].z);r.vertices[u].x+=5*d,r.vertices[u].y+=5*d,r.vertices[u].z+=5*d}r.verticesNeedUpdate=!0},create:function(t){d=new e.Group,d.userData.atbd=0;for(var n=0;n<t;n++){var i=a.clone();i.uniforms.rockcolor.value.set(.4,.4,.4),i.uniforms.newPosVar.value=m(10,30);var o=new e.Mesh(r,i);o.userData.t=p,o.position.set(v[0][n][0],v[0][n][1],v[0][n][2]),o.name="astmesh_"+n,d.add(o)}return d},breakDown:function(t,r){n=t.children.length;var a=[];if(u=new e.Group,n>3){i=t.children[n-1],t.remove(t.children[n-1]),u.children=t.children.splice(l[n][0],l[n][1]),u.name=t.name+(~~t.name.substr(t.name.length-1)+1),u.userData.atbd=0,u.position.set(t.position.x+15,t.position.y,t.position.z);for(var o=0;o<u.children.length;o++)u.children[o].userData.t=p,u.children[o].parent=u;a.push(u)}3!==n&&2!==n||(i=t.children[n-1],t.remove(t.children[n-1])),i.position.set(t.position.x-15,t.position.y,t.position.z),i.userData.t=p,i.userData.atbd=0,a.push(i);for(var o=0;o<t.children.length;o++)t.children[o].userData.t=p;return t.userData.atbd=0,a}}}});