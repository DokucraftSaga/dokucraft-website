var scene, camera, renderer, controls;
var container = $("#panorama-viewer");

var element = document.body;

var pointerlockchange = function (event) {
  if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
    $("body").css("overflow-y", "hidden");
    container.css("display", "block");
    controls.enabled = true;
  } else {
    $("body").css("overflow-y", "auto");
    container.css("display", "none");
    controls.enabled = false;
  }
}

document.addEventListener("pointerlockchange", pointerlockchange, false);
document.addEventListener("mozpointerlockchange", pointerlockchange, false);
document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

new ResizeSensor(container.get(), function() {
  if (typeof scene != 'undefined') {
    camera.aspect = container.innerWidth() / container.innerHeight();
    camera.updateProjectionMatrix();
    renderer.setSize(container.innerWidth(), container.innerHeight());
  }
});

function init() {
  scene = new THREE.Scene();

  var SCREEN_WIDTH = container.innerWidth(), SCREEN_HEIGHT = container.innerHeight();
  camera = new THREE.PerspectiveCamera(65, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 20000);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  container.append(renderer.domElement);

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());
  
  var imagePrefix = "/resources" + dokucraft_pack_path + "/panorama/";
  var directions  = ["panorama1", "panorama3", "panorama4", "panorama5", "panorama0", "panorama2"];
  var imageSuffix = ".png";
  var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000); 
  
  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
      side: THREE.BackSide
    }));
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skyBox);

  $("body").css("overflow-y", "hidden");
  container.css("display", "block");
  controls.enabled = true;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();