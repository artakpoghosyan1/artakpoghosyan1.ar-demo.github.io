/*
let canvas = document.getElementById("renderCanvas");
let createScene = function () {
    let scene = new BABYLON.Scene(engine);
    let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		light.intensity = 0.7;
    let ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        
	let url;
	let fileName;
		
//-- BoomBox.gltf
	url = "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/scenes/BoomBox/";
	fileName = "BoomBox.gltf";

	BABYLON.SceneLoader.ImportMesh("", url, fileName, scene, function (newMeshes) {
		let mesh = newMeshes[0];
			mesh.position.copyFromFloats(0, 1, 0);
			mesh.scaling.copyFromFloats(100,100,100);
			
		camera.target = mesh;
		console.log(mesh)
	});
    return scene;
};

let engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
let scene = createScene();

   engine.runRenderLoop(function () {
	if (scene) {
		scene.render();
	}
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});
*/
