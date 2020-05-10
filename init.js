const start = document.getElementById('start');
const loader = document.querySelector('.video-loader');
const retry = document.getElementById('retry');
const ok = document.getElementById('ok');
const video = document.getElementById('video');
const videoWrapper = document.getElementById('video-wrapper');

const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
const scene = createScene();

function videoRecorder() {
    if (BABYLON.VideoRecorder.IsSupported(engine)) {
        return new BABYLON.VideoRecorder(engine);
    }

    return null
}

const recorder = videoRecorder();

start.addEventListener('click', function () {
    if (recorder) {
        videoWrapper.classList.remove('show');

        loader.classList.add('recording');
        recorder.startRecording(null).then(function (blob) {
            const newBlob = new Blob([blob]);
            const url = URL.createObjectURL(newBlob);
            video.src = url
        });

        setTimeout(() => {
            recorder.stopRecording()
            if(!videoWrapper.classList.contains('show')) {
                // loader.classList.remove('recording');
                videoWrapper.classList.add('show');
            }
        }, 2000);
    }
});

retry.addEventListener('click', function () {
    videoWrapper.classList.remove('show');
    loader.classList.remove('recording');
});

// play.addEventListener('click', function () {
//     const url = localStorage.getItem('video');
//
//     video.src = JSON.parse(url)
// });

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});
