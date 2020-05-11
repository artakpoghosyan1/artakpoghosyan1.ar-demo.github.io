const start = document.getElementById('start');
const loader = document.querySelector('.video-loader');
const retry = document.getElementById('retry');
const ok = document.getElementById('ok');
const video = document.getElementById('video');
const videoWrapper = document.getElementById('video-wrapper');
const share = document.getElementById('share');

const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
const scene = createScene();

function videoRecorder() {
    if (BABYLON.VideoRecorder.IsSupported(engine)) {
        return new BABYLON.VideoRecorder(engine, {fps: 30});
    }

    return null
}

const recorder = videoRecorder();

start.addEventListener('click', function () {
    if (recorder) {
        videoWrapper.classList.remove('show');

        loader.classList.add('recording');
        recorder.startRecording().then(function (blob) {
            const newBlob = new Blob([blob]);
            const url = URL.createObjectURL(newBlob);
            video.src = url;
        });

        setTimeout(() => {
            recorder.stopRecording()
            if(!videoWrapper.classList.contains('show')) {
                // loader.classList.remove('recording');
                videoWrapper.classList.add('show');
            }
        }, 5000);
    }
});

retry.addEventListener('click', function () {
    videoWrapper.classList.remove('show');
    loader.classList.remove('recording');
    share.classList.remove('show-share')
});

ok.addEventListener('click', function () {
    if(share.classList.contains('show-share')) {
        share.classList.remove('show-share')
    } else {
        share.classList.add('show-share')
    }
});

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});
