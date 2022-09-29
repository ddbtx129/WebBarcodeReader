
window.addEventListener('load', (event) => {
    if (window.innerWidth < window.innerHeight) {

        document.getElementById('code').style.marginTop = "200px";
        document.getElementById('codetext').style.marginTop = "200px";

        document.getElementById('barcode').style.marginTop = "220px";
        document.getElementById('barcode').style.top = "30%";

        document.getElementById('qrcode').style.marginTop = "50px"
        document.getElementById('qrcode').style.top = "50%"

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

        document.getElementById('barcode').style.marginTop = "25px";
        document.getElementById('barcode').style.top = "30%";

        document.getElementById('qrcode').style.marginTop = "30px"
        document.getElementById('qrcode').style.top = "50%"

        document.getElementById('turn').style.bottom = "200px"
        document.getElementById('turn').style.left = "95%"

        document.getElementById('scan').style.bottom = "100px"
        document.getElementById('scan').style.left = "95%"

        document.getElementById('info').style.bottom = "2px"

        document.getElementById('copyright').style.textAlign = "center"
        document.getElementById('copyright').style.left = "0px"

    }
});
