var TextParticles = function(){
	//first just get particles bouncing around in a box

	this.grid = new THREE.PointCloud(new THREE.PlaneGeometry(100, 100, 64, 64), new THREE.PointCloudMaterial({color: 0xff0000}));
	scene.add(this.grid);

}


TextParticles.prototype.update = function(){
	this.grid.geometry.vertices[0].x+=.1;
	this.grid.geometry.verticesNeedUpdate = true;
}