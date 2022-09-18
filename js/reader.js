﻿var btn = document.getElementById('btn');
var reset = document.getElementById('reset');

reset.addEventListener('click', () => {

    btn.style.display = "inline";
    reset.style.display = "none";
    document.getElementById("code").style.display = "none";

    location.reload();
});

btn.addEventListener('click', () => {

    btn.style.display = "none";

    var scanarea = document.createElement('div');
    scanarea.id = "scanarea";
    scanarea.className = "scanarea";
    document.body.appendChild(scanarea);

    var preview = document.createElement('canvas');
    preview.id = "preview";
    scanarea.appendChild(preview);

    var info = document.createElement('p');
    info.className = "text";
    info.innerHTML = "カメラにバーコードを写してください。";
    scanarea.appendChild(info);

    var DetectedCount = 0, DetectedCode = "";
    var video, tmp, tmp_ctx, value, prev, prev_ctx, w, h, mw, mh, x1, y1;
    var id;

    scanarea.style.display = 'block';

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
    value = document.getElementById("code");
    value.value = "";
    value.style.display = "none";

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
        { "audio": false, "video": { "facingMode": "environment", "width": { "ideal": 720 }, "height": { "ideal": 480 } } }
    ).then( //許可された場合
        function (stream) {
            video.srcObject = stream;
            //0.5秒毎にスキャンする
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

        var SizeRate = 0.7;
        var ScanRate = new Array(0.8, 0.3);

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
        }

        prev_ctx.drawImage(video, 0, 0, w, h);
        prev_ctx.beginPath();
        prev_ctx.strokeStyle = "rgb(255,0,0)";
        prev_ctx.lineWidth = 4;
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

    Quagga.onDetected(function (result) {
        //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
        if (DetectedCode == result.codeResult.code) {
            DetectedCount++;
        } else {
            DetectedCount = 0;
            DetectedCode = result.codeResult.code;
        }
        if (DetectedCount >= 3) {
            console.log(result.codeResult.code);

            value.style.display = "inline";
            reset.style.display = "inline";

            value.value = result.codeResult.code;
            displayreset();
        }
    });

    function displayreset() {

        DetectedCode = '';
        DetectedCount = 0;
        scanarea.style.display = 'none';

        clearTimeout(id);

        Quagga.stop();

        tmp.remove();

        video.stop();
        video.srcObject = null;

        video.remove();
        scanarea.remove();
    }
});