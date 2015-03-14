var TextParticles = function() {
  //first just get particles bouncing around in a box
  this.gridSize = 100;
  this.cellSize =10;
  this.minImpulse = new THREE.Vector3(-0.01, -.01, 0);
  this.maxImpulse = new THREE.Vector3(0.01, .01, 0);
  this.minImpulseLength = this.minImpulse.length();
  this.maxImpulseLength = this.maxImpulse.length();
  this.tmpVector = new THREE.Vector3();
  this.hue = 0.8;
  this.saturation = 1;

  this.numParticles = 10;


  this.gridContainer = new THREE.Object3D();
  scene.add(this.gridContainer);

  this.gridContainer.position.x = -50;
  var pCloudGeo = new THREE.Geometry();
  for (var i = 0; i < this.numParticles; i++) {
    pCloudGeo.vertices.push(new THREE.Vector3(randFloat(40, 50), randFloat(40, 50), 0));
  }
  this.pCloud = new THREE.PointCloud(pCloudGeo, new THREE.PointCloudMaterial({
    color: 0xff0000
  }));
  this.pCloud.position.copy(this.gridContainer.position)
  scene.add(this.pCloud);

  this.yDown = new THREE.Vector3(0, -1, 0);
  this.yUp = new THREE.Vector3(0, 1, 0);
  this.xRight = new THREE.Vector3(1, 0, 0);
  this.xLeft = new THREE.Vector3(-1, 0, 0);

  this.particles = this.pCloud.geometry.vertices;
  this.tmpParticle = null;
  //initialize particles with velocity and acceleration;


  //initialize grid
  this.grid = [];
  var quadGeo = new THREE.PlaneBufferGeometry(this.cellSize, this.cellSize);
  var xIndex, yIndex;
  var count = 0;
  var arrowGeo = new THREE.Geometry();
  arrowGeo.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-.2, .7, 0),
      new THREE.Vector3(0,1,0),
      new THREE.Vector3(.2, .7, 0)

    );

  var arrowMat = new THREE.LineBasicMaterial({color: new THREE.Color(0x0cde0a)});
  var arrow = new THREE.Line(arrowGeo, arrowMat, THREE.LinePieces);
  arrow.scale.multiplyScalar(this.cellSize)

  for (var x = 0; x < this.gridSize; x += this.cellSize) {
    xIndex = Math.floor(x / this.cellSize);
    if (!this.grid[xIndex]) {
      this.grid[xIndex] = [];
    }
    for (y = 0; y < this.gridSize; y += this.cellSize, count++) {
      var cellMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(this.hue, this.saturation, 0.5),
        transparent: true,
        opacity: 0.5
      });
      var cell = {
        impulse: new THREE.Vector3(this.maxImpulse.x/2, 0, 0),
        mesh: new THREE.Mesh(quadGeo, cellMat),
        arrow: arrow.clone(),
        id: count
      }
      cell.arrow.rotation.z = cell.impulse.x * 10
      this.gridContainer.add(cell.mesh)
      this.gridContainer.add(cell.arrow)
      cell.arrow.position.set(x + this.cellSize/2, y+this.cellSize/2, 0);
      cell.mesh.position.set(x + this.cellSize / 2, y + this.cellSize / 2, -1)
      this.grid[xIndex].push(cell);

    }

  }

  //now go through particles, assign random velocity, and assign it whatever cell it's currently in
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].velocity = new THREE.Vector3(0, randFloat(.1, .2), 0);

    this.xIndex = Math.min(Math.max(0, Math.floor(this.particles[i].x / this.cellSize)), this.grid[0].length - 1);
    this.yIndex = Math.min(Math.max(0, Math.floor(this.particles[i].y / this.cellSize)), this.grid[0].length - 1);
    this.particles[i].currentCell = this.grid[this.xIndex][this.yIndex];
  }



}



TextParticles.prototype.update = function() {

  for (var i = 0; i < this.particles.length; i++) {
    //add velocity to each particles position
    this.tmpParticle = this.particles[i];
    this.tmpParticle.add(this.tmpParticle.velocity);

    //Find the cell this point is in
    this.xIndex = Math.min(Math.max(0, Math.floor(this.tmpParticle.x / this.cellSize)), this.grid[0].length - 1);
    this.yIndex = Math.min(Math.max(0, Math.floor(this.tmpParticle.y / this.cellSize)), this.grid[0].length - 1);
    var cell = this.grid[this.xIndex][this.yIndex];
    if(this.tmpParticle.currentCell.id !== cell.id){
      this.tmpParticle.velocity.add(cell.impulse);
      //If particle has exitied cell, subtracts its velocity from impulse of cell and assign current cell to new cell
      this.tmpParticle.currentCell = cell;

      //TODO: Add clamping to keep within range of min and max impulse
      this.tmpVector.copy(this.tmpParticle.velocity)
      cell.impulse.sub(this.tmpVector.multiplyScalar(0.001)).clamp(this.minImpulse, this.maxImpulse);
    }
    if (this.tmpParticle.y >= this.gridSize) {
      this.tmpParticle.velocity.reflect(this.yDown);
      this.tmpParticle.y = this.gridSize;
    }
    if (this.tmpParticle.y <= 0) {
      this.tmpParticle.velocity.reflect(this.yUp);
      this.tmpParticle.y = 0;
    }
    if (this.tmpParticle.x <= 0) {
      this.tmpParticle.velocity.reflect(this.xRight);
      this.tmpParticle.x = 0;
    }
    if (this.tmpParticle.x >= this.gridSize) {
      this.tmpParticle.velocity.reflect(this.xLeft);
      this.tmpParticle.x = this.gridSize;
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