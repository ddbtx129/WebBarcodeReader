var codevalue = document.getElementById("code");
var barcode = document.getElementById('barcode');
var qrcode = document.getElementById('qrcode');
var reset = document.getElementById('reset');
var scanarea = document.getElementById('scanarea');
var mask = document.getElementById('mask');
var turn = document.getElementById('turn');
var scaning = document.getElementById('scan');
var copyright = document.getElementById('copyright');

var video, videostream, id, tmp, tmp_ctx, prev, prev_ctx, w, h, mw, mh, x1, y1;

var DetectedCount = 0, DetectedCode = "";

var flg = false, loopflg = false, scancount = 5;
var loopspan = 100, looptime = 0, maxtime = 10000;
var tranc = 1, trancFlg = 0.0, maxtranc = 0.8;
var searchline = 0, searchlinemove = 25, searchNum = 0, searchWidth = 100;
var drawcanvs = true;

var turnButton = {
    objArrangement: function () {
        if (window.innerWidth > window.innerHeight) {
            document.getElementById('turn').style.bottom = "80px"
            document.getElementById('turn').style.left = "30%"

            document.getElementById('scan').style.bottom = "80px"
            document.getElementById('scan').style.left = "75%"

            document.getElementById('info').style.bottom = "30px"
        } else {
            document.getElementById('turn').style.bottom = "200px"
            document.getElementById('turn').style.left = "60px"

            document.getElementById('scan').style.bottom = "100px"
            document.getElementById('scan').style.left = "60px"

            document.getElementById('info').style.bottom = "2px"
        }
    }
};

window.addEventListener('load', (event) => {
    if (window.innerWidth < window.innerHeight) {
        document.getElementById('turn').style.bottom = "80px"
        document.getElementById('turn').style.left = "30%"

        document.getElementById('scan').style.bottom = "80px"
        document.getElementById('scan').style.left = "75%"

        document.getElementById('info').style.bottom = "30px"
    } else {
        document.getElementById('turn').style.bottom = "200px"
        document.getElementById('turn').style.left = "60px"

        document.getElementById('scan').style.bottom = "100px"
        document.getElementById('scan').style.left = "60px"

        document.getElementById('info').style.bottom = "2px"
    }
});

window.addEventListener("orientationchange", function () {
    flg = true;
    turnButton.objArrangement();
});

reset.addEventListener('click', () => {

    clearTimeout(id);

    barcode.style.display = "inline";
    qrcode.style.display = "inline";
    copyright.style.display = "inline";

    reset.style.display = "none";
    codevalue.style.display = "none";
    scanarea.style.display = 'none';

    looptime = 0;
    loopflg = false;
    scaning.disabled = false;
});