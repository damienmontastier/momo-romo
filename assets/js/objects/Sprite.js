import * as THREE from "three";

var callback = null

class TileTextureAnimator {
  constructor(
    sprite,
    texture,
    hTiles,
    vTiles,
    durationTile,
    tileStart = 0,
    tileEnd = hTiles * vTiles
  ) {
    this.sprite = sprite;
    this.texture = texture;
    this.tileStart = tileStart;
    this.tileEnd = parseInt(tileEnd) + 1;
    // current tile number
    this.currentTile = tileStart;
    // duration of every tile
    this.durationTile = durationTile;
    // internal time counter
    this.currentTime = 0;
    // amount of horizontal and vertical tiles, and total count of tiles
    this.hTiles = hTiles;
    this.vTiles = vTiles;
    this.cntTiles = this.hTiles * this.vTiles;
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.flipY = this.texture.flipX = false;
    this.texture.repeat.set(1 / this.hTiles, -1 / this.vTiles);

    // this.setOffset();
  }

  setOffset() {
    let indexColumn = this.currentTile % this.hTiles;
    let indexRow = Math.floor(this.currentTile / this.hTiles) +1;
    this.texture.offset.x = indexColumn / this.hTiles;
    this.texture.offset.y = indexRow / this.vTiles;
  }

  update(delta) {
    this.currentTime += delta;
    while (this.currentTime > this.durationTile) {
      this.currentTime -= this.durationTile;
      if (this.currentTile == this.tileEnd) {
        this.currentTile = this.tileStart;
      }

      this.setOffset();
      this.currentTile++;
    }
    if(this.currentTile === this.tileEnd) {
      console.log('Should change', this);
      if (this.sprite.promiser) {
        console.log('Should resolve');
        this.sprite.promiser.resolve();
        this.sprite.promiser = null;
      }
      //END
      
      // if(callback != null) {
      //   callback()
      //   callback = null
      // }
    }
    
  }
  
}

export default class Sprite extends THREE.Object3D {
  constructor(opts = {}) {
    super()
    this.options = opts;
    this.spriteMaps = [];
    this.texture = new THREE.TextureLoader().load(opts.texture);
    this.options.sprites.forEach(sprite => {
      let animator = new TileTextureAnimator(
        this,
        this.texture,
        opts.w,
        opts.h,
        sprite.durationTile,
        parseInt(sprite.start),
        parseInt(sprite.end)
      );
      // animator.on('end', () => {
        
      // })
      let material = new THREE.SpriteMaterial({
        // map: sprite.texture,
        // color: 0xffffff,
        // useScreenCoordinates: false,
        // side: THREE.DoubleSide,
        transparent: true,
      });

      this.spriteMaps.push({
        id: sprite.id,
        animator: animator,
        material: material,
        // texture: texture,
      });
    });

    this.spriteMaterial = new THREE.SpriteMaterial({
      map: this.texture,
      // color: 0xffffff,
      // useScreenCoordinates: false,
      // side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    this.add(new THREE.Sprite(this.spriteMaterial));
  }

  update(t) {
    if(this.animation) {
      this.animation.update(t);
    }
    
  }

  changeState(id,cback) {
    this.promiser = new Promise(()=>{
      let sprite = this.spriteMaps.find(sprite => sprite.id === id);

      if(sprite){
        this.currentSpriteID = id
  
        console.log(id)
  
        this.animation = sprite.animator;
        this.animation.currentTile = this.animation.tileStart;
        this.animation.currentTime = 0;
        this.animation.setOffset();
        // if(cback) {
        //   console.log('OUI CLL',cback)
        //   callback = cback
        //   console.log(callback,Date.now())
        // } 
      }
    })

    console.log(this, this.promiser)
    return this.promiser;
  }
}