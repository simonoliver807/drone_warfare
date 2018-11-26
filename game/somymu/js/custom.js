if ($(window).width() > 680) {
    $("html").niceScroll({
        zindex: 9999,
        cursoropacitymin: 0.3,
        cursorwidth: 7,
        cursorborder: 0,
        mousescrollstep: 40,
        scrollspeed: 100,
        horizrailenabled: false
    });
}

function OffScroll() {
    var winScrollTop = $(window).scrollTop();
    $(window).bind('scroll', function () {
        $(window).scrollTop(winScrollTop);
    });
}



//$("#id-navbar-collapse").find("a").add("#fr_converse .fr_simple_btn").click(function () {
//    var elem = $(this).attr("href");
//    $('html, body').animate({ scrollTop: $(elem).offset().top }, 1000);
//});

function setHeight() {
    var hgt = $(window).height();
    var wdth = $(window).width();
    $("#home").css('height', hgt + 'px');
    $("#home").css('width', wdth + 'px');

}
function removeHeight() {
    $("#home").removeAttr("style")
}

