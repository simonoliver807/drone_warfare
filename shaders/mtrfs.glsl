
// mtrfs

//Fake Glints by nimitz (twitter @stormoid)

/*
    Proper glints are pretty expensive to render because the solutions invariably require
    multiple evaluations per pixel.
    
    Here, I am faking glints by applying two layers of noisy/small anisotropic
    highlights that get displaced as a function of the half vector and the projected
    pixel position in 3d space.

    This could be improved to look a lot better, but I feel this is a decent demo
    of the technique's potential.
*/
#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 iResolution;
uniform vec3 camera;
uniform vec3 camdir;
uniform vec3 lightdir;
uniform vec3 rockcolor;

varying vec2 vUv;
//varying vec3 vecNormal;
varying vec3 vpos;
//varying vec3 color2;


#define time .1
#define FAR 30.
#define ITR 60

#define PRIMARY_INTENSITY 1.3
#define PRIMARY_CONCENTRATION 12.
#define SECONDARY_INTENSITY 5.
#define SECONDARY_CONCENTRATION .9

#define SHADER_NAME Fakeglint

//The lack of reflcetions give it a different but still interesting look
#define NO_REFLECTIONS

mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}

vec2 Noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
   // vec4 rg = textureLod( iChannel0, (uv+0.5)/256.0, 0.0 );
    vec4 rg = texture2D( texture1, (vUv + 0.5 )/256.0, 0.0 );
    return mix( rg.yw, rg.xz, f.z );
}

float length16( vec3 p )
{
    p = p*p; p = p*p; p = p*p;p = p*p;
    return pow(p.x+p.y+p.z, 1.0/16.0 );
}

float map(vec3 p)
{
    float d= length16(p)-0.5;
    p.xy *= .7;
    return mix(d,length(p)-1.5,0.5);
}


//Based on TekF's "Anisotropic Highlights" (https://www.shadertoy.com/view/XdB3DG)
vec3 shade( vec3 pos, vec3 rd, vec3 normal, vec3 ligt )
{
    vec3 lcol = vec3( rockcolor );
    float nl = dot(normal,ligt);
    vec3 light = lcol*max(.0,nl)*1.5;
    //light += mix( vec3(.07,.07,.07), vec3(.15), (-normal.y+1.0) );    
    vec3 h = normalize(ligt-rd);
    vec3 rf = reflect(rd,normal);

    vec3 coord = pos*.5;
    coord.xy = coord.xy*.7071+coord.yx*.7071*vec2(1,-1);
    coord.xz = coord.xz*.7071+coord.zx*.7071*vec2(1,-1);
    vec3 coord2 = coord;
    
    //displacement of the noise grabs to create the glinting effect
    #if 1    
    vec3 ww = fwidth(pos);
    coord.xy -= h.xz*20.*ww.xy;
    coord.xz -= h.xy*20.*ww.xz;
    coord2.xy -= h.xy*5.*ww.xy;
    coord2.xz -= h.xz*5.*ww.xz;
    #endif
    
    //first layer (inner glints)
    float pw = .21*((iResolution.x));
    vec3 aniso = vec3( Noise(coord*pw), Noise(coord.yzx*pw).x )*2.0-1.0;
    aniso -= normal*dot(aniso,normal);
    float anisotropy = min(1.,length(aniso));
    aniso /= anisotropy;
    anisotropy = .55;
    float ah = abs(dot(h,aniso));
    float nh = abs(dot(normal,h));
    float q = exp2((1.1-anisotropy)*3.5);
    nh = pow( nh, q*PRIMARY_CONCENTRATION );
    nh *= pow( 1.-ah*anisotropy, 10.0 );
    vec3 glints = lcol*nh*exp2((1.2-anisotropy)*PRIMARY_INTENSITY);
    glints *= smoothstep(.0,.5,nl);
    
    //second layer (outer glints)
    pw = .145*((iResolution.x));
    vec3 aniso2 = vec3( Noise(coord2*pw), Noise(coord2.yzx*pw).x )*2.0-1.0;
    anisotropy = .6;
    float ah2 = abs(dot(h,aniso2));
    float q2 = exp2((.1-anisotropy)*3.5);
    float nh2 = pow( nh, q2*SECONDARY_CONCENTRATION );
    nh2 *= pow( 1.-ah2*anisotropy, 150.0 );
    vec3 glints2 = lcol*nh2*((1.-anisotropy)*SECONDARY_INTENSITY);
    glints2 *= smoothstep(.0,.4,nl);
    
    
    
    #ifdef NO_REFLECTIONS
    vec3 reflection = vec3(0);
    #else
   // vec3 reflection = texture(iChannel1,rf).rgb;
    vec3 reflection = vec4( texture2D( texture2, rf.xy )).rgb;
    #endif
    float frnl = pow( 1.0+dot(normal,rd), 5.0 );
    frnl = mix( .0, .25, frnl );
    
    return mix( light*vec3(.3), reflection, frnl ) + glints + glints2 +
        reflection*0.015*(clamp(nl,0.,1.))+ reflection*0.005 + lcol*0.1;
}



float march( vec3 pos, vec3 ray )
{
    float d = 0.;
    float h;
    for( int i=0; i < ITR; i++ )
    {
        h = map( pos+d*ray );
        if ( h < .005 || d > FAR )break;
        d = d+h;
    }
    
    if (d > FAR)return 0.;  
    else return d;
}

vec3 normal(in vec3 p, in vec3 rd)
{  
    vec2 e = vec2(-1., 1.)*0.01;   
    vec3 n = (e.yxx*map(p + e.yxx) + e.xxy*map(p + e.xxy) + 
                     e.xyx*map(p + e.xyx) + e.yyy*map(p + e.yyy) );
    
    //from TekF (error checking)
    float gdr = dot (n, rd );
    n -= max(.0,gdr)*rd;
    return normalize(n);
}

void main( )
{
   //  //setup
    // vec2 p = gl_FragCoord.xy/vUv.xy-0.5;
    // p.x*= vUv.x/vUv.y;

    
    // float t = march( ro, rd );
    // vec3 ligt = normalize( lightdir );
    // //vec3 apos = ro + rd;
    // vec3 n = normal( vpos,rd);
    // col = shade( vpos, rd, n, ligt);




   //  // //camera
   vec3 ro = vec3( camera.x, camera.y, camera.z );
    vec3 rd = normalize( vec3( camdir));

   vec3 col = vec3(0);
    
    //float t = march( ro, rd );
    vec3 ligt = vec3( lightdir.x, lightdir.y, lightdir.z );
    //vec3 apos = ro + rd;
    vec3 n = normal( vpos,rd);
    col = shade( vpos, rd, n, ligt);


    gl_FragColor = vec4( pow(col,vec3(.85)), 1.0) ;



}






// // mtrfs

// //Fake Glints by nimitz (twitter @stormoid)

// /*
//     Proper glints are pretty expensive to render because the solutions invariably require
//     multiple evaluations per pixel.
    
//     Here, I am faking glints by applying two layers of noisy/small anisotropic
//     highlights that get displaced as a function of the half vector and the projected
//     pixel position in 3d space.

//     This could be improved to look a lot better, but I feel this is a decent demo
//     of the technique's potential.
// */
// #extension GL_OES_standard_derivatives : enable
// precision highp float;
// precision highp int;
// uniform sampler2D texture;
// uniform vec2 iResolution;
// uniform vec3 rockcolor;

// varying vec2 vUv;
// varying vec3 vecNormal;
// varying vec3 vpos;
// varying vec3 color2;
// varying vec3 lightdir;

// #define time .1
// #define FAR 30.
// #define ITR 60

// #define PRIMARY_INTENSITY 1.3
// #define PRIMARY_CONCENTRATION 12.
// #define SECONDARY_INTENSITY 5.
// #define SECONDARY_CONCENTRATION 0.9

// #define SHADER_NAME Fakeglint

// //The lack of reflcetions give it a different but still interesting look
// #define NO_REFLECTIONS

// mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}

// vec2 Noise( in vec3 x )
// {
//     vec3 p = floor(x);
//     vec3 f = fract(x);
//     f = f*f*(3.0-2.0*f);
//     vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
//    // vec4 rg = textureLod( iChannel0, (uv+0.5)/256.0, 0.0 );
//     vec4 rg = texture2D( texture, (vUv + 0.5 )/256.0, 0.0 );
//     return mix( rg.yw, rg.xz, f.z );
// }

// float length16( vec3 p )
// {
//     p = p*p; p = p*p; p = p*p;p = p*p;
//     return pow(p.x+p.y+p.z, 1.0/16.0 );
// }

// float map(vec3 p)
// {
//     float d= length16(p)-0.5;
//     p.xy *= .7;
//     return mix(d,length(p)-1.5,0.5);
// }


// //Based on TekF's "Anisotropic Highlights" (https://www.shadertoy.com/view/XdB3DG)
// vec3 shade( vec3 pos, vec3 rd, vec3 normal, vec3 ligt, vec3 rckcol )
// {
//     //vec3 lcol = vec3(.48,.45,.9);
//     vec3 lcol = vec3( rckcol );
//     float nl = dot(normal,ligt);
//     vec3 light = lcol*max(.0,nl)*1.5;
//     //light += mix( vec3(.07,.07,.07), vec3(.15), (-normal.y+1.0) );    
//     vec3 h = normalize(ligt-rd);
//     vec3 rf = reflect(rd,normal);

//     vec3 coord = pos*.5;
//     coord.xy = coord.xy*.7071+coord.yx*.7071*vec2(1,-1);
//     coord.xz = coord.xz*.7071+coord.zx*.7071*vec2(1,-1);
//     vec3 coord2 = coord;
    
//     //displacement of the noise grabs to create the glinting effect
//     #if 1    
//     vec3 ww = fwidth(pos);
//     coord.xy -= h.xz*20.*ww.xy;
//     coord.xz -= h.xy*20.*ww.xz;
//     coord2.xy -= h.xy*5.*ww.xy;
//     coord2.xz -= h.xz*5.*ww.xz;
//     #endif
    
//     //first layer (inner glints)
//     float pw = .21*((iResolution.x));
//     vec3 aniso = vec3( Noise(coord*pw), Noise(coord.yzx*pw).x )*2.0-1.0;
//     aniso -= normal*dot(aniso,normal);
//     float anisotropy = min(1.,length(aniso));
//     aniso /= anisotropy;
//     anisotropy = .55;
//     float ah = abs(dot(h,aniso));
//     float nh = abs(dot(normal,h));
//     float q = exp2((1.1-anisotropy)*3.5);
//     nh = pow( nh, q*PRIMARY_CONCENTRATION );
//     nh *= pow( 1.-ah*anisotropy, 10.0 );
//     vec3 glints = lcol*nh*exp2((1.2-anisotropy)*PRIMARY_INTENSITY);
//     glints *= smoothstep(.0,.5,nl);
    
//     //second layer (outer glints)
//     pw = .145*((iResolution.x));
//     vec3 aniso2 = vec3( Noise(coord2*pw), Noise(coord2.yzx*pw).x )*2.0-1.0;
//     anisotropy = .6;
//     float ah2 = abs(dot(h,aniso2));
//     float q2 = exp2((.1-anisotropy)*3.5);
//     float nh2 = pow( nh, q2*SECONDARY_CONCENTRATION );
//     nh2 *= pow( 1.-ah2*anisotropy, 150.0 );
//     vec3 glints2 = lcol*nh2*((1.-anisotropy)*SECONDARY_INTENSITY);
//     glints2 *= smoothstep(.0,.4,nl);
    
    
    
//     #ifdef NO_REFLECTIONS
//     vec3 reflection = vec3(0);
//     #else
//     vec3 reflection = texture(iChannel1,rf).rgb;
//     #endif
//     float frnl = pow( 1.0+dot(normal,rd), 5.0 );
//     frnl = mix( .0, .25, frnl );
    
//     return mix( light*vec3(.3), reflection, frnl ) + glints + glints2 +
//         reflection*0.015*(clamp(nl,0.,1.))+ reflection*0.005 + lcol*0.1;
// }



// float march( vec3 pos, vec3 ray )
// {
//     float d = 0.;
//     float h;
//     for( int i=0; i < ITR; i++ )
//     {
//         h = map( pos+d*ray );
//         if ( h < .005 || d > FAR )break;
//         d = d+h;
//     }
    
//     if (d > FAR)return 0.;  
//     else return d;
// }

// vec3 normal(in vec3 p, in vec3 rd)
// {  
//     vec2 e = vec2(-1., 1.)*0.01;   
//     vec3 n = (e.yxx*map(p + e.yxx) + e.xxy*map(p + e.xxy) + 
//                      e.xyx*map(p + e.xyx) + e.yyy*map(p + e.yyy) );
    
//     //from TekF (error checking)
//     float gdr = dot (n, rd );
//     n -= max(.0,gdr)*rd;
//     return normalize(n);
// }

// void main( )
// {
//     //setup
//     vec2 p = gl_FragCoord.xy/iResolution.xy-0.5;
//     p.x*=iResolution.x/iResolution.y;
    
//     // //camera
//     vec3 ro = vec3(0.,0.,-5.);
//     vec3 rd = normalize(vec3(vUv,10000.0));
    
//     vec3 col = vec3(0);
    
//     // float t = march( ro, rd );
//     //vec3 ligt = normalize(vec3(.5,1,-.2));
//     vec3 ligt = normalize(vec3(lightdir));

//     // vec3 p1 = ro + rd*t;
//     // vec3 n = normal(p1,rd);
//     col = shade( vpos, rd, vecNormal, ligt, rockcolor);
//     // if ( t > 10. )
//     // {
//     //     vec3 ligt = normalize(vec3(1.,1,-.2));
//     //     vec3 p = ro + rd*t;
//     //     vec3 n = normal(p,rd);
//     //     col = shade( p, rd, n, ligt);
        
//     // }
//     // else
//     // {
//     //     #ifdef NO_REFLECTIONS
//     //     col = vec3(0);
//     //     #else
//     //     col = texture(iChannel1,rd).rgb;
//     //     #endif
//     // }

    
//     // fragColor = vec4(pow(col,vec3(.85)),1);

//      gl_FragColor = vec4( pow(col,vec3(.85)) * color2, 1.0) ;






// }




