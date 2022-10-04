var fullscreen = 0;

window.addEventListener('load', (event) => {

    //if (document.fullscreenElement) {
    //    document.exitFullscreen()
    //} else {
    //    document.body.requestFullscreen()
    //}

    //fullscreen = 1;
    //document.getElementById('fullscreen').innerHTML = "全画面解除";

    if (window.innerWidth < window.innerHeight) {

        document.getElementById('code').style.marginTop = "200px";
        document.getElementById('codetext').style.marginTop = "200px";

        document.getElementById('barcode').style.marginTop = "0px";
        document.getElementById('barcode').style.top = "40%";

        document.getElementById('qrcode').style.marginTop = "0px"
        document.getElementById('qrcode').style.top = "40%"

        document.getElementById('turn').style.bottom = "80px"
        document.getElementById('turn').style.left = "30%"

        document.getElementById('scan').style.bottom = "80px"
        document.getElementById('scan').style.left = "75%"

        document.getElementById('info').style.bottom = "30px"

        document.getElementById('copyright').style.textAlign = "center"
        document.getElementById('copyright').style.left = "0px"

    } else {

        document.getElementById('code').style.marginTop = "25px";
        document.getElementById('codetext').style.marginTop = "25px";

        document.getElementById('barcode').style.marginTop = "0px";
        document.getElementById('barcode').style.top = "40%";

        document.getElementById('qrcode').style.marginTop = "0px"
        document.getElementById('qrcode').style.top = "40%"

        document.getElementById('turn').style.bottom = "200px"
        document.getElementById('turn').style.left = "92%"

        document.getElementById('scan').style.bottom = "100px"
        document.getElementById('scan').style.left = "92%"

        document.getElementById('info').style.bottom = "2px"

        document.getElementById('copyright').style.textAlign = "center"
        document.getElementById('copyright').style.left = "0px"

    }
});


