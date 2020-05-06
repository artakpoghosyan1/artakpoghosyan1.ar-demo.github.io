// You have to create a function called createScene. This function must return a BABYLON.Scene object
// You can reference the following variables: scene, canvas
// You must at least define a camera
// More info here: https://doc.babylonjs.com/generals/The_Playground_Tutorial

let canvas = document.getElementById("renderCanvas");

var createScene = function() {
    BABYLON.Effect.ShadersStore["customVertexShader"] = "\r\n" +
        "precision highp float;\r\n" +

        "// Attributes\r\n" +
        "attribute vec3 position;\r\n" +
        "attribute vec2 uv;\r\n" +

        "// Uniforms\r\n" +
        "uniform mat4 worldViewProjection;\r\n" +

        "// Varying\r\n" +
        "varying vec2 vUV;\r\n" +

        "void main(void) {\r\n" +
        "    gl_Position = worldViewProjection * vec4(position, 1.0);\r\n" +

        "    vUV = uv;\r\n" +
        "}\r\n";

    BABYLON.Effect.ShadersStore["customFragmentShader"] = "\r\n" +
        "precision highp float;\r\n" +

        "varying vec2 vUV;\r\n" +

        "uniform sampler2D textureSampler;\r\n" +

        "void main(void) {\r\n" +
        "    gl_FragColor = texture2D(textureSampler, vUV);\r\n" +
        "}\r\n";

    var myVideo;
    var isAssigned = false;

    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -10), scene);
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));
    camera.attachControl(canvas, true);

    var plane1 = BABYLON.Mesh.CreatePlane("plane1", 7, scene);
    plane1.rotation.z = Math.PI;
    plane1.position.y = 1;

    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene,
        {
            vertex: "custom",
            fragment: "custom",
        },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
        });
    shaderMaterial.backFaceCulling = false;

    // Create our video texture
    BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
        myVideo = videoTexture;
        shaderMaterial.setTexture("textureSampler", myVideo);
    }, { width: 720, height: 1280 });

    scene.onBeforeRenderObservable.add(function () {
        if (myVideo !== undefined && isAssigned == false) {
            if (myVideo.video.readyState == 4) {
                plane1.material = shaderMaterial;
                isAssigned = true;
            }
        }
    });

    return scene;
};

let engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
let scene = createScene();

if (BABYLON.VideoRecorder.IsSupported(engine)) {
    var recorder = new BABYLON.VideoRecorder(engine);
    recorder.startRecording();
    setTimeout(() => {
        recorder.stopRecording()
    }, 2000);
}

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});
