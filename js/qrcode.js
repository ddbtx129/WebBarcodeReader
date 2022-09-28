
qrcode.addEventListener('click', () => {

    var VideoSize = new Array(720, 480);
    var SizeRate = 0.75;

    loopflg = false;
    loopspan = 50;

    searchline = 0;
    searchlinemove = 15;
    searchNum = 0;

    DetectedCount = 0;
    DetectedCode = "";

    document.getElementById('info').innerHTML = "カメラにＱＲコードを写してください。";

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

    codevalue.style.width = "360px";
    codevalue.style.height = "216px";
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
            looptime = maxtime + loopspan, searchline = 0, searchNum = 0;
            loopflg = false;
            scaning.disabled = false;
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

        if (first) scancount = m / 32;

        prev_ctx.drawImage(video, 0, 0, w, h);

        if (loopflg) {

            tranc = tranc + trancFlg

            //if (x1 + 100 + searchline > x1 + m) {
            //    searchline = 0;
            //    searchNum = 0;
            //}

            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,0,0," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 3]);
            prev_ctx.moveTo(x1 - 50, y1 + (m * 0.5));
            prev_ctx.lineTo((x1 + m + 50), y1 + (m * 0.5));

            prev_ctx.closePath();
            prev_ctx.stroke();

            // 縦線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,0,0," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([2, 3]);
            prev_ctx.moveTo(x1 + (m * 0.5), y1 - 50);
            prev_ctx.lineTo(x1 + (m * 0.5), y1 + m + 50);

            prev_ctx.closePath();
            prev_ctx.stroke();

            // スキャン
            prev_ctx.beginPath();
            // 線形グラデーション
            var g = prev_ctx.createLinearGradient(x1 + searchline, y1, x1 + searchNum + searchline, y1);
            // 色を定義
            g.addColorStop(0, 'rgb(255,255,255,0)');
            g.addColorStop(0.4, 'rgb(255,255,255,0.2)');
            g.addColorStop(1, 'rgb(255,255,255,0.3)');
            prev_ctx.fillStyle = g;
            prev_ctx.fillRect(x1 + searchline, y1, searchNum, m);

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
        if (loopflg) {
            prev_ctx.lineWidth = 3;
            prev_ctx.setLineDash([]);
        } else {
            prev_ctx.lineWidth = 4;
            prev_ctx.setLineDash([6, 6]);
        }
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

                //読み取り誤差のために、複数回連続で同じ値だった場合に成功とする
                if (DetectedCode == scanResult.data) {
                    DetectedCount++;
                } else {
                    looptime = 0;
                    DetectedCount = 0;
                    DetectedCode = scanResult.data;
                }

                if (DetectedCount >= scancount) {

                    //QRコードをスキャンした結果を出力
                    codevalue.value = scanResult.data;
                    codevalue.scrollTop = codevalue.scrollHeight;

                    displayreset();

                    codevalue.style.display = "inline";
                    reset.style.display = "inline";
                    copyright.style.display = "inline";

                    scanarea.style.display = 'none';
                    barcode.style.display = "none";
                    qrcode.style.display = "none";
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
        } else if (tranc >= maxtranc) {
            trancFlg = -0.1
        }

        if (loopflg) {

            //if (searchNum < searchWidth) {
            //    searchNum = searchNum + searchlinemove;
            //}
            //looptime = looptime + loopspan;
            //searchline = searchline + searchlinemove;

            if (searchNum < searchWidth) searchNum += searchlinemove;
            looptime += loopspan;

            if (searchline + searchlinemove + searchNum > m) {
                if (searchline + searchNum < m) {
                    searchline += (m - (searchline + searchNum));
                } else {
                    searchline = 0, searchNum = 0;
                }
            } else {
                searchline += searchlinemove;
            }
        }

        id = setTimeout(Scan, loopspan, false);
    }

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

        looptime = 0;
        loopflg = false;
        scaning.disabled = false;

        tmp_ctx.clearRect(x1, y1, m, m, 0, 0, m, m);
        prev_ctx.clearRect(0, 0, w, h);
    }
});
