var value = document.getElementById("code");
var barcode = document.getElementById('barcode');
var qrcode = document.getElementById('qrcode');
var reset = document.getElementById('reset');
var scanarea, turn, id;

window.addEventListener('load', function (event) {

    scanarea = document.createElement('div');
    scanarea.id = "scanarea";
    scanarea.className = "scanarea";
    document.body.appendChild(scanarea);

    var preview = document.createElement('canvas');
    preview.id = "preview";
    scanarea.appendChild(preview);

    var info = document.createElement('p');
    info.className = "text";
    info.innerHTML = "カメラにバーコードを写してください。";
    info.style.fontWeight = "1200";
    info.style.marginBottom = "50px";
    scanarea.appendChild(info);

    turn = document.createElement('button');
    turn.className = "turn";
    turn.innerHTML = "戻る";
    turn.style.display = "none";
    scanarea.appendChild(turn);

    scanarea.style.display = 'none';
});

reset.addEventListener('click', () => {

    clearTimeout(id);

    barcode.style.display = "inline";
    qrcode.style.display = "inline";
    reset.style.display = "none";
    value.style.display = "none";
    scanarea.style.display = 'none';
});

barcode.addEventListener('click', () => {

    var VideoSize = new Array(720, 1080);

    barcode.style.display = "none";
    qrcode.style.display = "none";

    //var scanarea = document.createElement('div');
    //scanarea.id = "scanarea";
    //scanarea.className = "scanarea";
    //document.body.appendChild(scanarea);

    //var preview = document.createElement('canvas');
    //preview.id = "preview";
    //scanarea.appendChild(preview);

    //var info = document.createElement('p');
    //info.className = "text";
    //info.innerHTML = "カメラにバーコードを写してください。";
    //info.style.fontWeight = "1200";
    //info.style.marginBottom = "50px";
    //scanarea.appendChild(info);

    var video, tmp, tmp_ctx, prev, prev_ctx, w, h, mw, mh, x1, y1;
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

    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");

    //value = document.getElementById("code");
    value.value = "";

    value.style.width = "300px";
    value.style.height = "36px";
    value.style.display = "none";
    value.style.overflow = "hidden";
    value.style.textAlign = "center";

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
        { "audio": false, "video": { "facingMode": "environment", "width": { "ideal": VideoSize[1] }, "height": { "ideal": VideoSize[0] } } }
    ).then( //許可された場合
        function (stream) {
            window.alert(1);
            video.srcObject = stream;
            //0.5秒毎にスキャンする
            id = setTimeout(Scan, 500, true);
        }
    ).catch( //許可されなかった場合
        function (err) {
            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";
            value.style.display = "inline";
            reset.style.display = "inline";

            value.value = err;
        }
    );

    function Scan(first) {

        var SizeRate = 0.5;
        var ScanRate = new Array(0.6, 0.25);

        video.style.transform = "rotate(90deg)";

        if (first) {
            //選択された幅高さ
            w = video.videoWidth;
            h = video.videoHeight;
            //画面上の表示サイズ
            prev.style.width = (w * SizeRate) + "px";
            prev.style.height = (h * SizeRate) + "px";
            //内部のサイズ
            prev.setAttribute("width", w);
            prev.setAttribute("height", h);

            turn.style.display = "inline";

            turn.onclick = function () {
                displayreset();
                barcode.style.display = "inline";
                qrcode.style.display = "inline";
                reset.style.display = "none";
                value.style.display = "none";
                scanarea.style.display = 'none';
            };
        }

        prev_ctx.drawImage(video, 0, 0, w, h);
        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0)";
        prev_ctx.lineWidth = 3;
        prev_ctx.rect(((w - (w * ScanRate[0])) / 2), ((h - (w * ScanRate[1])) / 2), (w * ScanRate[0]), (w * ScanRate[1]));
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
        id = setTimeout(Scan, 50, false);
    }

    Quagga.onProcessed(function (result) {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            // 検出中の緑の線の枠
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }
            // 読込中の青枠
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }
            // 検出完了時の赤線
            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });

    Quagga.onDetected(function (result) {
        //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
        if (DetectedCode == result.codeResult.code) {
            DetectedCount++;
        } else {
            DetectedCount = 0;
            DetectedCode = result.codeResult.code;
        }
        if (DetectedCount >= 3) {

            value.value = result.codeResult.code;
            video.stop();

            displayreset();

            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";
            value.style.display = "inline";
            reset.style.display = "inline";
        }
    });

    function displayreset() {

        Quagga.stop();
        clearTimeout(id);

        DetectedCode = '';
        DetectedCount = 0;
        video.remove();
        tmp.remove();
        //tmp.remove();

        //video.stop();
        //video.srcObject = null;

        //video.remove();
    //    scanarea.remove();
    }
});

qrcode.addEventListener('click', () => {

    barcode.style.display = "none";
    qrcode.style.display = "none";

    scanarea = document.createElement('div');
    scanarea.id = "scanarea";
    scanarea.className = "scanarea";
    document.body.appendChild(scanarea);

    var preview = document.createElement('canvas');
    preview.id = "preview";
    scanarea.appendChild(preview);

    var info = document.createElement('p');
    info.className = "text";
    info.innerHTML = "カメラにバーコードを写してください。";
    info.style.fontWeight = "1200";
    info.style.marginBottom = "50px";
    scanarea.appendChild(info);

    var video, tmp, tmp_ctx, value, prev, prev_ctx, w, h, m, x1, y1;

    scanarea.style.display = 'inline';

    video = document.createElement('video');
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.onloadedmetadata = function (e) { video.play(); };

    prev = document.getElementById("preview");
    prev_ctx = prev.getContext("2d");

    tmp = document.createElement('canvas');
    tmp_ctx = tmp.getContext("2d");

    value = document.getElementById("code");
    value.value = "";

    value.style.width = "360px";
    value.style.height = "108px";
    value.style.display = "none";
    value.style.textAlign = "left";
    value.style.overflow = "scroll";

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        //マイクはオフ, カメラの設定   できれば背面カメラ    できれば640×480
        { "audio": false, "video": { "facingMode": "environment", "width": { "ideal": 1080 }, "height": { "ideal": 720 } } }
    ).then( //許可された場合
        function (stream) {
            video.srcObject = stream;
            //0.5秒後にスキャンする
            id = setTimeout(Scan, 500, true);
        }
    ).catch( //許可されなかった場合
        function (err) {
            scanarea.style.display = 'none';

            value.style.display = "inline";
            reset.style.display = "inline";
            value.value = err;
        }
    );

    function Scan(first) {

        if (first) {

            var turn = document.createElement('button');
            turn.className = "turn";
            turn.innerHTML = "戻る";
            scanarea.appendChild(turn);

            turn.onclick = function () {
                location.reload();
            };
        }

        //選択された幅高さ
        w = video.videoWidth;
        h = video.videoHeight;

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
        prev_ctx.strokeStyle = "rgb(255,0,0)";
        prev_ctx.lineWidth = 3;
        prev_ctx.rect(x1, y1, m, m);
        prev_ctx.stroke();

        tmp.setAttribute("width", m);
        tmp.setAttribute("height", m);
        tmp_ctx.drawImage(prev, x1, y1, m, m, 0, 0, m, m);

        let imageData = tmp_ctx.getImageData(0, 0, m, m);

        let scanResult = jsQR(imageData.data, m, m);

        if (scanResult) {

            clearTimeout(id);

            //QRコードをスキャンした結果を出力
            value.value = scanResult.data;
            value.scrollTop = value.scrollHeight;

            displayreset();
        }

        id = setTimeout(Scan, 200, false);
    }

    function displayreset() {

        scanarea.style.display = 'none';

        value.style.display = "inline";
        reset.style.display = "inline";

        tmp.remove();

        video.stop();
        video.srcObject = null;

        video.remove();
        scanarea.remove();
    }
});
