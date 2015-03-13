var TextParticles = function() {
  //first just get particles bouncing around in a box
  this.size = 100;
  this.minImpulse = new THREE.Vector3(0, -.1, 0);
  this.maxImpulse = new THREE.Vector3(0, .1, 0);
  this.minImpulseLength = this.minImpulse.length();
  this.maxImpulseLength = this.maxImpulse.length();
  this.hue = 0.8;
  this.saturation = 1;
  this.numParticles = 100;
  this.gridContainer = new THREE.Object3D();
  scene.add(this.gridContainer);

  this.gridContainer.position.x = -50;
  var pCloudGeo = new THREE.Geometry();
  for (var i = 0; i < this.numParticles; i++) {
    pCloudGeo.vertices.push(new THREE.Vector3(randFloat(0, this.size), randFloat(0, this.size), 0));
  }
  this.pCloud = new THREE.PointCloud(pCloudGeo, new THREE.PointCloudMaterial({
    color: 0xff0000
  }));
  this.pCloud.position.copy(this.gridContainer.position)
  scene.add(this.pCloud);
  this.xNormalDown = new THREE.Vector3(0, -1, 0);
  this.xNormalUp = new THREE.Vector3(0, 1, 0);

  this.particles = this.pCloud.geometry.vertices;
  this.tmpParticle = null;
  //initialize particles with velocity and acceleration;

  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].velocity = new THREE.Vector3(0, randFloat(-1, 1), 0);
  }

  //initialize grid
  this.cellSize = 10;
  this.grid = [];
  var quadGeo = new THREE.PlaneBufferGeometry(this.cellSize, this.cellSize);
  var xIndex, yIndex;
  for (var x = 0; x < this.size; x += this.cellSize) {
    xIndex = Math.floor(x / this.cellSize);
    if (!this.grid[xIndex]) {
      this.grid[xIndex] = [];
    }
    for (y = 0; y < this.size; y += this.cellSize) {
      var cellMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(this.hue, this.saturation, 0.5),
        transparent: true,
        opacity: 0.5
      });
      var cell = {
        impulse: new THREE.Vector3(.01, randFloat(this.minImpulse.y, this.maxImpulse.y), 0.01),
        mesh: new THREE.Mesh(quadGeo, cellMat)
      }
      this.gridContainer.add(cell.mesh)//
      cell.mesh.position.set(x + this.cellSize/2,y + this.cellSize/2,-1)
      this.grid[xIndex].push(cell);

    }

  }



}



TextParticles.prototype.update = function() {
  
  for (var i = 0; i < this.particles.length; i++) {
    //add velocity to each particles position
    this.tmpParticle = this.particles[i];
    this.tmpParticle.add(this.tmpParticle.velocity);

    //Find the cell this point is in
    this.xIndex = Math.floor((this.tmpParticle.x) / this.cellSize);
    this.yIndex = Math.min(Math.max(0, Math.floor(this.tmpParticle.y / this.cellSize)), this.grid[0].length-1);
    var cell = this.grid[this.xIndex][this.yIndex];
    if(!cell){
      debugger
    }
    cell.mesh.material.color.setHex(0xff0000)




    if (this.tmpParticle.y >= this.size) {
      this.tmpParticle.velocity.reflect(this.xNormalDown);
    }
    if (this.tmpParticle.y <= 0) {
      this.tmpParticle.velocity.reflect(this.xNormalUp);
    }
  }
  this.pCloud.geometry.verticesNeedUpdate = true;


  //update cell colors
  for (var x = 0; x < this.grid.length; x++) {
    for (var y = 0; y < this.grid[x].length; y++) {

      var lightness = map(this.grid[x][y].impulse.length(), 0, this.maxImpulseLength, .1, 0.8);
      this.grid[x][y].mesh.material.color.setHSL(this.hue, this.saturation, lightness)
    }
  }

}