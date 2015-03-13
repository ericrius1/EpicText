var scene, camera, renderer;





var init = function(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 100000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	var mesh  = new THREE.Mesh(new THREE.SphereGeometry(5));
	mesh.position.z = -20;
	scene.add(mesh);
}


var animate = function(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function onWindowResize(){

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize)



init();
animate();	