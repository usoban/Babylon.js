var
  ROTATE_LEFT = -1,
  ROTATE_NONE = 0,
  ROTATE_RIGHT = 1,
  MMWAR;

MMWAR = function () {
  var
    canvas,
    engine,
    scene,
    startup,
    meshes,
    loadScene,
    setupLights,
    setupSkybox,
    setupCamera,
    setupNavmesh,
    loadMeshes,
    setupNet,
    whoopDaHoop,
    ground,
    groundNavMesh,
    navigation,
    correctY,
    waypoints,
    vehicles = [],
    computeOrientationNormal,
    computeRotationQuat,
    vehicleTravelPath,
    computePathRotation,
    jetRotationAnimation,
    net,
    em,
    isSender = window.location.hash === '#1',
    missile,
    missiles,
    fireMissile,
    highlightMesh,
    explosionWithShader;

  startup = function () {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true, {stencil: true});

    loadScene();
  };

  loadScene = function () {
    BABYLON.SceneLoader.Load(
      'assets-dev/maps/try1/',
      'try3.babylon',
      engine,
      function (newScene) {
        scene = newScene;
        scene.collisionsEnabled = true;
        scene.debugLayer.show();

        window.SCENE = scene;

        newScene.executeWhenReady(function () {
          ground = scene.getMeshByName('land');
          groundNavMesh = scene.getMeshByName('Navmesh');

          ground.checkCollisions = true;

          setupLights();
          setupSkybox();
          setupCamera();
          setupNavmesh();
          loadMeshes();
          setupNet();
          whoopDaHoop();
        });
      }
    );
  };

  setupNavmesh = function () {
    var zoneNodes;

    navigation = new Navigation();
    zoneNodes = navigation.buildNodes(groundNavMesh);
    navigation.setZoneData('ground', zoneNodes);
  };

  loadMeshes = function () {
    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/T-82/', 't82_test.babylon', scene, function (newMeshes, particleSystem, skeletons) {
    //   var base = newMeshes[2];

    //   base.scaling.x = 2;
    //   base.scaling.y = 2;
    //   base.scaling.z = 2;

    //   base.position.x = -40;
    //   base.position.z = 20;
    //   base.checkCollisions = true;
    //   correctY(base);

    //   vehicles.push(base);
    // });

    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/M8-GreyHound/', 'm8_grayhound.babylon', scene, function (newMeshes, particleSystem, skeletons) {
    //   var base = newMeshes[2];
    //
    //   base.scaling.x = 2;
    //   base.scaling.y = 2;
    //   base.scaling.z = 2;
    //
    //   base.checkCollisions = true;
    //   base.position.x = -42;
    //   base.position.z = 20;
    //   correctY(base);
    //
    //   vehicles.push(base);
    //
    //   if (!isSender) {
    //     window.V = base;
    //     highlightMesh(V);
    //   }
    // });
    //
    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/M41 Walker Bulldog/', 'm41_walker_bulldog.babylon', scene, function (newMeshes, particleSystem, skeletons) {
    //   var base = newMeshes[2];
    //
    //   base.scaling.x = 2;
    //   base.scaling.y = 2;
    //   base.scaling.z = 2;
    //
    //   base.checkCollisions = true;
    //   base.position.x = -46;
    //   base.position.z = 20;
    //   correctY(base);
    //
    //   vehicles.push(base);
    //
    //   if (isSender) {
    //     window.V = base;
    //     highlightMesh(V);
    //   }
    //
    //   window.walkerBulldogInstances = [];
    //   for (var x = 36; x < 49; x += 2) {
    //     for (var z = -46; z < 19; z += 3) {
    //       var instance = base.createInstance('walker_bulldog_' + x + "," + z);
    //       instance.position = new BABYLON.Vector3(x, 0, z);
    //       window.walkerBulldogInstances.push(instance);
    //     }
    //   }
    // });

    BABYLON.SceneLoader.ImportMesh('', 'assets-dev/simple_military/', 'apc_01_a.babylon', scene, function (newMeshes) {
      // var parent =
      // console.log('keke! ---> ', arguments);
    });

    BABYLON.SceneLoader.ImportMesh('', 'assets-dev/simple_military/test_char/', 'test_char2_ik_rigged_animated.babylon', scene, function (newMeshes) {
      console.log('keke! ---> ', arguments);
      var baseMesh = scene.getMeshByName('Base_mesh'),
          skinMesh = scene.getMeshByName('Terrorist_03_mesh');

      skinMesh.dispose();

      var skeletonAnimationTexture = AnimationTransformer.recordAnimationBoneMatrices(baseMesh.skeleton, scene);
      baseMesh.material._instancedSkinningTexture = skeletonAnimationTexture;
      baseMesh.material._instancedSkinningTexture = skeletonAnimationTexture;

      baseMesh.material.freeze();

      // baseMesh.simplify(
      //   [
      //     {
      //       quality: 0.75,
      //       distance: 10
      //     },
      //     {
      //       quality: 0.3,
      //       distance: 40
      //     }
      //   ],
      //   false,
      //   BABYLON.SimplificationType.QUADRATIC,
      //   function () {
      //     alert('LOD finished.');
      //   }
      // );

      window.V = baseMesh;

      baseMesh.computeBonesUsingShaders = true;

      window.army = [];
      for (var z = 30; z < 38; z += 2) {
        for (var x = -60; x < 0; x += 1.5) {
            var infantry = baseMesh.createInstance('terr_' + z + x);
            infantry.alwaysSelectAsActiveMesh = true;
            infantry.setupAnimation();

            infantry.position = new BABYLON.Vector3(x, 0, z);
            // infantry.skeleton = baseMesh.skeleton.clone('terr_' + z + x, Math.abs(x)+Math.abs(z));
            // infantry.skeleton.prepare()
            // scene.beginAnimation(infantry.skeleton, 0, 33, true);
            window.army.push(infantry);
        }
      }
    });

    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/simple_military/vehicles/', 'vehicles.babylon', scene, function (newMeshes, ps, skeletons) {
    //   var cfg = {
    //     apc_01_body: ['turret', 'barrel', 'wheel_fl', 'wheel_fr', 'wheel_l2', 'wheel_l3', 'wheel_l4', 'wheel_r2', 'wheel_r3', 'wheel_r4'],
    //     apc_02_body: ['turret.001', 'barrel.001', 'lid01'],
    //     armor_car_body: ['turret.002', 'barrel.002', 'wheel_fl.001', 'wheel_fr.001', 'wheel_rl', 'wheel_rr'],
    //     attack_heli: ['missile_01', 'missile_02', 'missile_03', 'missile_04', 'missile_05', 'missile_06', 'missile_07', 'missile_08', 'rotor_main', 'rotor_tail'],
    //     radar_unit: ['radar_turret'],
    //     small_heli: ['rotor_main.001', 'rotor_tail.001'],
    //     tank_01_body: ['turret.003', 'barrel.003', 'lid01.001', 'lid02'],
    //     tank_02_body: ['turret.004', 'barrel.004', 'lid01.002'],
    //     troop_car: ['gun', 'wheel_fl.002', 'wheel_fr.002', 'wheel_rl.001', 'wheel_rr.001']
    //   };

    //   window.VS = {};

    //   var x = -10, z = 0;
    //   Object.keys(cfg).forEach(mainMeshKey => {
    //     var mainMesh = scene.getMeshByName(mainMeshKey);

    //     cfg[mainMesh.name].forEach(m => {
    //       m.parent = mainMesh
    //     });

    //     VS[mainMesh.name] = mainMesh;

    //     mainMesh.scaling = new BABYLON.Vector3(60, 60, 60);
    //     mainMesh.position.x = x;
    //     mainMesh.position.z = z;

    //     x -= 5;
    //   });

    //   // window.V = VS.troop_car;

    //   // window.skeletonz = skeletons;
    //   // var topLevel = scene.getMeshByName("SimpleMilitary_Terrorist03_Black"),
    //   // var baseMesh = scene.getMeshByName('Base_mesh'),
    //   //     terr03Mesh = scene.getMeshByName('Terrorist_03_mesh');
    //   //
    //   // terr03Mesh.parent = baseMesh;
    //   // baseMesh.position = new BABYLON.Vector3(-10, 0, -10);
    //   //
    //   // window.V = baseMesh;
    //   //
    //   // // newMeshes.forEach(m => m.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1))
    //   //
    //   // baseMesh.parent = topLevel;
    //   // terr03Mesh.parent = topLevel;
    //   //
    //   // console.log(topLevel);
    //   // window.newMeshes = newMeshes;

    //   // var baseMesh = scene.findMeshByName('Base_mesh');
    //   console.log('keke! ---> ', newMeshes);

    //   // newMeshes.forEach(m => {
    //   //   m.position.x = -20;
    //   //   m.position.z = 0;
    //   //   m.position.y = 0;
    //   //
    //   //   m.scaling = new BABYLON.Vector3(60, 60, 60);
    //   // })

    //   // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/simple_military/test_char/', 'test_anim_static.babylon', scene, function (meshes, particleSystems, skeletons) {
    //   //   console.log('anims! ---> ', arguments);
    //   // });
    // });

    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/simple_military/env/', 'env.babylon', scene, function (newMeshes) {
    //   // console.log('keke! ---> ', arguments);
    // });

    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/modern_infantry/', 'testbed.babylon', scene, function (newMeshes) {
    //   console.log('modern infantry! ---> ', arguments);
    // });

    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/SoldiersPack/ArmyOne/exported/', 'army1.babylon', scene, function (newMeshes, particleSystem, skeletons) {
    //   newMeshes[0].scaling.x = 0.01;
    //   newMeshes[0].scaling.y = 0.01;
    //   newMeshes[0].scaling.z = 0.01;
    //
    //   newMeshes[0].position.x = -30;
    //   newMeshes[0].position.z = 20;
    // });
    //
    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/SoldiersPack/ArmyTwo/exported/', 'army2.babylon', scene, function (newMeshes, particleSystem, skeletons) {
    //   newMeshes[0].scaling.x = 0.01;
    //   newMeshes[0].scaling.y = 0.01;
    //   newMeshes[0].scaling.z = 0.01;
    //
    //   newMeshes[0].position.x = -34;
    //   newMeshes[0].position.z = 20;
    //
    //   // window.V = newMeshes[0];
    // });
    //
    // BABYLON.SceneLoader.ImportMesh('', 'assets-dev/SoldiersPack/ArmyThree/exported/', 'army3.babylon', scene, function (newMeshes, particleSystem, skeletons) {
    //   newMeshes[0].scaling.x = 0.01;
    //   newMeshes[0].scaling.y = 0.01;
    //   newMeshes[0].scaling.z = 0.01;
    //
    //   newMeshes[0].position.x = -36;
    //   newMeshes[0].position.z = 20;
    //
    //   // window.V = newMeshes[0];
    // });


    BABYLON.SceneLoader.ImportMesh('', 'assets-dev/aeroplane/', 'jet1.babylon', scene, function (newMeshes, particleSystem, skeletons) {
      var jet = newMeshes[0];
      // newMeshes[0].scaling.x = 0.01;
      // newMeshes[0].scaling.y = 0.01;
      // newMeshes[0].scaling.z = 0.01;

      jet.position.y = 30;
      jet.scaling.x = 0.2;
      jet.scaling.y = 0.2;
      jet.scaling.z = 0.2;

      jetRotationAnimation(jet, 10, 60);
      scene.beginAnimation(jet, 0, 100, true);

      // window.V = jet;
    });

    BABYLON.SceneLoader.ImportMesh('', 'assets-dev/', 'missile.babylon', scene, function (newMeshes, particleSystem) {
      missile = newMeshes[0];

      missile.scaling = new BABYLON.Vector3(2, 2, 2);
      missile.position = new BABYLON.Vector3(0, 10, 0);

      console.log(missile, arguments)
      window.missile = missile;
    });
  };

  setupLights = function () {
    // var light = new BABYLON.HemisphericLight('hemi_light', new BABYLON.Vector3(0, 1, 0), scene);
    // var light = new BABYLON.DirectionalLight("directional_light", new BABYLON.Vector3(1, -1, 1), scene);
    //
    // light.intensity = 2.0;
  };

  setupSkybox = function () {
    var skybox,
        skyboxMaterial;

    skybox = BABYLON.MeshBuilder.CreateBox('skyBox', {size: 200.0}, scene);
    skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);

    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets-dev/skybox/TropicalSunnyDay', scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.checkCollisions = true;
  };

  setupCamera = function () {
    var camera = new BABYLON.FreeCamera('free_camera', new BABYLON.Vector3(-20, 10, 20), scene);

    // var camera = new BABYLON.ArcRotateCamera("camera", Math.PI/4, Math.PI/4, 10, new BABYLON.Vector3(0, 5, 0), scene);
    // camera.setPosition(new BABYLON.Vector3(30, 20, -20));
    // camera.panningAxis = new BABYLON.Vector3(1, 0, 1);
    // camera.lowerRadiusLimit = 5;
    // camera.upperRadiusLimit = 100;
    // camera.lowerBetaLimit = -Math.PI/2;
    // camera.upperBetaLimit = Math.PI/2;
    // camera.checkCollisions = true;
    // camera.maxZ = 1000;
    // camera.minZ = 5;
    // camera.collisionRadius = new BABYLON.Vector3(5, 5, 5);

    scene.activeCamera.attachControl(canvas);
    // scene.activeCamera.ellipsoid = new BABYLON.Vector3(5, 5, 5);
  };

  setupNet = function () {
    net = new NetWebRTC(!isSender),
    em = new TimelineEntityManager(net);

    setTimeout(function () {
      em.attachObjectProperty(window.V, 'position');
      em.loopScene(scene);

      // net.loopScene(scene);
    }, 1000);
  };

  whoopDaHoop = function () {
    // var
    //   rotateTurret = null,
    //   dTheta = Math.PI/128;
    // explosionWithShader();

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 65) {
        // if (Math.random() > 0.5) {
        //   window.walkerBulldogInstances.forEach(fireMissile);
        // }
        fireMissile(window.V);
        // rotateTurret = ROTATE_LEFT;
      } else if (evt.keyCode === 68) {
        // rotateTurret = ROTATE_RIGHT;
      }
    }, false);

    //
    // window.addEventListener('keyup', function (evt) {
    //   rotateTurret = ROTATE_NONE;
    // }, false);

    window.addEventListener('resize', function (){
    	engine.resize();
    });

    canvas.addEventListener('click', function (event) {
      var pickingInfo = scene.pick(scene.pointerX, scene.pointerY);

      console.log(pickingInfo);

      if (!pickingInfo) {
        return;
      }

      var vehicle = window.V;// TODO
      var path = navigation.findPath(vehicle.position, pickingInfo.pickedPoint, 'ground', navigation.getGroup('ground', vehicle.position)) || [];

      vehicleTravelPath(vehicle, path);
    });

    // var octree = scene.createOrUpdateSelectionOctree();

    engine.runRenderLoop(function () {
        scene.render();
    });
  };

  correctY = function (mesh) {
    var ray, worldInverse, pickInfo, meshSize;

    meshSize = mesh.getBoundingInfo().boundingBox.extendSize;

    ray = new BABYLON.Ray(
      new BABYLON.Vector3(
        mesh.position.x,
        ground.getBoundingInfo().boundingBox.maximumWorld.y + 1,
        mesh.position.z
      ),
      new BABYLON.Vector3(0, -1, 0)
    );

    worldInverse = new BABYLON.Matrix();
    ground.getWorldMatrix().invertToRef(worldInverse);
    ray = BABYLON.Ray.Transform(ray, worldInverse);
    pickInfo = ground.intersects(ray);
    if (pickInfo.hit) {
      mesh.position.y = pickInfo.pickedPoint.y;
    }
  };

  // Computes orientation normal to a fron-facing place of a bounding box.
  computeOrientationNormal = function (mesh) {
    var v1v2,
        v2v2,
        norm,
        worldNorm;

        v1v2 = mesh.getBoundingInfo().boundingBox.vectors[5].subtract(mesh.getBoundingInfo().boundingBox.vectors[3]);
        v2v3 = mesh.getBoundingInfo().boundingBox.vectors[2].subtract(mesh.getBoundingInfo().boundingBox.vectors[5]);
        norm = BABYLON.Vector3.Cross(v1v2, v2v3);
        normWorld = BABYLON.Vector3.TransformCoordinates(norm, mesh.getWorldMatrix());

        mesh.__normal = norm;
        mesh.__normalWorld = normWorld;
  };

  vehicleTravelPath = function (vehicle, path) {
    var
      pathLength,
      directions,
      rotations,
      firstPathSegment,
      movementAnimation,
      m;

    firstPathSegment = new BABYLON.Vector3(path[0].x, path[0].y, path[0].z);

    if (waypoints) {
      waypoints.dispose();
    }

    // Plot the path.
    waypoints = BABYLON.Mesh.CreateLines('waypoints', [vehicle.position].concat(path), scene);
    waypoints.color = new BABYLON.Color3(0, 0, 1);
    waypoints.position.y = 0.05;

    // Construct the path directions.
    pathLength = 0;
    directions = [{
      frame: 0,
      value: vehicle.position
    }];

    function rotateToPath(target) {
      // we need to make mesh oriented towards the direction of the target.
      // we take front face of mesh's bounding box, compute its normal vector,
      // and this represents the current orientation vector (in mesh's local
      // coordinate sytem).
      // To the current's rotation quaternion (which represents mesh's orientation)
      // we add (by means of multiplication)
      var m = new BABYLON.Matrix();

      return function () {
        computeOrientationNormal(vehicle);

        vehicle.getWorldMatrix().invertToRef(m);
        vehicle.rotationQuaternion = vehicle.rotationQuaternion || vehicle.rotation.toQuaternion();
        vehicle.rotationQuaternion.multiplyInPlace(computePathRotation(vehicle.__normal, BABYLON.Vector3.TransformCoordinates(target, m)));
      }
    };

    // rotations = [{
    //   frame: 0,
    //   value: vehicle.rotationQuaternion || vehicle.rotation.toQuaternion()
    // }];

    // 1. First
    //

    for (var i = 0; i < path.length; i++) {
      pathLength += BABYLON.Vector3.Distance(directions[i].value, path[i]);

      directions.push({
        frame: pathLength*100,
        value: path[i]
      });

      // TODO: for now solved with events, but do it better.
      // rotations.push({
      //   frame: pathLength*100,
      //   value: rotations[0].value.multiply(computePathRotation(
      //     BABYLON.Vector3.TransformCoordinates(directions[i].value, m),
      //     BABYLON.Vector3.TransformCoordinates(directions[i+1].value, m)
      //   ))
      // });
    }

    // rotations = [new BABYLON.AnimationEvent(0, rotateToPath(firstPathSegment), true)];
    rotations = [];
    for (var i = 0; i < directions.length; i++) {
      directions[i].frame /= pathLength;

      if (i <= directions.length-2) {
        var pathVector = new BABYLON.Vector3(directions[i+1].value.x, directions[i+1].value.y, directions[i+1].value.z);
        rotations.push(new BABYLON.AnimationEvent(directions[i].frame, rotateToPath(pathVector), true));
      }
    }

    console.log(pathLength)

    // movementAnimation = new BABYLON.Animation('Position', 'position', 45/pathLength*10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // 100 frames, x is path length, v is velocity. What's should be the FPS?
    // 1. total time? t = x / v
    // 2. we should stuff that time into 100 frames. FPS = 100 / t = 100 / (x / v)
    movementAnimation = new BABYLON.Animation('Position', 'position', 100/(pathLength/1), BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    // movementAnimation.setKeys(directions);
    // vehicle.animations.push(movementAnimation);

    // movementAnimation.addEvent(new BABYLON.AnimationEvent(0, rotateToPath(firstPathSegment), true));

    // rotations.forEach(function (r) {
    //   movementAnimation.addEvent(r);
    // });

    // scene.beginAnimation(vehicle, 0, 100);

    GlobalTime.freeze();
    GlobalTime.debug('click ');
    path.unshift(vehicle.position);
    em.timelines[vehicle.name].set(0, vehicle.position.clone(), true);

    var totalTime = 0;
    for (var i = 1; i < path.length; i++) {
      var t, // time in ms
          d, // distance
          v = 3; // velocity

      path[i] = new BABYLON.Vector3(path[i].x, vehicle.position.y, path[i].z);
      d = BABYLON.Vector3.Distance(path[i-1], path[i]);
      t = d/v * 1000;

      totalTime += t;
      em.timelines[vehicle.name].set(totalTime, path[i], true);
    }

    GlobalTime.unfreeze();

    // path.forEach(function (pathSegment) {
    //   var vector = new BABYLON.Vector3(pathSegment.x, pathSegment.y, pathSegment.z),
    //       t = vector.length()/3 * 1000;
    //
    //   totalTime += t;
    //   net.timelines[vehicle.name].set(totalTime, vector);
    // });
  };

  // Computes rotation quaternion from two vectors
  // (an angle and axis necessary to rotate from fromDirection vector to toDirection vector).
  // http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-17-quaternions/
  computePathRotation = function (from, to) {
    var
      cosTheta,
      rotAxis,
      s,
      inv;

    // ---------
    // TODO: do this hacky part different (its here because when climbing, it tends to flip on the roof)
    fromDirection = from.clone();
    toDirection   = to.clone();
    fromDirection.y = 0;
    toDirection.y = 0;
    // ---------


    fromDirection = BABYLON.Vector3.Normalize(fromDirection);
    toDirection   = BABYLON.Vector3.Normalize(toDirection);
    cosTheta      = BABYLON.Vector3.Dot(fromDirection, toDirection);

    // console.log(cosTheta);

    if (cosTheta < -1 + 0.0000000000000001) {
      // Special case when vectors in opposite directions.
      // There is no ideal rotation axis, so guess one.
      // Any will do as long as it's perpendicular to start.

      rotAxis = BABYLON.Vector3.Cross(new BABYLON.Vector3(0, 0, 1), fromDirection);
      if (rotAxis.lengthSquared() < 0.01) {
        // bad luck, they are parallel. Try again :)
        rotAxis = BABYLON.Vector3.Cross(new BABYLON.Vector3(1, 0, 0), fromDirection);
      }

      rotAxis = BABYLON.Vector3.Normalize(rotAxis);

      return BABYLON.Quaternion.RotationAxis(rotAxis, 180.0);
    }

    rotAxis = BABYLON.Vector3.Cross(fromDirection, toDirection);

    s   = Math.sqrt((1 + cosTheta) * 2);
    inv = 1/s;

    return new BABYLON.Quaternion(rotAxis.x*inv, rotAxis.y*inv, rotAxis.z*inv, s*0.5);
  };

  jetRotationAnimation = function (mesh, radius, smoothnessLevel) {
    var fi = 0,
        dFi = (2*Math.PI)/smoothnessLevel,
        positionPointsOnCircle = [],
        rotationPointsOnCircle = [],
        meshY = mesh.position.y,
        positionAnimation,
        rotationAnimation,
        i,
        dbg = []; // keep Y constant.

    for (i = 0; i < smoothnessLevel; i++) {
      var point = new BABYLON.Vector3(radius*Math.cos(fi), meshY, radius*Math.sin(fi)),
          frame = (radius * fi * 100) / (2*Math.PI*radius);

      positionPointsOnCircle.push({
        frame: frame,
        value: point
      });

      rotationPointsOnCircle.push({
        frame: frame,
        value: -fi
      });

      dbg.push(point);

      fi += dFi;
    }

    var finalPosition = mesh.position.clone();
    finalPosition.x = radius*Math.cos(2*Math.PI);
    finalPosition.z = radius*Math.sin(2*Math.PI);

    positionPointsOnCircle.push({
      frame: 100,
      value: finalPosition
    });

    dbg.push(finalPosition);

    positionAnimation = new BABYLON.Animation('MeshSpinningPosition', 'position', 45/(Math.PI*2*radius)*10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    positionAnimation.setKeys(positionPointsOnCircle);

    rotationAnimation = new BABYLON.Animation('MeshSpinningRotationY', 'rotation.y', 45/(Math.PI*2*radius)*10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    rotationAnimation.setKeys(rotationPointsOnCircle);

    mesh.animations.push(positionAnimation);
    mesh.animations.push(rotationAnimation);

    mesh.rotation.z = Math.PI/8;

    // DEBUG
    // var dbgLines = BABYLON.Mesh.CreateLines('dbg', dbg, scene);
    // dbgLines.color = new BABYLON.Color3(1, 0, 0);
  };

  fireMissile = function (mesh) {
    var newMissile,
        anim,
        dest,
        nrm,
        nrm2,
        nrm3,
        unit,
        particleSystem,
        v,
        t,
        x;

    console.log('FIRING MISSILEZ!');
    computeOrientationNormal(mesh);

    unit = mesh.__normalWorld.subtract(mesh.position); // TODO NORMALIZE!
    dest = mesh.__normalWorld.add(unit.scale(20));

    // v = s / t
    // 1. t = total time
    // 2. v = speed of the missile
    // 3. s = total path of the missile.
    //
    // we need t: t = s/v
    v = 15;
    t = BABYLON.Vector3.Distance(mesh.__normalWorld, dest)/v;

    newMissile = missile.createInstance('WAAAH');
    particleSystem = new BABYLON.ParticleSystem('particles', 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture('assets-dev/fire/diffuse.png', scene);
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.1;
    particleSystem.minLifeTime = 0.4;
    particleSystem.maxLifeTime = 0.7;
    particleSystem.gravity = new BABYLON.Vector3(0, -1.0, 0);
    particleSystem.direction1 = unit.scale(-1);
    particleSystem.direction2 = unit.scale(-1);
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all From
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...
    particleSystem.emitter = newMissile;
    particleSystem.emitRate = 100;
    particleSystem.targetStopDuration = t;
    particleSystem.disposeOnStop = true;

    particleSystem.start();

    anim = new BABYLON.Animation('Missile', 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // Plot the normal.
    // nrm = new BABYLON.Mesh.CreateLines('v_norm', [mesh.position, mesh.__normalWorld], scene);
    // nrm2 = new BABYLON.Mesh.CreateLines('v_fxx', [new BABYLON.Vector3(0, 0, 0), mesh.__normalWorld], scene);
    // nrm3 = new BABYLON.Mesh.CreateLines('v_23', [mesh.position, dest], scene);
    // nrm3.color = new BABYLON.Color3(1, 0, 1);

    // this was manual calibrations. models should have a muzzle @TODO
    newMissile.position = mesh.__normalWorld.clone().add(unit.scale(0.5));
    newMissile.rotationQuaternion = mesh.rotationQuaternion || mesh.rotation.toQuaternion();

    var animationFrames = [
      {
        frame: 0,
        value: {x: newMissile.position.x, y: 0.85, z: newMissile.position.z}
      },
      {
        frame: t*60,
        value: {x: dest.x, y: 0.85, z: dest.z}
      }
    ];

    anim.setKeys(animationFrames);
    newMissile.animations.push(anim);
    scene.beginAnimation(newMissile, 0, t*60);
    window.newMissile = newMissile;

    setTimeout(function () {
        particleSystem.stop();
        newMissile.dispose();
    }, t*1000);
  };

  highlightMesh = function (mesh) {
    var hl = new BABYLON.HighlightLayer('hl1', scene);

    hl.addMesh(mesh, BABYLON.Color3.Red());
    hl.blurHorizontalSize = 0.1;//;0.3 + Math.cos(0.3) * 0.6 + 0.6;
    hl.blurVerticalSize = 0.1;//0.3 + Math.cos(0.3) * 0.6 + 0.6;
  };

  explosionWithShader = function () {
    function createPolyhedron(name, size, scene) {
      var vertices = [[-0.976612,0.213547,-0.025026],[-0.942883,-0.134569,-0.304734],[-0.917763,0.061996,0.392261],[-0.863187,-0.501268,-0.060316],[-0.847662,-0.379783,0.37045],[-0.806942,0.483006,-0.339927],[-0.791417,0.60449,0.090839],[-0.773213,0.13489,-0.619635],[-0.732567,0.452939,0.508126],[-0.703113,-0.306889,-0.641445],[-0.652871,0.086241,0.752543],[-0.623417,-0.673588,-0.397028],[-0.582771,-0.355538,0.730732],[-0.564567,-0.825138,0.020258],[-0.549042,-0.703654,0.451025],[-0.47356,0.76745,-0.432161],[-0.458035,0.888934,-0.001394],[-0.418985,0.204186,-0.884738],[-0.362814,0.643719,0.673789],[-0.348885,-0.237593,-0.906548],[-0.283118,0.277021,0.918206],[-0.23379,0.595129,-0.768872],[-0.219935,-0.830923,-0.511073],[-0.193143,0.913179,0.358888],[-0.169693,-0.437793,0.882916],[-0.161085,-0.982474,-0.093786],[-0.135964,-0.785909,0.603208],[-0.103807,0.95823,-0.266497],[-0.050264,-0.561464,-0.825973],[-0.015503,0.04685,-0.998782],[0.015502,-0.04685,0.998781],[0.075132,0.737294,0.671381],[0.103807,-0.958229,0.266497],[0.135964,0.78591,-0.603209],[0.154828,0.370596,0.915798],[0.161084,0.982475,0.093785],[0.169693,0.437794,-0.882917],[0.193143,-0.913178,-0.358889],[0.233789,-0.595129,0.768871],[0.283118,-0.277021,-0.918207],[0.362813,-0.643719,-0.67379],[0.418985,-0.204186,0.884737],[0.42936,0.80659,0.406278],[0.458035,-0.888933,0.001394],[0.47356,-0.767449,0.43216],[0.549042,0.703655,-0.451025],[0.558311,0.21326,0.801754],[0.564567,0.825139,-0.020259],[0.582771,0.355539,-0.730733],[0.652871,-0.08624,-0.752544],[0.727981,0.48272,0.486853],[0.732567,-0.452939,-0.508127],[0.773213,-0.13489,0.619634],[0.791417,-0.60449,-0.09084],[0.806942,-0.483006,0.339926],[0.847662,0.379784,-0.370451],[0.863187,0.501268,0.060316],[0.917763,-0.061995,-0.392261],[0.942883,0.13457,0.304733],[0.976612,-0.213546,0.025025]];

      var edges = [[36,33],[33,45],[45,48],[48,36],[45,55],[55,48],[45,47],[47,56],[56,55],[33,27],[27,35],[35,47],[35,42],[42,47],[42,50],[50,56],[23,31],[31,42],[35,23],[23,18],[18,31],[18,20],[20,34],[34,31],[34,46],[46,50],[20,30],[30,34],[30,41],[41,46],[55,57],[57,49],[49,48],[57,51],[51,49],[57,59],[59,53],[53,51],[56,58],[58,59],[59,54],[54,53],[54,44],[44,43],[43,53],[58,52],[52,54],[50,58],[46,52],[52,41],[41,38],[38,44],[30,24],[24,38],[51,40],[40,39],[39,49],[40,28],[28,39],[40,37],[37,22],[22,28],[43,37],[37,25],[25,22],[25,13],[13,11],[11,22],[43,32],[32,25],[44,32],[38,26],[26,32],[26,14],[14,13],[24,26],[24,12],[12,14],[28,19],[19,29],[29,39],[19,17],[17,29],[19,9],[9,7],[7,17],[11,9],[9,1],[1,7],[1,0],[0,5],[5,7],[11,3],[3,1],[13,3],[14,4],[4,3],[4,2],[2,0],[12,4],[12,10],[10,2],[17,21],[21,36],[36,29],[21,33],[21,15],[15,27],[5,15],[15,16],[16,27],[16,23],[5,6],[6,16],[0,6],[2,8],[8,6],[8,18],[10,8],[10,20]];

      var faces = [[48,45,55],[35,42,47],[23,18,31],[20,30,34],[49,57,51],[59,54,53],[56,50,58],[46,41,52],[39,40,28],[37,25,22],[43,44,32],[38,24,26],[29,19,17],[9,1,7],[11,13,3],[14,12,4],[36,21,33],[15,16,27],[5,0,6],[2,10,8],[36,33,45,48],[45,47,56,55],[47,42,50,56],[23,31,42,35],[18,20,34,31],[34,30,41,46],[48,55,57,49],[57,59,53,51],[53,54,44,43],[58,52,54,59],[50,46,52,58],[41,30,24,38],[49,51,40,39],[40,37,22,28],[22,25,13,11],[43,32,25,37],[44,38,26,32],[26,24,12,14],[39,28,19,29],[19,9,7,17],[7,1,0,5],[11,3,1,9],[13,14,4,3],[4,12,10,2],[29,17,21,36],[21,15,27,33],[27,16,23,35],[5,6,16,15],[0,2,8,6],[8,10,20,18],[33,27,35,47,45],[31,34,46,50,42],[55,56,58,59,57],[52,41,38,44,54],[51,53,43,37,40],[32,26,14,13,25],[28,22,11,9,19],[3,4,2,0,1],[17,7,5,15,21],[6,8,18,23,16],[36,48,49,39,29],[10,12,24,30,20]];

      var positions = [];
      var indices = [];
      var normals = [];
      var uvs = [];

      var i = 0;

      // positions
      for (i = 0; i < vertices.length; i++) {
        positions.push(vertices[i][0] * size, vertices[i][1] * size, vertices[i][2] * size);
        //uvs.push(0, 0);
      }

      // indices from faces
      for (var f = 0; f < faces.length; f++) {
        for (i = 0; i < faces[f].length - 2; i++) {
          indices.push(faces[f][0], faces[f][i + 2], faces[f][i + 1]);
        }
      }

      BABYLON.VertexData.ComputeNormals(positions, indices, normals);

      var vertexData = new BABYLON.VertexData();
      vertexData.positions = positions;
      vertexData.indices = indices;
      vertexData.normals = normals;
      //vertexData.uvs = uvs;

      var polygon = new BABYLON.Mesh(name, scene);
      vertexData.applyToMesh(polygon);

      return polygon;
    };

    // var sphere = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 0, size: 20}, scene);
    // var explosionMesh = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 3, size: 20}, scene);

    var explosionMesh = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2}, scene);//createPolyhedron('exp', 2, scene);
    explosionMesh.position.y = 7;

    var explosionMaterial = new BABYLON.ShaderMaterial(
      "explosion", scene, "./glsl/explosion",
      {
            attributes: ["position", "uv", "normal"],
            uniforms: ["worldView", "projection", "time"]
      }
    );
    explosionMaterial.setFloat('time', 0);
    explosionMaterial.setTexture('tExplosion', new BABYLON.Texture('assets-dev/fire/diffuse.png', scene));

    // amigaMaterial.setTexture("textureSampler", new BABYLON.Texture("amiga.jpg", scene));
    explosionMesh.material = explosionMaterial;
    window.explosion = explosionMesh;
    var t = 0;
    scene.registerBeforeRender(function () {
      // sphere.rotation.x += 0.1;
      explosionMesh.rotation.z += 0.1;
      t += 0.02;
      explosionMaterial.setFloat('time', t);
    });
  };

  if (!BABYLON.Engine.isSupported()) {
    alert('Cannot run the game.');
  } else {
    startup();
  }
};

document.addEventListener('DOMContentLoaded', MMWAR);
