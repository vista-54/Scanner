
//$(document).ready(function () {
//// $('#ContentPlaceHolder1_gvProductList_DXCBtn_NR_-1_10').parent().append('<td><button type="button" onclick="openParentScan();return false">Scan</button></td> ');
//    $('#ContentPlaceHolder1_gvProductList_DXCBtn_NR_-1_10s').parent().append('<button type="button" onclick="openParentScan();return false">Scan</button>');
//});

//document.addEventListener('DOMContentLoaded', onFrameReady, false);

function onFrameReady() {

    console.log('frame loaded')//ContentPlaceHolder1_gvProductList_DXCBtn_NR_-1_10
    window.setInterval(function () {
//        alert("SetInterval");
        var clearButton = document.getElementById('ContentPlaceHolder1_gvProductList_DXCBtn0');
        var scanButtonExists = document.getElementById('scan');

        if (clearButton && !scanButtonExists) {

            var inputHtml = document.getElementById('ContentPlaceHolder1_gvProductList_DXSE_Raw').parentNode.parentNode.innerHTML;
            var parentContainer = clearButton.parentNode.parentNode;
//            parentContainer.innerHTML = containerNode.innerHTML + '<div class="dxb" id="scan"><div class=""dxb-hbc><input class="dxb-hb" value="Scan" type="Submit" name="scan" onclick="openParentScan();return false"><span></</div></div>';
//            parentContainer.innerHTML = containerNode.innerHTML + '<button class="ScanButton" id="scan" type="button" onclick="openParentScan();return false">Scan</button><button onclick="aspxEValueChanged(\'ContentPlaceHolder1_gvProductList_DXSE\')">Send</button>';
//            parentContainer.innerHTML = inputHtml +  '<td><button   type="button" onclick="openParentScan();return false " style="font-size: 12px; padding: 0px 5px 0 4px;"><span class="dx-vam">Scan</span></button></td> <td><button id="scan" onclick="aspxEValueChanged(\'ContentPlaceHolder1_gvProductList_DXSE\')" style="font-size: 12px; padding: 0px 5px 0 4px;><span class="dx-vam">Send</span></button></td>';
           if(identificator==true){
            parentContainer.innerHTML = inputHtml + '<td> <div class="dxbButton dxbButtonSys dxbTSys" id="scan" style="-khtml-user-select:none;"><div class="dxb"><div class="dxb-hbc"><input class="dxb-hb" value="Scan" type="button"  ></div><span class="dx-vam" onclick="openParentScan()">Scan</span></div></div></td>';
//<td><button onclick="aspxEValueChanged(\'ContentPlaceHolder1_gvProductList_DXSE\')">Send</button></td>';
        //<td><div class="dxbButton dxbButtonSys dxbTSys" id="send" style="-khtml-user-select:none;"><div class="dxb"><div class="dxb-hbc"><input class="dxb-hb" value="Send" type="button"  ></div><span class="dx-vam" onclick="aspxEValueChanged(\'ContentPlaceHolder1_gvProductList_DXSE\')">Send</span></div></div></td>'
            }
        else{
             parentContainer.innerHTML = inputHtml + '<td><div class="dxbButton dxbButtonSys dxbTSys" id="send" style="-khtml-user-select:none;"><div class="dxb"><div class="dxb-hbc"><input class="dxb-hb" value="Send" type="button"  ></div><span class="dx-vam" onclick="aspxEValueChanged(\'ContentPlaceHolder1_gvProductList_DXSE\')">Send</span></div></div></td>';
        }
    }
    }, 2000);

}
onFrameReady();
function openParentScan() {
//    alert("OPS");
    var dataStr = '{"action": "scan", "data" : "container_id_some" }';
    callParentFunction(dataStr);

}



function callParentFunction(dataStr) {
    if (window.parent) {
        console.log(dataStr);
        window.parent.postMessage(dataStr, "*");
    } else {
        console.log('parent window not found');
    }
}
        