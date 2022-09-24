var codevalue = document.getElementById("code");
var barcode = document.getElementById('barcode');
var qrcode = document.getElementById('qrcode');
var reset = document.getElementById('reset');
var scanarea = document.getElementById('scanarea');
var mask = document.getElementById('mask');
var turn = document.getElementById('turn');
var flg = false;
var video, videostream, id, tmp, tmp_ctx, prev, prev_ctx, prev_ctx2, w, h, mw, mh, x1, y1;

var turnButton = {
    objArrangement: function () {
        if (window.innerWidth > window.innerHeight) {
            document.getElementById('turn').style.bottom = "80px"
            document.getElementById('turn').style.left = "50%"
            document.getElementById('info').style.bottom = "30px"
        } else {
            document.getElementById('turn').style.bottom = "150px"
            document.getElementById('turn').style.left = "60px"
            document.getElementById('info').style.bottom = "25px"
        }
    }
};

window.addEventListener('load', (event) => {
    if (window.innerWidth < window.innerHeight) {
        document.getElementById('turn').style.bottom = "80px"
        document.getElementById('turn').style.left = "50%"
        document.getElementById('info').style.bottom = "30px"
    } else {
        document.getElementById('turn').style.bottom = "150px"
        document.getElementById('turn').style.left = "60px"
        document.getElementById('info').style.bottom = "25px"
    }
});

window.addEventListener("orientationchange", function () {
    flg = true;
    turnButton.objArrangement();
});

barcode.addEventListener('click', () => {

    var VideoSize = new Array(1080, 720);
    var SizeRate = 0.5;
    var ScanRate = new Array(0.75, 0.3);

    barcode.style.display = "none";
    qrcode.style.display = "none";
    turn.style.display = "none";

    var DetectedCount = 0, DetectedCode = "";

    scanarea.style.display = 'inline';

    video = document.createElement('video');
    video.id = "video";
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.onloadedmetadata = function (e) { video.play(); };

    prev = document.getElementById("preview");
    prev_ctx = prev.getContext("2d");
    prev_ctx2 = prev.getContext("2d");

    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");

    codevalue.value = "";

    codevalue.style.width = "300px";
    codevalue.style.height = "36px";
    codevalue.style.display = "none";
    codevalue.style.overflow = "hidden";
    codevalue.style.textAlign = "center";

    //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
    var options = { audio: false, video: { facingMode: "environment", width: { ideal: VideoSize[0] }, height: { ideal: VideoSize[1] } } };

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        options
    ).then( //許可された場合
        function (stream) {
            videostream = stream;
            video.srcObject = stream;
            //0.5秒毎にスキャンする
            id = setTimeout(Scan, 500, true);
        }
    ).catch( //許可されなかった場合
        function (err) {
            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";
            codevalue.style.display = "inline";
            reset.style.display = "inline";

            codevalue.value = err;
        }
    );

    turn.onclick = function () {

        displayreset();
        barcode.style.display = "inline";
        qrcode.style.display = "inline";
        reset.style.display = "none";
        codevalue.style.display = "none";
        scanarea.style.display = 'none';
    };

    function Scan(first) {

        if (first) {
            //選択された幅高さ
            //w = video.videoWidth;
            //h = video.videoHeight;
            if (window.innerWidth < window.innerHeight) {
                if (video.videoWidth < video.videoHeight) {
                    w = video.videoWidth;
                    h = video.videoHeight;
                } else {
                    h = video.videoWidth;
                    w = video.videoHeight;
                }
            } else {
                if (video.videoWidth < video.videoHeight) {
                    h = video.videoWidth;
                    w = video.videoHeight;
                } else {
                    w = video.videoWidth;
                    h = video.videoHeight;
                }
            }

            //画面上の表示サイズ
            prev.style.width = (w * SizeRate) + "px";
            prev.style.height = (h * SizeRate) + "px";
            //内部のサイズ
            prev.setAttribute("width", w);
            prev.setAttribute("height", h);

            turn.style.display = "inline";

            flg = false;
        }

        prev_ctx.drawImage(video, 0, 0, w, h);

        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,255,255,0.4)";
        prev_ctx.lineWidth = 2;
        //prev_ctx.setLineDash([10, 20]);
        prev_ctx.setLineDash([]);
        prev_ctx.moveTo(((w - (w * ScanRate[0])) / 2) - 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));
        prev_ctx.lineTo(((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0]) + 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));

        prev_ctx.closePath();
        prev_ctx.stroke();

        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0)";
        prev_ctx.lineWidth = 4;
        prev_ctx.setLineDash([6, 6]);
        prev_ctx.rect(((w - (w * ScanRate[0])) / 2), ((h - (w * ScanRate[1])) / 2), (w * ScanRate[0]), (w * ScanRate[1]));

        prev_ctx.closePath();
        prev_ctx.stroke();

        tmp.setAttribute("width", (w * ScanRate[0]));
        tmp.setAttribute("height", (w * ScanRate[1]));
        tmp_ctx.drawImage(prev,
            ((w - (w * ScanRate[0])) / 2), ((h - (w * ScanRate[1])) / 2),
            (w * ScanRate[0]), (w * ScanRate[1]),
            0, 0,
            (w * ScanRate[0]), (w * ScanRate[1]));

        tmp.toBlob(function (blob) {
            let reader = new FileReader();
            reader.onload = function () {
                let config = {
                    decoder: {
                        readers: [
                            "ean_reader",
                            "ean_8_reader",
                            "code_39_reader",
                            "code_39_vin_reader",
                            "code_93_reader",
                            "codabar_reader"
                        ]
                    },
                    locator: { patchSize: "large", halfSample: false },
                    locate: false,
                    src: reader.result,
                };
                Quagga.decodeSingle(config, function () { });
            }
            reader.readAsDataURL(blob);
        });

        id = setTimeout(Scan, 50, flg);
    }

    Quagga.onDetected(function (result) {

        //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
        if (DetectedCode == result.codeResult.code) {
            DetectedCount++;
        } else {
            DetectedCount = 0;
            DetectedCode = result.codeResult.code;
        }

        if (DetectedCount >= 3) {
            codevalue.value = result.codeResult.code;

            displayreset();

            codevalue.style.display = "inline";
            reset.style.display = "inline";
            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";
        }
    })

    function displayreset() {

        Quagga.stop();
        clearTimeout(id);

        const tracks = videostream.getVideoTracks();
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }

        prev_ctx.clearRect(0, 0, w, h);
        tmp_ctx.clearRect(
            ((w - (w * ScanRate[0])) / 2), ((h - (w * ScanRate[1])) / 2),
            (w * ScanRate[0]), (w * ScanRate[1]),
            0, 0,
            (w * ScanRate[0]), (w * ScanRate[1]));

        DetectedCode = '';
        DetectedCount = 0;
        video.remove();
        tmp.remove();
    }
});

qrcode.addEventListener('click', () => {

    var VideoSize = new Array(1080, 720);
    var SizeRate = 0.5;

    barcode.style.display = "none";
    qrcode.style.display = "none";

    scanarea.style.display = 'inline';

    video = document.createElement('video');
    video.id = "video";
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.onloadedmetadata = function (e) { video.play(); };

    prev = document.getElementById("preview");
    prev_ctx = prev.getContext("2d");

    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");

    codevalue.value = "";

    codevalue.style.width = "360px";
    codevalue.style.height = "108px";
    codevalue.style.display = "none";
    codevalue.style.textAlign = "left";
    codevalue.style.overflow = "scroll";

    video = document.createElement('video');
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.onloadedmetadata = function (e) { video.play(); };

    prev = document.getElementById("preview");
    prev_ctx = prev.getContext("2d");

    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");

    //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
    var options = { audio: false, video: { facingMode: "environment", width: { ideal: VideoSize[0] }, height: { ideal: VideoSize[1] } } };

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        options
    ).then( //許可された場合
        function (stream) {
            videostream = stream;
            video.srcObject = stream;
            //0.5秒後にスキャンする
            id = setTimeout(Scan, 500, true);
        }
    ).catch( //許可されなかった場合
        function (err) {
            scanarea.style.display = 'none';

            codevalue.style.display = "inline";
            reset.style.display = "inline";
            codevalue.value = err;
        }
    );

    turn.onclick = function () {

        displayreset();
        barcode.style.display = "inline";
        qrcode.style.display = "inline";
        reset.style.display = "none";
        codevalue.style.display = "none";
        scanarea.style.display = 'none';
    };

    function Scan(first) {

        //選択された幅高さ
        //w = video.videoWidth;
        //h = video.videoHeight;

        if (window.innerWidth < window.innerHeight) {
            if (video.videoWidth < video.videoHeight) {
                w = video.videoWidth;
                h = video.videoHeight;
            } else {
                h = video.videoWidth;
                w = video.videoHeight;
            }
        } else {
            if (video.videoWidth < video.videoHeight) {
                h = video.videoWidth;
                w = video.videoHeight;
            } else {
                w = video.videoWidth;
                h = video.videoHeight;
            }
        }

        //画面上の表示サイズ
        prev.style.width = (w / 2) + "px";
        prev.style.height = (h / 2) + "px";

        //内部のサイズ
        prev.setAttribute("width", w);
        prev.setAttribute("height", h);

        if (w > h) { m = h * 0.6; } else { m = w * 0.6; }

        x1 = (w - m) / 2;
        y1 = (h - m) / 2;

        prev_ctx.drawImage(video, 0, 0, w, h);

        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,255,255,0.4)";
        prev_ctx.lineWidth = 2;
        //prev_ctx.setLineDash([10, 10]);
        prev_ctx.setLineDash([]);
        prev_ctx.moveTo(x1 - 50, y1 + (m / 2));
        prev_ctx.lineTo((x1 + m + 50), y1 + (m / 2));

        prev_ctx.closePath();
        prev_ctx.stroke();

        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,255,255,0.4)";
        prev_ctx.lineWidth = 2;
        //prev_ctx.setLineDash([10, 10]);
        prev_ctx.setLineDash([]);
        prev_ctx.moveTo(x1 + (m / 2), y1 - 50);
        prev_ctx.lineTo(x1 + (m / 2), y1 + m + 50);

        prev_ctx.closePath();
        prev_ctx.stroke();

        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0)";
        prev_ctx.lineWidth = 4;
        prev_ctx.setLineDash([6, 6]);
        prev_ctx.rect(x1, y1, m, m);

        prev_ctx.closePath();
        prev_ctx.stroke();

        tmp.setAttribute("width", m);
        tmp.setAttribute("height", m);
        tmp_ctx.drawImage(prev, x1, y1, m, m, 0, 0, m, m);

        let imageData = tmp_ctx.getImageData(0, 0, m, m);

        let scanResult = jsQR(imageData.data, m, m);

        if (scanResult) {
            //QRコードをスキャンした結果を出力
            codevalue.value = scanResult.data;
            codevalue.scrollTop = codevalue.scrollHeight;

            displayreset();

            codevalue.style.display = "inline";
            reset.style.display = "inline";
            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";

            clearTimeout(id);
        }

        if (first) {
            turn.style.display = "inline";
            flg = false;
        }

        id = setTimeout(Scan, 50, false);
    }

    function displayreset() {

        clearTimeout(id);

        const tracks = videostream.getVideoTracks();
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }

        prev_ctx.clearRect(0, 0, w, h);
        tmp_ctx.clearRect(x1, y1, m, m, 0, 0, m, m);

        DetectedCode = '';
        DetectedCount = 0;
        video.remove();
        tmp.remove();
    }
});

reset.addEventListener('click', () => {

    clearTimeout(id);

    barcode.style.display = "inline";
    qrcode.style.display = "inline";
    reset.style.display = "none";
    codevalue.style.display = "none";
    scanarea.style.display = 'none';
});