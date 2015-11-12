var scan = {
    slipObjectsArray: []
};
var store = window.localStorage;
var jsFileText = '';
var localjsLoaded = false;
var deviceIsReady = false;
var identificator = true;
var deviceModel;
var clearUrl = store.getItem("url");
//    var deviceModel='';
//    var deviceOs='';
//    var deviceOsVersion='';
var isMobile = false;

if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
    isMobile = true;
}
var isAndroid = (/Android/i.test(navigator.userAgent)) ? true : false;
var isIos = (/iPhone|iPad|iPod/i.test(navigator.userAgent)) ? true : false;
if (isMobile) {
    document.write('<script charset="utf-8" src="cordova.js" ><\/script>');
}
//ingetlink();

//document.addEventListener("deviceready", onDeviceReady, false);

function isDeviceReady() {
    if (deviceIsReady === false) {
        showErrorMessage('device not ready');
        log('device not ready');
        return false;
    }
    //getlink();
    return true;
}/*
 function getlink(){
 
 od = "";
 $.get("http://159.224.220.250/BCS/link.php", od, function (result) {
 //alert( "success" );
 console.log(result);
 //clearUrl=result.data;
 for (var i in result)
 {
 var obj = result.data[i];
 var page = "<p><img src=" + url + obj.img + "></p><h1>" + obj.title + "</h1><p>" + obj.desc + "</p><p>" + obj.massa + "/" + obj.price + "   <button onclick=\"buy()\">В корзину</button></p>";
 $("#cont").append(page);
 }
 
 
 }, "json");
 
 }*/

function exitFromApp()
{
    if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
    } else if (navigator.device && navigator.device.exitApp) {
        navigator.device.exitApp();
    }
}





function log(str) {
    console.log(str);
}


function scanBarcode() {

    if (isMobile) {
        scanBarcodeProcess(afterScanCode);
    } else {
        // emulate behaviour in desktop
        afterScanCode({success: true}, {format: 'CODE_128', cancelled: false, text: ('0000' + parseInt(Math.random() * 2) + '_' + parseInt(Math.random() * 999999999))});
    }

    function afterScanCode(status, result) {
//        log('result.format: ' + result.format + '; text:' + result.text + '; cancelled: ' + result.cancelled);
        if (status.error) {
            showErrorMessage(result);
            return;
        }

        if (!(result.cancelled === false || result.cancelled === 0)) {
            log('scanning cancelled');
            return;
        }
//        if (!(result.format === 'CODE_128')) {
//            showErrorMessage(eMsg.wrongCodeType);
//            return;
//        }

        var scannedCode = result.text;
        for (var i in scan.slipObjectsArray) {
            var slipObject = scan.slipObjectsArray[i];
            if (slipObject.slip === scannedCode) {
                showErrorMessage(eMsg.codeScanned);
                return false;
            }
        }

        addSlipNumberToView(scannedCode);

    }
    return false;
}



function scanBarcodeProcess(callback) {
    cordova.plugins.barcodeScanner.scan(
            function (result) {
                var status = {success: true, error: false};
                callback(status, result);
            },
            function (error) {

                alert("Scanning failed: " + error);
                var status = {success: false, error: true};
                callback(status, error);
            }
    );


}

function addSlipNumberToView(slipNumber) {
    var frame = document.getElementById('main-frame');
    var frameDocument = frame.contentDocument || frame.contentDocument;
    frameDocument.getElementById('ContentPlaceHolder1_gvProductList_DXSE_I').value = slipNumber;
//     $('#ContentPlaceHolder1_gvProductList_DXSE_I').val(slipNumber);

}

var path = window.location.href;
var idx = path.lastIndexOf('/');
var appHost = path.substring(0, idx);

var cssFileText = '';
var localCssLoaded = true;
var frameCreated = false;


//var clearUrl = "https://test.ese-co.com/surestock";

//var url = "http://192.168.166.1/?mobile-app=1";

//+ "?mobile-app=1&wmode=transparent"


if (isMobile) {
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady, false);
}

//function onDeviceReady() {
//    StatusBar.overlaysWebView(false);
//    console.log('device ready');
//    init();
//
//
//}
function onDeviceReady() {
    if (isMobile) {
        StatusBar.overlaysWebView(false);
    }
    console.log('device ready');
    getDeviceInfo();
    // getDeviceInfo();
    init();


}

function showSplash(msg) {
    var splash = document.getElementById('splash');

    splash.style.display = 'block';
    if (msg) {
        showMsg(msg);
    }
    var frame = document.getElementById('main-frame');
    if (frame) {
        frame.style.display = 'none';
    }
}

function hideSplash() {
    var splash = document.getElementById('splash');
    splash.style.display = 'none';
    var frame = document.getElementById('main-frame');
    if (frame) {
        frame.style.display = 'block';
    }
}

function showLoader() {
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
}

function hideLoader() {
    var loader = document.getElementById('loader');
    loader.style.display = 'none';
}

function showMsg(msgText) {
    var msg = document.getElementById('msg');
    msg.innerHTML = msgText;
    msg.style.display = 'block';
}

function hideMsg() {
    var msg = document.getElementById('msg');
    msg.innerHTML = '';
    msg.style.display = 'none';
}



function hasInternet() {
    try {
        if (!isMobile) {
            return true; // is browser
        }
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        if (networkState === Connection.NONE) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}





function init() {
    console.log('init');
    var connected = hasInternet();
    if (!connected) {
        console.log('not connected to net');
        showSplash('To use the application you must have an active Internet connection');
        hideLoader();
    } else {
        console.log('device connected to net');
        //hideSplash();
        createIframe();
    }
}

var loadTimeout;
var bodyHeight = null;
var bodyWidth = null;

function createIframe() {
    var frameHolder = document.getElementById('frame-holder');
    if (loadTimeout) {
        clearTimeout(loadTimeout);
    }
    var frame = document.getElementById('main-frame');
    if (frame) {
        frameHolder.removeChild(frame);
    }
    bodyHeight = document.body.offsetHeight;
    bodyWidth = document.body.offsetWidth;

    setTimeout(function () {
//        var url = clearUrl;
        console.log('create iframe in timeout');
        var frameHtml = '<iframe id="main-frame" src="' + clearUrl + "&output=embed" + '" ' +
//                'height="' + bodyHeight + '" ' +
                'name="main-frame" class="main-frame " ' +
                'onload="checkForLoad()" ' +
                'onerror="onError()" ' +
                'scrolling="yes" ' +
                'wmode="Opaque" ' +
                'noresize="noresize" ' +
                '  </iframe>';
        window.location.replace(clearUrl + "&output=embed");
        frameHolder.innerHTML = frameHtml;

        frameCreated = true;

//    var iframe = document.getElementById('main-frame'),
//        doc = iframe.contentDocument || iframe.contentWindow;
//    if (doc.document) doc = doc.document;
//    var _timer = setInterval(function() {
//        if (doc.readyState === 'complete') {
//            clearInterval(_timer);
//           console.log('iframe_ready!');
//        }
//    }, 1000);

        loadTimeout = setTimeout(function () {
            // fail load
            console.log('page not loaded, interval in 15sec reached');
            showSplash('page is unavailable');
            hideLoader();
        }, 15000);


    }, 1500);




}



function checkForLoad() {

//<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    clearTimeout(loadTimeout);
    console.log('page is loaded. try to detect type of page');

    var frame = document.getElementById('main-frame');
//    var sctipt='<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>';
    var frameDocument = frame.contentDocument || frame.contentDocument;//дочерний дкоумент
//    document.getElementsByTagName("head").appendChild(sctipt);

    var head = frame.contentDocument.head || frame.contentDocument.getElementsByTagName('head')[0];
//    var head = document.getElementsByTagName("head")[0];
//    head.appendChild("<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js\"></script>");
//    var jqueryscript = document.createElement("script");
//    jqueryscript.type = "text/javascript";
//    jqueryscript.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js";
//    head.appendChild(jqueryscript);

    var injectscript = document.createElement("script");
    injectscript.type = "text/javascript";
    injectscript.innerHTML = jsFileText;

//    jqueryscript.onload = function () {
//        alert('11')
//        if (window.parent) {
//            window.parent.postMessage('{"action":"jsload" }', "*");
//        } else {
//            console.log('parent window not found');
//        }
//        //
//    }
    head.appendChild(injectscript);

//    var first = head;

    var header = frameDocument.getElementById('header');
    if (!header /*|| !contentNormal*/) {
        console.log('page not loaded, showed std browser 404 page');
//        showSplash('page is unavailable');
//        hideLoader();
    } else {
        redrawFrameBounds();
    }



//        var style = document.createElement('style');
//        style.type = 'text/css';
//        if (style.styleSheet) {
//            style.styleSheet.cssText = cssFileText;
//        } else {
//            style.appendChild(document.createTextNode(cssFileText));
//        }
//
//        head.appendChild(style);

//    frameDocument.cookie = 'mobile-app=1;path=/;';

}

function jqueryLoadedOnFrame() {

}


function redrawFrameBounds() {
    //        hideSplash();
    console.log("ReDraw Starting...");
    var frame = document.getElementById('main-frame');
    var frameHolder = document.getElementById('frame-holder');
    var frameHtml = frame.contentDocument.getElementsByTagName('html')[0];
    var frameBody = frame.contentDocument.body;

//        console.log('before');
//        console.log('iframe params: offWidth: ' + frame.offsetWidth + '; offHeight: ' + frame.offsetHeight);
//        console.log('iframe html: offWidth: ' + frameHtml.offsetWidth + '; offHeight: ' + frameHtml.offsetHeight);
//        console.log('iframe body: offWidth: ' + frameBody.offsetWidth + '; offHeight: ' + frameBody.offsetHeight);

    // frame.style.height = frameBody.offsetHeight;

    //experimental
    //

    bodyHeight = document.body.offsetHeight;
    bodyWidth = document.body.offsetWidth;

    frame.style.height = bodyHeight + 'px';
    frame.style.clientHeight = bodyHeight + 'px';
    frame.style.width = '100%';
    frame.style.clientWidth = '100%';
//        console.log('bodyHeight: ' + bodyHeight);
//        console.log('bodyHeight: ' + bodyWidth);
//        frameHolder.style.height = bodyHeight - 30 + 'px';

    frameHtml.style.height = bodyHeight + 'px';
    frameHtml.style.clientHeight = bodyHeight + 'px';
    frameHtml.style.width = '100%';
    frameHtml.style.clientWidth = '100%';
    ;
    frameHtml.style.overflow = 'hidden';



    frameBody.style.height = bodyHeight + 'px';
    frameBody.style.clientHeight = bodyHeight + 'px';
    frameBody.style.width = bodyWidth + 'px';
    // frameBody.style.clientWidth = bodyWidth+'px';
    frameBody.style.overflow = 'auto';



//        console.log('after');
//        console.log('iframe params: offWidth: ' + frame.offsetWidth + '; offHeight: ' + frame.offsetHeight);
//        console.log('iframe html: offWidth: ' + frameHtml.offsetWidth + '; offHeight: ' + frameHtml.offsetHeight);
//        console.log('iframe body: offWidth: ' + frameBody.offsetWidth + '; offHeight: ' + frameBody.offsetHeight);
//        frame.height = document.body.offsetHeight-150+'px';
    //}

}



function onError() {
    console.log('error on loading content');
}

function reload() {
    //showLoader();
    //();
    init();
    var frame = document.getElementById('main-frame');
    if (frame) {
        frame.src = clearUrl;
    }

}




function openDocument(clearUrl) {
    if (isMobile) {
        openSiteInDefaultBrowser(clearUrl);
    } else {
        window.open(clearUrl, '_blank');
    }
}


function openSiteInDefaultBrowser(clearUrl) {
    console.log('open external clearUrl: ' + clearUrl);
    if (isIos) {
        window.open(clearUrl, '_system');
    } else {
        navigator.app.loadUrl(clearUrl, {openExternal: true});
    }
    return false;
}


/*
 // open inner hrefs in app
 
 $("a").click(function (event) {
 var href = $(this).attr('href');
 href = qualifyURL(href);
 var needOpenInExternal = needOpenUrlInExternal(href);
 if (needOpenInExternal) {
 event.preventDefault();
 if (window.parent) {
 // for relative hrefs
 
 //if(href.indexOf('/') == 0 || href.indexOf('')){
 //    href = window.location.protocol + "//" + window.location.host + href;
 //}
 console.log('postMessage: '+href);
 window.parent.postMessage(href, "*");
 //window.open(href, '_system');
 } else {
 console.log('in device href will be opened with default browser');
 }
 }
 
 function needOpenUrlInExternal(url) {
 
 if (
 endsWith(url, '.pdf') ||
 endsWith(url, '.docx') ||
 endsWith(url, '.doc') ||
 endsWith(url, '.txt') ||
 url.indexOf('gifts.covenantpresby.org') > 1 ||
 url.indexOf('media.covenantpresby.org') > 1 ||
 url.indexOf('vimeo.com') > 1 ||
 ( url.indexOf('covenant') < 1)
 ) {
 return true;
 }
 return false;
 }
 
 function endsWith(str, suffix) {
 return str.indexOf(suffix, str.length - suffix.length) !== -1;
 }
 
 function qualifyURL(url) {
 var a = document.createElement('a');
 a.href = url;
 return a.cloneNode(false).href;
 }
 });
 */



window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{

    var urlToOpen = event.data;
    var obj = JSON.parse(event.data);
    for (var i in obj) {
        var action = obj[i];
//        var val = ;
//        if (action == 'open') {
//            openDocument(val);
//        }
        if (action == 'scan') {
            scanBarcode();

        }
    }

}


$(document).ready(function () {
//    
//        $('#frame-holder').niceScroll();
//        $('#').niceScroll();
//        
    var scrollParams = {
        autoHideScrollbar: true,
        autoDraggerLength: true,
        scrollInertia: 100,
        contentTouchScroll: true,
        advanced: {
            updateOnContentResize: true,
            updateOnBrowserResize: true,
            autoScrollOnFocus: false
        }
    };

    function addScrolls() {
        $(".scroller").mCustomScrollbar(scrollParams);
    }

    //addScrolls();


    // swipe
    try {
        $('body').swipe({
            //Generic swipe handler for all directions
            swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
                openMenu();
            },
            swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
                closeMenu();
            },
            //Default is 75px, set to 0 for demo so any distance triggers swipe
            threshold: 75,
            //allowPageScroll: 'auto'
        });
    } catch (e) {
        log('swipe function not defined')
    }

    if (!isMobile) {

        initRotation();
    }

});


var time = 800;
var easing = 'swing'; // 'linear', 'swing'
function openMenu() {
    $('#slide-menu').stop().show().animate({width: '80%'}, time, easing);
}

function closeMenu() {
    $('#slide-menu').stop().animate({width: '0'}, time, easing, function () {
        $('#slide-menu').hide();
    });
}


function openHref(href) {
    var frame = document.getElementById('main-frame');
    if (frame) {
        frame.src = clearUrl + href;
        closeMenu();
    }
    return false;
}

function toolAction(action) {

    switch (action) {
        case 'back':
            history.back();
            closeMenu();
            break;
        case 'reload':
            reload();
            closeMenu();
            break;
        case 'menu':
        {
            if ($('#slide-menu').is(":visible")) {
                closeMenu();
            } else {
                openMenu();
            }

        }

    }
}
function loadJs() {
    //  getDeviceInfo();\

    if ((deviceModel == 'iPad1') || (deviceModel == 'iPad2')) {
        console.log("device not have a camera");
        identificator = false;
    }
    else {
        var request = new XMLHttpRequest();
        request.open("GET", "js/inject.js");
        request.onreadystatechange = function () {
            //   Call a function when the state changes.
            if (request.readyState === 4) {
                jsFileText = request.responseText;
                localjsLoaded = true;
                console.log("loadJSsucsess");
            }
        };
        request.send();
    }
}
if (isMobile) {
    window.addEventListener('orientationchange', doOnOrientationChange);
}


// emulation rotation in desctop browser 
function initRotation() {
    if (isMobile) {
        return false;
    }


//start
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    width > height ? window.orientation = 90 : window.orientation = 0;
    createEvent(); //call to init once 
    var interval = setInterval(function () {
        var width = $(window).width();
        var height = $(window).height();
        if (width > height && window.orientation === 0) {
            window.orientation = 90;
            createEvent();
            return;
        }
        if (height > width && window.orientation === 90) {
            window.orientation = 0;
            createEvent();
            return;
        }
    }, 2000);
    function createEvent() {
        var event; // The custom event that will be created
        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent("orientationchange", true, true);
        } else {
            event = document.createEventObject();
            event.eventType = "orientationchange";
        }

        event.eventName = "orientationchange";
        if (document.createEvent) {
            window.dispatchEvent(event);
        } else {
            window.fireEvent("on" + event.eventType, event);
        }
    }

    window.addEventListener('orientationchange', doOnOrientationChange);
    //doOnOrientationChange();
}


function doOnOrientationChange() {
    redrawFrameBounds();
}
function getDeviceInfo() {
    console.log("Info loaded");
    deviceModel = device.model;
    deviceOs = device.platform;
    deviceOsVersion = device.version;
    loadJs();
    // alert("Model"+devicModel+"Os"+deviceOs+"VersionOS"+deviceOsVersion);
}
function setting() {
    if (clearUrl === '') {
        clearUrl = "https://test.ese-co.com/vmi/";
    }
    clearUrl = prompt('Enter url', clearUrl);
    store.setItem("url", clearUrl);
    reload();
}
