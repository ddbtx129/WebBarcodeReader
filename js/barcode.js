
barcode.addEventListener('click', () => {

    //var VideoSize = new Array(720, 480);
    var VideoSize = new Array(640, 480);
    var SizeRate = 0.75;
    //var SizeRate = 0.5;
    //var ScanRate = new Array(0.75, 0.3);
    var ScanRate = new Array(0.75, 0.375);

    loopflg = false;
    loopspan = 100;

    searchline = 0;
    searchlinemove = 25;
    searchNum = 0;

    DetectedCount = 0;
    DetectedCode = "";
    DetectedFormat = "";

    document.getElementById('kind').innerHTML = "";
    document.getElementById('info').innerHTML = "バーコードを写してください。";
    numval.innerHTML = "0 / 0";

    codearea.style.display = "none"
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
    codevalue.style.height = "42px";
    codevalue.style.overflow = "hidden";
    codevalue.style.textAlign = "center";
    codevalue.contentEditable = "true";

    //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
    //var options = { audio: false, video: { facingMode: "environment", width: { ideal: VideoSize[0] }, height: { ideal: VideoSize[1] } } };
    //var options = { "audio": false, "video": { "facingMode": "environment", "width": { "ideal": VideoSize[0] }, "height": { "ideal": VideoSize[1] } } };

    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        { "audio": false, "video": { "facingMode": "environment", "width": { "ideal": VideoSize[0] }, "height": { "ideal": VideoSize[1] } } }
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

            codevalue.style.width = "360px";
            codevalue.style.height = "200px";
            codevalue.style.textAlign = "left";
            codevalue.style.overflow = "scroll";
            codevalue.contentEditable = "false";

            scanarea.style.display = 'none';
            barcode.style.display = "none";
            qrcode.style.display = "none";
            codearea.style.display = "inline";
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
        codearea.style.display = "none";
        scanarea.style.display = 'none';
    };

    function Scan(first) {

        if (loopflg && looptime >= maxtime) {
            looptime = maxtime + loopspan, searchline = 0, searchNum = 0;
            loopflg = false;
            scaning.disabled = false;

            document.getElementById('info').innerHTML = "バーコードを写してください。";
            numval.innerHTML = "0 / " + String(scancount);
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

            scancount = Math.ceil((w * ScanRate[0]) / 32);
            //scancount = 10 * 2;
            document.getElementById('kind').innerHTML = "";
            document.getElementById('info').innerHTML = "バーコードを写してください。";
            numval.innerHTML = "0 / " + String(scancount);

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

            // 横線
            prev_ctx.beginPath();
            prev_ctx.strokeStyle = "rgb(255,0,0," + tranc + ")";
            prev_ctx.lineWidth = 2;
            prev_ctx.setLineDash([]);
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
            g.addColorStop(0.6, 'rgb(255,255,255,0.2)');
            g.addColorStop(1, 'rgb(255,255,255,0.5)');
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
            prev_ctx.setLineDash([2, 3]);
            prev_ctx.moveTo(((w - (w * ScanRate[0])) / 2) - 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));
            prev_ctx.lineTo(((w - (w * ScanRate[0])) / 2) + (w * ScanRate[0]) + 50, ((h - (w * ScanRate[1])) / 2) + ((w * ScanRate[1]) / 2));

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

        if (tranc <= 0) {
            trancFlg = 0.1;
        } else if (tranc >= maxtranc) {
            trancFlg = -0.1
        }

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
                                //"code_39_vin_reader",
                                //"code_93_reader",
                                "code_128_reader",
                                "codabar_reader"
                            ]
                        },
                        multiple: false,
                        locator: { patchSize: "medium", halfSample: false },
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
            if (searchNum < searchWidth) searchNum += searchlinemove;

            looptime += loopspan;

            if ((searchline + searchlinemove + searchNum) > (w * ScanRate[0])) {
                if (searchline + searchNum < (w * ScanRate[0])) {
                    searchline += ((w * ScanRate[0]) - (searchline + searchNum));
                } else {
                    searchline = 0, searchNum = 0;
                }
            } else {
                searchline += searchlinemove;
            }
        }

        id = setTimeout(Scan, loopspan, flg);
    }

    Quagga.onDetected(function (result, e) {

        if (DetectedCount < scancount) {

            //読み取り誤差のために、複数回連続で同じ値だった場合に成功とする
            if (DetectedCode == result.codeResult.code && DetectedFormat == result.codeResult.format) {
                if (CalcCheckDigit(result.codeResult.code, result.codeResult.format)){
                    DetectedCount++;
                }
            } else {
                looptime = 0;
                DetectedCount = 0;

                DetectedCode = result.codeResult.code, 
                DetectedFormat = result.codeResult.format
            }

            document.getElementById('kind').innerHTML = " Code：" + DetectedCode + " Format：" + barcodeformat(DetectedFormat);
            document.getElementById('info').innerHTML = "バーコードを写してください。";
            numval.innerHTML = String(DetectedCount) + " / " + String(scancount);

            if (DetectedCount >= scancount && DetectedFormat == result.codeResult.format) {

                codevalue.value = result.codeResult.code;

                displayreset();

                scanval.style.display = "inline";
                codearea.style.display = "inline";
                reset.style.display = "inline";
                copyright.style.display = "inline";

                scanarea.style.display = 'none';
                barcode.style.display = "none";
                qrcode.style.display = "none";

                e.stopImmediatePropagation();
            }
        }

    }, false)

    function barcodeformat(barcodeFormat) {

        switch (barcodeFormat) {
            case 'ean_13':
                return 'EAN13(JAN 13)';
                break;
            case 'ean_8':
                return 'EAN8(JAN 8)';
                break;
            case 'code_39':
                return 'CODE39';
                break;
            case 'code_128':
                return 'CODE128';
                break;
            case 'codabar':
                return 'NW-7(CODABAR)';
                break;
        }

    }

    function CalcCheckDigit(barcodeStr, barcodeformat) { // 引数は文字列
        if (barcodeformat == "ean_13") {
            // 短縮用処理
            barcodeStr = ('00000' + barcodeStr).slice(-13);
            let evenNum = 0, oddNum = 0;
            for (var i = 0; i < barcodeStr.length - 1; i++) {
                if (i % 2 == 0) { // 「奇数」かどうか（0から始まるため、iの偶数と奇数が逆）
                    oddNum += parseInt(barcodeStr[i]);
                } else {
                    evenNum += parseInt(barcodeStr[i]);
                }
            }
            // 結果
            return 10 - parseInt((evenNum * 3 + oddNum).toString().slice(-1)) === parseInt(barcodeStr.slice(-1));
        } else if (CalcCheckDigit == "code_39") {
            let Num = 0;
            let checkdigit = (barcodeStr).slice(-1);
            let code = (barcodeStr).slice(0, (barcodeStr.length - 1));

            for (var i = 0; i < code.length - 1; i++) {
                Num += modulus43Char(code[i])
            }
            let remainder = Num % 43;
            // 結果
            return modulus43Char(checkdigit) == modulus43Char(remainder);
        } else {
            return true;
        }
    }

    function displayreset() {

        if (loopflg) {
            Quagga.stop();
        }

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

    function M43(data) {
        //チェックデジット
        var chkdigit = 0;

        var code = (barcodeStr).slice(0, (barcodeStr.length - 1));

        for (var i = 0; i < code.length - 1; i++) {
            Num += modulus43Char(code[i])
        }

        chkdigit = Num % 43;

        return chkdigit;
    }

    function M10W3(data) {

        //チェックデジット
        var chkdigit = 0;

        //デジット計算用
        var sum = 0;
        console.log(data.toString(10));
        //一文字ごとを配列にして回す
        data.toString().split('').forEach(function (val, index) {

            if (index % 2 === 0) {
                //偶数位置の数字を加算し結果を3倍する
                sum = sum + parseInt(val) * 3;
            } else {
                //奇数位置の数字を加算する
                sum = sum + parseInt(val);
            }
        });

        //SUMの10の剰余を計算
        var sum_last_digit = sum % 10;

        //10を引いたのがデジット
        //余りが0の場合は0
        if (sum_last_digit === 0) {
            chkdigit = 0;
        } else {
            chkdigit = 10 - parseInt(sum_last_digit);
        }

        return chkdigit;
    }

    function modulus43Char(str) {

        var s = str.text.toUpperCase();

        switch (s) {
            case '0':
                return 0;
            case '1':
                return 1;
            case '2':
                return 2;
            case '3':
                return 3;
            case '4':
                return 4;
            case '5':
                return 4;
            case '6':
                return 6;
            case '7':
                return 7;
            case '8':
                return 8;
            case '9':
                return 9;

            case 'A':
                return 10;
            case 'B':
                return 11;
            case 'C':
                return 12;
            case 'D':
                return 13;
            case 'E':
                return 14;
            case 'F':
                return 15;
            case 'G':
                return 16;
            case 'H':
                return 17;
            case 'I':
                return 18;
            case 'J':
                return 19;
            case 'K':
                return 20;
            case 'L':
                return 21;
            case 'M':
                return 22;
            case 'N':
                return 23;
            case 'O':
                return 24;
            case 'P':
                return 25;
            case 'Q':
                return 26;
            case 'R':
                return 27;
            case 'S':
                return 28;
            case 'T':
                return 29;
            case 'U':
                return 30;
            case 'V':
                return 31;
            case 'W':
                return 32;
            case 'X':
                return 33;
            case 'Y':
                return 34;
            case 'Z':
                return 35;

            case '-':
                return 36;
            case '.':
                return 37;
            case ' ':
                return 38;
            case '$':
                return 39;
            case '/':
                return 40;
            case '+':
                return 41;
            case '%':
                return 42;
        }
    }
});
