"use strict";


function onLogin(response, join) {
  if (response.status == 'connected') {
    FB.api('/me?fields=first_name', function(data) {
      // var welcomeBlock = document.getElementById('fb-welcome');
      // welcomeBlock.innerHTML = 'Hello, ' + data.first_name + '!';
      data.fb = 1;
      data.join = join;
      signup_in( data );

    });
  }
}
function fblogin(){

  FB.getLoginStatus(function(response) {
    if (response.status == 'connected') {
      onLogin(response, 1);
    } 
  });

}

window.fbAsyncInit = function() {


    FB.init({
      // change to live
      appId      : '1881737042044781',
      //appId                 : '776504849184714',
      autoLogAppEvents      : false,
      status                : false,
      xfbml                 : true,
      version               : 'v2.10'
    });
    //FB.AppEvents.logPageView();
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          onLogin(response, 0);
        } 
    });
  };


(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  // js.src = "//connect.facebook.net/en_US/sdk.js";
  js.src = "//connect.facebook.net/en_US/sdk/debug.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


