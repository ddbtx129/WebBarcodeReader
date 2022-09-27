
barcode.addEventListener('click', () => {

    var VideoSize = new Array(720, 480);
    var SizeRate = 0.75;
    var ScanRate = new Array(0.75, 0.3);

    loopflg = false;
    loopspan = 100;

    searchline = 0;
    searchlinemove = 25;
    searchNum = 0;

    DetectedCount = 0;
    DetectedCode = "";

    document.getElementById('info').innerHTML = "カメラにバーコードを写してください。";

    barcode.style.display = "none";
    qrcode.style.display = "none";
    turn.style.display = "none";
    scaning.style.display = "none";
    copyright.style.display = "none";

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

    //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
    var options = { audio: false, video: { facingMode: "environment", width: { ideal: VideoSize[0] }, height: { ideal: VideoSize[1] } } };

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        options
    ).then( //許可された場合
        function (stream) {
            videostream = stream;
            video.srcObject = stream;
            drawcanvs = true;
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
            copyright.style.display = "inline";

            codevalue.value = err;
        }
    );

    scaning.onclick = function () {
        looptime = 0;
        loopflg = true;
        scaning.disabled = true;
    };

    turn.onclick = function () {

        displayreset();

        barcode.style.display = "inline";
        qrcode.style.display = "inline";
        copyright.style.display = "inline";

        reset.style.display = "none";
        codevalue.style.display = "none";
        scanarea.style.display = 'none';
    };

    function Scan(first) {

        if (loopflg && looptime >= maxtime) {
            looptime = maxtime + loopspan;
            loopflg = false;
            scaning.disabled = false;
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

            scancount = (w * ScanRate[0]) / 20;

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

            if (((w - (w * ScanRate[0])) / 2) + searchWidth + searchline > ((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0])) {
                searchline = 0;
                searchNum = 0;
            }

            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,0,0," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 3]);
            prev_ctx.moveTo(((w - (w * ScanRate[0])) / 2) - 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));
            prev_ctx.lineTo(((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0]) + 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));

            prev_ctx.closePath();
            prev_ctx.stroke();

            // スキャン
            prev_ctx.beginPath();
            // 線形グラデーション
            var g = prev_ctx.createLinearGradient(
                ((w - (w * ScanRate[0])) / 2) + searchline,
                ((h - (w * ScanRate[1])) / 2),
                ((w - (w * ScanRate[0])) / 2) + searchNum + searchline,
                ((h - (w * ScanRate[1])) / 2)
            );
            // 色を定義
            g.addColorStop(0, 'rgb(255,255,255,0)');
            g.addColorStop(0.4, 'rgb(255,255,255,0.2)');
            g.addColorStop(1, 'rgb(255,255,255,0.3)');
            prev_ctx.fillStyle = g;
            prev_ctx.fillRect(
                ((w - (w * ScanRate[0])) / 2) + searchline,
                ((h - (w * ScanRate[1])) / 2),
                searchNum,
                (w * ScanRate[1])
            );

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

        if (drawcanvs) {
            // 赤枠
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,0,0,1)";
            if (loopflg) {
                prev_ctx.lineWidth = 3;
                prev_ctx.setLineDash([]);
            } else {
                prev_ctx.lineWidth = 4;
                prev_ctx.setLineDash([6, 6]);
            }
            prev_ctx.rect(((w - (w * ScanRate[0])) / 2), ((h - (w * ScanRate[1])) / 2), (w * ScanRate[0]), (w * ScanRate[1]));

            prev_ctx.closePath();
            prev_ctx.stroke();
        }

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
                                "code_128_reader",
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
        } else if (tranc >= maxtranc) {
            trancFlg = -0.1
        }

        if (loopflg) {

            if (searchNum < searchWidth) {
                searchNum = searchNum + searchlinemove;
            }
            looptime = looptime + loopspan;
            searchline = searchline + searchlinemove;
        }

        id = setTimeout(Scan, loopspan, flg);
    }

    Quagga.onDetected(function (result) {

        clearTimeout(id);
        drawcanvs = false;

        //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
        if (DetectedCode == result.codeResult.code) {
            DetectedCount++;
        } else {
            looptime = 0;
            DetectedCount = 0;
            DetectedCode = result.codeResult.code;
        }

        Quagga.stop();

        //id = setTimeout(Scan, loopspan, flg);

        if (DetectedCount >= scancount) {
            codevalue.value = result.codeResult.code;

            Quagga.stop();
            displayreset();

            codevalue.style.display = "inline";
            reset.style.display = "inline";
            copyright.style.display = "inline";

            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";

            return;
        }
    })

    function displayreset() {

        clearTimeout(id);

        const tracks = videostream.getVideoTracks();
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }

        DetectedCode = '';
        DetectedCount = 0;
        video.remove();
        tmp.remove();

        looptime = maxtime + loopspan;
        loopflg = false;
        scaning.disabled = false;

        tmp_ctx.clearRect(
            ((w - (w * ScanRate[0])) / 2), ((h - (w * ScanRate[1])) / 2),
            (w * ScanRate[0]), (w * ScanRate[1]),
            0, 0,
            (w * ScanRate[0]), (w * ScanRate[1]));
        prev_ctx.clearRect(0, 0, w, h);
    }
});
