"use strict";
var loginFB = 0;
window.fbAsyncInit = function() {
  FB.init({
    // change to live
    appId      : '1881737042044781',
    //appId      : '776504849184714',
    xfbml      : true,
    version    : 'v2.9'
  });


  // ADD ADDITIONAL FACEBOOK CODE HERE
         // Place following code after FB.init call.

  function onLogin(response, join) {
    if (response.status == 'connected') {
      FB.api('/me?fields=first_name', function(data) {
        data.fb = 1;
        data.join = join;
        signup_in( data );

      });
    }
  }


  FB.getLoginStatus(function(response) {
    if (response.status == 'connected') {
      onLogin(response, 0);
    } 
  });
  function logIntoFB() {
      FB.getLoginStatus(function(response) {
        if (response.status != 'connected') {
          onLogin(response, 1);
        } 
      });
  }
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   // change to live
   //js.src = "//connect.facebook.net/en_US/sdk.js";
   js.src = "//connect.facebook.net/en_US/sdk/debug.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


