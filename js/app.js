const btn = document.getElementById('btn');
const modal = document.getElementById('modal');

btn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    Quagga.init(
        {
            inputStream: {
                type: 'LiveStream',
                constraints: {
                    width: window.innerWidth
                },
            },
            decoder: {
                readers: [
                    {
                        format: 'ean_reader',
                        config: {},
                    },
                ],
            },
        },
        (err) => {
            if (!err) {
                Quagga.start();
            } else {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                Quagga.stop();
                alert(
                    'この機能を利用するには\nブラウザのカメラ利用を許可してください。'
                );
            }
        }
    );
});

Quagga.onDetected((result) => {
    const code = result.codeResult.code;
    if (/^4[5|9]/.test(code)) {
        document.getElementById('code').value = code;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        Quagga.stop();
    }
});