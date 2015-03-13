var TextParticles = function(){
	//first just get particles bouncing around in a box
  var size = 100;
	this.pCloud = new THREE.PointCloud(new THREE.PlaneGeometry(size, size, 128, 128), new THREE.PointCloudMaterial({color: 0xff0000}));
	scene.add(this.pCloud);

  this.particles = this.pCloud.geometry.vertices;
	//initialize particles with velocity and acceleration;
	for(var i = 0; i < this.particles.length; i++){
		this.particles[i].velocity = new THREE.Vector3(randFloat(-.1, .1), 0, 0);
  console.log('total particles:', this.particles.length)
  }

  //initialize grid
  var cellSize = 10;
  this.grid = [];
  for(var x = -size/2; x < size/2; x+=cellSize){
    for(y = -size/2; y < size/2; y+= cellSize){
      var cell = {
        min: new THREE.Vector2(x, y),
        max: new THREE.Vector2(x + cellSize, y+cellSize),
        impulse: new THREE.Vector3(0, randFloat(-.001, .001), 0)
      }
      this.grid.push(cell);

    }

  }



}



TextParticles.prototype.update = function(){

	for(var i = 0; i < this.particles.length; i++){
    //add velocity to each particles position
    this.particles[i].add(this.particles[i].velocity);
  }
  this.pCloud.geometry.verticesNeedUpdate = true;
}