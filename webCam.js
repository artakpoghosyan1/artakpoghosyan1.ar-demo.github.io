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

        "float band(float t, float start, float end, float blur){\r\n"+
        "   float step1 = smoothstep(start - blur, start + blur, t);\r\n"+
        "   float step2 = smoothstep(end + blur, end - blur, t);\r\n"+
        "   return min(step1, step2);\r\n"+
        "}\r\n"+

        "void main(void) {\r\n"+

        "    float num = 3.0;\r\n"+
        "    vec2 uv = vUV;\r\n"+
        "   float offset = 1./num;\r\n"+
        "   float crop = 0.2;\r\n"+
        "   float feather = 0.1;\r\n"+
        "   vec4 color = vec4(0);\r\n"+
        "   for (float i = 0.; i < num; i ++) {\r\n"+
        "       float xOffset = fract(uv.x - i * offset + crop + 1.3);\r\n"+
        "       float bleed = band(xOffset, crop, 1. - crop, feather);\r\n"+
        "       color += texture(textureSampler, vec2(xOffset,uv.y)) * bleed;\r\n"+
        "   }\r\n"+
        "   color.a = 1.;\r\n"+
        "   gl_FragColor = color;\r\n"+
        "}\r\n";

    var myVideo;
    var isAssigned = false;

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);

    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.fov = Math.PI/1.61
    let viewWidth = window.innerWidth
    let viewHeight = window.innerHeight

    var plane1 = BABYLON.Mesh.CreatePlane("plane1", 7, scene);
    plane1.rotation.z = Math.PI;
    plane1.position.z = -2.35;
    camera.setTarget(BABYLON.Vector3.Zero());

    let aspect = viewWidth/viewHeight;
    plane1.scaling.x = aspect;

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
    }, { minWidth: 1280, minHeight: 720, maxWidth: 1280, maxHeight: 720, aspectRatio: 1.7777777778});

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
