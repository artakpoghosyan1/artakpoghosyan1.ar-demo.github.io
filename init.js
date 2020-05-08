const start = document.getElementById('start');
const stop = document.getElementById('stop');
const circle = document.querySelector('.circle');
const play = document.getElementById('play');
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

        circle.classList.add('animate-circle');
        recorder.startRecording(null).then(function (blob) {
            const newBlob = new Blob([blob]);
            const url = URL.createObjectURL(newBlob);
            localStorage.setItem('video', JSON.stringify(url))
        });
    }
});

stop.addEventListener('click', function () {
    if (recorder) {
        circle.classList.remove('animate-circle');
        recorder.stopRecording();
        if(!videoWrapper.classList.contains('show')) {
            videoWrapper.classList.add('show');
        }
    }
});

play.addEventListener('click', function () {
    const url = localStorage.getItem('video');

    video.src = JSON.parse(url)
});

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});
