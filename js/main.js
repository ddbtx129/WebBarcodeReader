
window.addEventListener('load', (event) => {
    if (window.innerWidth > window.innerHeight) {

        document.getElementById('code').style.marginTop = "150px";
        document.getElementById('codetext').style.marginTop = "150px";

        document.getElementById('barcode').style.marginTop = "240px";
        document.getElementById('qrcode').style.marginTop = "50px"

        document.getElementById('turn').style.bottom = "80px"
        document.getElementById('turn').style.left = "30%"

        document.getElementById('scan').style.bottom = "80px"
        document.getElementById('scan').style.left = "75%"

        document.getElementById('info').style.bottom = "30px"

    } else {

        document.getElementById('code').style.marginTop = "50px";
        document.getElementById('codetext').style.marginTop = "50px";

        document.getElementById('barcode').style.marginTop = "50px";
        document.getElementById('qrcode').style.marginTop = "50px"

        document.getElementById('turn').style.bottom = "200px"
        document.getElementById('turn').style.left = "60px"

        document.getElementById('scan').style.bottom = "100px"
        document.getElementById('scan').style.left = "60px"

        document.getElementById('info').style.bottom = "2px"

    }
});
