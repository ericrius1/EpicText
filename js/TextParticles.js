var TextParticles = function(){
	//first just get particles bouncing around in a box

	this.pCloud = new THREE.PointCloud(new THREE.PlaneGeometry(100, 100, 256, 256), new THREE.PointCloudMaterial({color: 0xff0000}));
	scene.add(this.pCloud);

  this.particles = this.pCloud.geometry.vertices;
	//initialize particles with velocity and acceleration;
	for(var i = 0; i < this.particles.length; i++){
		this.particles[i].velocity = new THREE.Vector3(randFloat(-.1, .1), 0, 0);
    this.particles[i].acceleration = new THREE.Vector3(0, randFloat(-.001, .001), 0);
	}
  console.log('total particles:', this.particles.length)



}



TextParticles.prototype.update = function(){

	for(var i = 0; i < this.particles.length; i++){
    //add velocity to each particles position
    this.particles[i].velocity.add(this.particles[i].acceleration);
    this.particles[i].add(this.particles[i].velocity);
  }
  this.pCloud.geometry.verticesNeedUpdate = true;
}