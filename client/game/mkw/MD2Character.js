import THREE from "three";

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MD2Character = function () {

    var scope = this;

    this.scale = 1;
    this.animationFPS = 6;

    this.root = new THREE.Object3D();

    this.meshBody = null;
    this.meshWeapon = null;

    this.skinsBody = [];
    this.skinsWeapon = [];

    this.weapons = [];

    this.activeAnimation = null;

    this.mixer = null;

    this.onLoadComplete = function () {
    };

    this.loadCounter = 0;

    this.loadParts = function (config) {

        this.loadCounter = config.weapons.length * 2 + config.skins.length + 1;

        var weaponsTextures = [];
        for (var i = 0; i < config.weapons.length; i++) weaponsTextures[i] = config.weapons[i][1];
        // SKINS

        this.skinsBody = loadTextures(config.baseUrl + "skins/", config.skins);
        this.skinsWeapon = loadTextures(config.baseUrl + "skins/", weaponsTextures);

        // BODY

        var loader = new THREE.MD2Loader();

        loader.load(config.baseUrl + config.body, function (geo) {

            geo.computeBoundingBox();
            scope.root.position.y = -scope.scale * geo.boundingBox.min.y;

            var mesh = createPart(geo, scope.skinsBody[0]);
            mesh.scale.set(scope.scale, scope.scale, scope.scale);

            scope.root.add(mesh);

            scope.meshBody = mesh;

            scope.meshBody.clipOffset = 0;
            scope.activeAnimationClipName = mesh.geometry.animations[0].name;

            scope.mixer = new THREE.AnimationMixer(mesh);

            checkLoadingComplete();

        });

        // WEAPONS

        var generateCallback = function (index, name) {

            return function (geo) {

                var mesh = createPart(geo, scope.skinsWeapon[index]);
                mesh.scale.set(scope.scale, scope.scale, scope.scale);
                mesh.visible = false;

                mesh.name = name;

                scope.root.add(mesh);

                scope.weapons[index] = mesh;
                scope.meshWeapon = mesh;

                checkLoadingComplete();

            }

        };

        for (var i = 0; i < config.weapons.length; i++) {

            loader.load(config.baseUrl + config.weapons[i][0], generateCallback(i, config.weapons[i][0]));

        }

    };

    this.setPlaybackRate = function (rate) {

        if (rate !== 0) {
            this.mixer.timeScale = 1 / rate;
        }
        else {
            this.mixer.timeScale = 0;
        }

    };

    this.setWireframe = function (wireframeEnabled) {

        if (wireframeEnabled) {

            if (this.meshBody) this.meshBody.material = this.meshBody.materialWireframe;
            if (this.meshWeapon) this.meshWeapon.material = this.meshWeapon.materialWireframe;

        } else {

            if (this.meshBody) this.meshBody.material = this.meshBody.materialTexture;
            if (this.meshWeapon) this.meshWeapon.material = this.meshWeapon.materialTexture;

        }

    };

    this.setSkin = function (index) {

        if (this.meshBody && this.meshBody.material.wireframe === false) {

            this.meshBody.material.map = this.skinsBody[index];

        }

    };

    this.setWeapon = function (index) {

        for (var i = 0; i < this.weapons.length; i++) this.weapons[i].visible = false;

        var activeWeapon = this.weapons[index];

        if (activeWeapon) {

            activeWeapon.visible = true;
            this.meshWeapon = activeWeapon;

            scope.syncWeaponAnimation();

        }

    };

    this.setAnimation = function (clipName) {


        if (this.meshBody) {

            if (this.meshBody.activeAction) {
                this.meshBody.activeAction.stop();
                this.meshBody.activeAction = null;
            }

            var action = this.mixer.clipAction(clipName, this.meshBody);
            if (action) {

                this.meshBody.activeAction = action.play();

            }

        }

        scope.activeClipName = clipName;

        scope.syncWeaponAnimation();

    };

    this.syncWeaponAnimation = function () {

        var clipName = scope.activeClipName;

        if (scope.meshWeapon) {

            if (this.meshWeapon.activeAction) {
                this.meshWeapon.activeAction.stop();
                this.meshWeapon.activeAction = null;
            }

            var geometry = this.meshWeapon.geometry,
                animations = geometry.animations;

            var action = this.mixer.clipAction(clipName, this.meshWeapon);
            if (action) {

                this.meshWeapon.activeAction =
                    action.syncWith(this.meshBody.activeAction).play();

            }

        }

    }

    this.Way = {};
    this.moveTo = 0;
    this.ZPO = [];
    this.cPO = 0;
    this.walkSpeed = 190;

    this.getOrient = function (x1, x2, y1, y2) {
        return -Math.atan2((y2 - y1), (x2 - x1)) + Math.PI / 2;
    };

    this.move = function (position) {

        //Собираем точки
        if (position) {
            //console.log(this.root.position.clone());

            this.moveTo = 0;

            var p = this.meshBody.position.clone();

            var angle = this.getOrient(p.x, position.x, p.z, position.z);// * (180 / Math.PI);

            var V = {
                rotate: function (p, degrees) {
                    var radians = degrees * Math.PI / 180,
                        c = Math.cos(radians),
                        s = Math.sin(radians);
                    return [c * p[0] - s * p[1], s * p[0] + c * p[1]];
                },
                scale: function (p, n) {
                    return [n * p[0], n * p[1]];
                },
                add: function (a, b) {
                    return [a[0] + b[0], a[1] + b[1]];
                },
                minus: function (a, b) {
                    return [a[0] - b[0], a[1] - b[1]];
                }
            };

            var params = {
                start: {x: p.x, y: p.z, angle: angle, length: 0.3},
                end: {x: position.x, y: position.z, angle: 0, length: 0.2}
            };

            var p1 = [params.start.x, params.start.y];
            var p4 = [params.end.x, params.end.y];

            var v14 = V.minus(p4, p1);

            var p2 = V.add(p1, V.rotate(V.scale(v14, params.start.length), params.start.angle));
            var p3 = V.add(p4, V.rotate(V.scale(V.scale(v14, -1), params.end.length), params.end.angle));

            this.ZPO = [];
            //let VZPO = new THREE.Geometry();
            for (var tM = 0; tM < 1; tM += 0.05) {
                var t = 1 - tM;
                var f1 = (t * t * t), f2 = (3 * t * t * (1 - t)), f3 = (3 * t * (1 - t) * (1 - t)), f4 = ((1 - t) * (1 - t) * (1 - t));

                this.ZPO.push({
                    x: ( p1[0] * f1 + p2[0] * f2 + p3[0] * f3 + p4[0] * f4 + .5 ) | 0,
                    y: 1,
                    z: ( p1[1] * f1 + p2[1] * f2 + p3[1] * f3 + p4[1] * f4 + .5 ) | 0
                });

                //VZPO.vertices.push(new THREE.Vector3(( p1[0] * f1 + p2[0] * f2 + p3[0] * f3 + p4[0] * f4 + .5 ) | 0, 0, ( p1[1] * f1 + p2[1] * f2 + p3[1] * f3 + p4[1] * f4 + .5 ) | 0));
            }

            //scene.add(new THREE.Points(VZPO, new THREE.PointsMaterial({ size: 9, sizeAttenuation: false, color: 0xff0000 })));

            this.cPO = 0;
            this.meshBody.rotation.y = this.getOrient(this.root.position.x, position.x, this.root.position.z, position.z) - Math.PI / 2;// -Math.atan2(this.Way.dz, this.Way.dx) + Math.PI / 2;
        }

        if (this.cPO < this.ZPO.length) {
            //console.log('cPO', this.cPO);
            //this.Way = this.ZPO.vertices[this.cPO].clone();
            this.Way = this.ZPO[this.cPO];

            this.Way.dx = this.Way.x - this.meshBody.position.x;
            this.Way.dz = this.Way.z - this.meshBody.position.z;
            this.Way.line = Math.sqrt(this.Way.dx * this.Way.dx + this.Way.dz * this.Way.dz);

            this.moveTo = 1;
        } else {
            this.moveTo = 0;
            this.setAnimation('stand');
        }
    };

    this.moveA = function (delta) {

        var P = this.meshBody.position.clone();

        var d = Math.sqrt(Math.abs((P.x - this.Way.x) * (P.x - this.Way.x) + (P.z - this.Way.z) * (P.z - this.Way.z)));

        if (d <= 6) {
            this.cPO++;
            this.move();
        } else {
            if(this.activeClipName != 'run') {
                this.setAnimation('run');
            }

            //this.meshBody.rotation.y = this.getOrient(P.x, this.Way.x, P.z, this.Way.z) - Math.PI / 2;

            this.meshBody.position.x += this.Way.dx * delta * this.walkSpeed * 1.5 / this.Way.line;
            this.meshBody.position.z += this.Way.dz * delta * this.walkSpeed * 1.5 / this.Way.line;
        }
    };

    this.update = function (delta) {

        if (this.moveTo == 1) {
            this.moveA(delta);
        }

        if (this.mixer) this.mixer.update(delta);

    };

    function loadTextures(baseUrl, textureUrls) {

        var textureLoader = new THREE.TextureLoader();
        var textures = [];

        for (var i = 0; i < textureUrls.length; i++) {

            textures[i] = textureLoader.load(baseUrl + textureUrls[i], checkLoadingComplete);
            textures[i].mapping = THREE.UVMapping;
            textures[i].name = textureUrls[i];

        }

        return textures;

    }

    function createPart(geometry, skinMap) {

        var materialWireframe = new THREE.MeshLambertMaterial({
            color: 0xffaa00,
            wireframe: true,
            morphTargets: true,
            morphNormals: true
        });
        var materialTexture = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            wireframe: false,
            map: skinMap,
            morphTargets: true,
            morphNormals: true
        });

        //

        var mesh = new THREE.Mesh(geometry, materialTexture);
        mesh.rotation.y = -Math.PI / 2;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        //

        mesh.materialTexture = materialTexture;
        mesh.materialWireframe = materialWireframe;

        return mesh;

    }

    function checkLoadingComplete() {

        scope.loadCounter -= 1;

        if (scope.loadCounter === 0) scope.onLoadComplete();

    }

};
