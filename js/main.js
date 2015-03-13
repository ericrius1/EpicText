var scene, camera, renderer, controls, line, textParticles;


var init = function(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 100000);
	camera.position.z = 250;
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild(renderer.domElement);




	controls = new THREE.OrbitControls(camera);

	textParticles = new TextParticles();

}


var animate = function(){
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);

	textParticles.update();

}

function onWindowResize(){

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function map(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

window.addEventListener('resize', onWindowResize)



init();
animate();	