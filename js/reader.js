var codevalue = document.getElementById("code");
var barcode = document.getElementById('barcode');
var qrcode = document.getElementById('qrcode');
var reset = document.getElementById('reset');
var scanarea = document.getElementById('scanarea');
var mask = document.getElementById('mask');
var turn = document.getElementById('turn');
var scaning = document.getElementById('scan');
var flg = false, loopflg = false;
var video, videostream, id, tmp, tmp_ctx, prev, prev_ctx, w, h, mw, mh, x1, y1;
var DetectedCount = 0, DetectedCode = "";
var loopspan = 100, looptime = 0, maxtime = 30000;

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

    var VideoSize = new Array(720, 480);
    var SizeRate = 0.75;
    var ScanRate = new Array(0.75, 0.3);
    var tranc = 1;
    var trancFlg = 0.0;
    var searchline = 0;
    var searchlinemove = 25;

    DetectedCount = 0;
    DetectedCode = "";

    barcode.style.display = "none";
    qrcode.style.display = "none";
    turn.style.display = "none";
    scaning.style.display = "none";

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

    codevalue.style.width = "300px";
    codevalue.style.height = "36px";
    codevalue.style.display = "none";
    codevalue.style.overflow = "hidden";
    codevalue.style.textAlign = "center";

    loopspan = 100;

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

    scaning.onclick = function () {
        looptime = 0;
        loopflg = true;
        scaning.disabled = false;
    };

    turn.onclick = function () {

        displayreset();
        barcode.style.display = "inline";
        qrcode.style.display = "inline";
        reset.style.display = "none";
        codevalue.style.display = "none";
        scanarea.style.display = 'none';
    };

    function Scan(first) {

        if (loopflg && looptime >= maxtime) {
            looptime = maxtime + loopspan;
            loopflg = false;
            scaning.disabled = true;
        }

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
            scaning.style.display = "inline";

            flg = false;
        }

        prev_ctx.drawImage(video, 0, 0, w, h);

        if (loopflg) {

            tranc = tranc + trancFlg;

            if (((w - (w * ScanRate[0])) / 2) + 100 + searchline > ((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0])) {
                searchline = 0;
            }

            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,255,255," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 2]);
            prev_ctx.setLineDash([]);
            prev_ctx.moveTo(((w - (w * ScanRate[0])) / 2) - 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));
            prev_ctx.lineTo(((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0]) + 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));

            prev_ctx.closePath();
            prev_ctx.stroke();

            // スキャン
            prev_ctx.beginPath();
            // 線形グラデーション
            var g = prev_ctx.createLinearGradient(((w - (w * ScanRate[0])) / 2) + searchline,
                ((h - (w * ScanRate[1])) / 2),
                ((w - (w * ScanRate[0])) / 2) + 100 + searchline,
                ((h - (w * ScanRate[1])) / 2));
            // 色を定義
            g.addColorStop(0, 'rgb(255,255,255,0)');
            g.addColorStop(0.4, 'rgb(255,255,255,0.2)');
            g.addColorStop(1, 'rgb(255,255,255,0.3)');
            prev_ctx.fillStyle = g;
            prev_ctx.fillRect(((w - (w * ScanRate[0])) / 2) + searchline, ((h - (w * ScanRate[1])) / 2), 100, (w * ScanRate[1]));

            prev_ctx.closePath();
            prev_ctx.stroke();
        } else {
            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,255,255,0.75)";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 2]);
            prev_ctx.setLineDash([]);
            prev_ctx.moveTo(((w - (w * ScanRate[0])) / 2) - 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));
            prev_ctx.lineTo(((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0]) + 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));

            prev_ctx.closePath();
            prev_ctx.stroke();
        }

        // 赤枠
        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0,1)";
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

        if (loopflg) {
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
        }

        if (tranc <= 0) {
            trancFlg = 0.1;
        } else if (tranc >= 1) {
            trancFlg = -0.1
        }

        searchline = searchline + searchlinemove;

        if (loopflg) looptime = looptime + loopspan;
        id = setTimeout(Scan, loopspan, flg);
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

        Quagga.stop();
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

        looptime = maxtime + loopspan;
        loopflg = false;
        scaning.disabled = true;
    }
});

qrcode.addEventListener('click', () => {

    var VideoSize = new Array(720, 480);
    var SizeRate = 0.75;
    var tranc = 1;
    var trancFlg = 0.0;
    var searchline = 0;
    var searchlinemove = 15;

    DetectedCount = 0;
    DetectedCode = "";

    barcode.style.display = "none";
    qrcode.style.display = "none";
    turn.style.display = "none";
    scaning.style.display = "none";

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

    loopspan = 50;

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

    scaning.onclick = function () {
        looptime = 0;
        loopflg = true;
        scaning.disabled = false;
    };

    turn.onclick = function () {

        displayreset();
        barcode.style.display = "inline";
        qrcode.style.display = "inline";
        reset.style.display = "none";
        codevalue.style.display = "none";
        scanarea.style.display = 'none';
    };

    function Scan(first) {

        if (loopflg && looptime >= maxtime) {
            looptime = maxtime + loopspan;
            loopflg = false;
            scaning.disabled = true;
        }

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

        if (w > h) { m = h * 0.6; } else { m = w * 0.6; }

        x1 = (w - m) * 0.5;
        y1 = (h - m) * 0.5;

        prev_ctx.drawImage(video, 0, 0, w, h);

        if (loopflg) {

            tranc = tranc + trancFlg

            if (x1 + 100 + searchline > x1 + m) {
                searchline = 0;
            }

            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,255,255," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 2]);
            prev_ctx.moveTo(x1 - 50, y1 + (m * 0.5));
            prev_ctx.lineTo((x1 + m + 50), y1 + (m * 0.5));

            prev_ctx.closePath();
            prev_ctx.stroke();

            // 縦線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,255,255," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 2]);
            prev_ctx.moveTo(x1 + (m * 0.5), y1 - 50);
            prev_ctx.lineTo(x1 + (m * 0.5), y1 + m + 50);

            prev_ctx.closePath();
            prev_ctx.stroke();

            // スキャン
            prev_ctx.beginPath();
            // 線形グラデーション
            var g = prev_ctx.createLinearGradient(x1 + searchline, y1, x1 + 100 + searchline, y1);
            // 色を定義
            g.addColorStop(0, 'rgb(255,255,255,0)');
            g.addColorStop(0.4, 'rgb(255,255,255,0.2)');
            g.addColorStop(1, 'rgb(255,255,255,0.3)');
            prev_ctx.fillStyle = g;
            prev_ctx.fillRect(x1 + searchline, y1, 100, m);

            prev_ctx.closePath();
            prev_ctx.stroke();
        } else {

            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,255,255,0.75)";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 2]);
            prev_ctx.moveTo(x1 - 50, y1 + (m * 0.5));
            prev_ctx.lineTo((x1 + m + 50), y1 + (m * 0.5));

            prev_ctx.closePath();
            prev_ctx.stroke();

            // 縦線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,255,255,0.75)";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 2]);
            prev_ctx.moveTo(x1 + (m * 0.5), y1 - 50);
            prev_ctx.lineTo(x1 + (m * 0.5), y1 + m + 50);

            prev_ctx.closePath();
            prev_ctx.stroke();
        }

        // 赤枠
        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0,1)";
        prev_ctx.lineWidth = 4;
        prev_ctx.setLineDash([6, 6]);
        prev_ctx.rect(x1, y1, m, m);

        prev_ctx.closePath();
        prev_ctx.stroke();

        if (loopflg) {

            tmp.setAttribute("width", m);
            tmp.setAttribute("height", m);
            tmp_ctx.drawImage(prev, x1, y1, m, m, 0, 0, m, m);

            let imageData = tmp_ctx.getImageData(0, 0, m, m);
            let scanResult = jsQR(imageData.data, m, m);

            if (scanResult) {

                //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
                if (DetectedCode == scanResult.data) {
                    DetectedCount++;
                } else {
                    DetectedCount = 0;
                    DetectedCode = scanResult.data;
                }

                if (DetectedCount >= 3) {
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
                    return;
                }
            }
        }

        if (first) {
            turn.style.display = "inline";
            scaning.style.display = "inline";
            flg = false;
        }

        if (tranc <= 0) {
            trancFlg = 0.1;
        } else if (tranc >= 1) {
            trancFlg = -0.1
        }

        searchline = searchline + searchlinemove;

        if(loopflg) looptime = looptime + loopspan;
        id = setTimeout(Scan, loopspan, false);
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

        looptime = 0;
        loopflg = false;
        scaning.disabled = true;
    }
});

reset.addEventListener('click', () => {

    clearTimeout(id);

    barcode.style.display = "inline";
    qrcode.style.display = "inline";
    reset.style.display = "none";
    codevalue.style.display = "none";
    scanarea.style.display = 'none';

    looptime = 0;
    loopflg = false;
    scaning.disabled = true;
});