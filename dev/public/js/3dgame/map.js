// base global variables
var scene = new THREE.Scene(),
    clock = new THREE.Clock(),
    mouse = new THREE.Vector2(),
    keyboard = new THREEx.KeyboardState(),
    raycaster = new THREE.Raycaster(),
    audioListener = new THREE.AudioListener(),
    light, spotLight,
    camera,
    cameraTarget,
    cameraPosition,
    container = document.getElementById("frame"),
    controls,
    renderer,
    isScreenMove = false,
    stats,
    loaderObjectFromJS = new THREE.JSONLoader();

// custom global variables
var OBJLoader,
    sceneObjects = {},
    sceneObjects_array = [],
    sceneCollisionObjects = [];

// base config
var config = {},
	audioFiles = {},
	player = {},
	decor = [];

var opponents = {};
var particleSystems = [];
var sounds = {};

// default settings of skills
var skills = {
    particle: {
        maxDistance: 150,
        tick: 0,
        cooldown: 5000,
        speed: 2000,
        particleSystem: null,
        enabled: true,
        maxParticles: 250000,
        options: {
            position: null,
            positionRandomness: .3,
            velocity: null,
            velocityRandomness: .5,
            color: 0xaa88ff,
            colorRandomness: .2,
            turbulence: .5,
            lifetime: 1,
            size: 3,
            sizeRandomness: 1,
            geometry: {
                vertices: [new THREE.Vector3(0, 0, 0)]
            },
            matrix: new THREE.Matrix4()
        },
        spawnerOptions: {
            spawnRate: 15000,
            horizontalSpeed: 1.5,
            verticalSpeed: 1.33,
            timeScale: 1
        }
    }
};

function startAppInit()
{
	socket.emit('get map data');
}

// -------------------------------------------------------------------------------------
// - socket ----------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
socket.on('map data', function(data){
	// init configs files
	config = data.config;
	audioFiles = data.audioFiles;
	player = data.player;
	decor = data.decor;

	// init window data
	config.window = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    config.camera.aspect = window.innerWidth / window.innerHeight;

	// start app
	init();

    // init interface
    interface_init();

	// inputs init
	inputDevicesInit();
});

socket.on('send position', function(data){
    if('/#' + socket.id == data.id)
    {
        return;
    };

    if(typeof opponents[data.id] === 'undefined' || opponents[data.id] == 'loading')
    {
        if(opponents[data.id] != 'loading')
        {
            opponents[data.id] = 'loading';
            add_player(data.id);
        }
    }
    else if(data.action)
    {
        if(data.action == 'stay')
        {
            objectAnimationStay(opponents[data.id], false);
        }
        else if(data.action == 'move')
        {
            if(opponents[data.id].action.status != 'move')
            {
                objectAnimationMove(opponents[data.id], false);
            }
            objectRotateTo(opponents[data.id], data.position.x, data.position.z);
        }

        opponents[data.id].position.x = data.position.x;
        opponents[data.id].position.z = data.position.z;
    }
});

socket.on('use skill', function(data){
    if('/#' + socket.id == data.id || typeof opponents[data.id] === 'undefined')
    {
        return;
    };

    console.log('use skill', data.id);
    useSkill(opponents[data.id], data.targetPosition, false);
});

socket.on('opponent disconnected', function(id){
    console.log('player id: ' + id + ' disconnected');
    if(typeof opponents[id] !== 'undefined')
    {
        var parent = document.getElementById('frame');
        var el = document.getElementById(opponents[id].uuid);
        parent.removeChild(el);

        scene.remove(opponents[id]);
        opponents[id] = null;
        animate();
    }
});






// -------------------------------------------------------------------------------------
// - interface -------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
function interface_init()
{
	// create panel of skills
	interfaceCreateSkillsPanel();

    $('#panel').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // select skill
    $('#panel li').click(function(e) {
        if($(this).hasClass('cooldown') == false)
        {
            $('#panel li').removeClass('active');
            $(this).addClass('active');
        }
    });

    // stop events for used skills
    $('#panel li.used').on('mouseover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
}

function interfaceCreateSkillsPanel()
{
	for (var i = 0; i < player.skills.length; i++)
	{
		$('#panel #skills').append('<li class="hover" id="particle"><img src="/images/skills/' + player.skills[i].image + '"><span></span><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><line class="top" x1="0" y1="0" x2="900" y2="0"/><line class="left" x1="0" y1="47" x2="0" y2="-920"/><line class="bottom" x1="48" y1="47" x2="-600" y2="47"/><line class="right" x1="48" y1="0" x2="48" y2="1380"/></li>');
		player.skills[i]
	}
}

function interfaceUseSkill(skill)
{
    $('#' + skill).removeClass('active');

    if(skills[skill].cooldown > 0)
    {
        $('#' + skill)
            .removeClass('hover')
            .addClass('cooldown');

        var s = parseInt(skills[skill].cooldown / 1000);
        for(var i = s; i >= 0; i--)
        {
            setTimeout("interfaceSetSkillCooldown('particle', " + (s - i) + ")", i * 1000);
        }

        // call cooldown
        setTimeout("interfaceSkillReloaded('particle')", skills[skill].cooldown);
    }
}

function interfaceSkillReloaded(skill)
{
    $('#' + skill)
        .addClass('hover')
        .removeClass('cooldown');
}

function interfaceSetSkillCooldown(skill, cooldown)
{
    $('#' + skill + ' span').text(cooldown);
}

function interfaceShowObjectTitle(id, title, x, y)
{
    var tooltip = document.getElementById(id);
    if(tooltip)
    {
        tooltip.style.left = x;
        tooltip.style.top = y;
    }
    else
    {
        var parent = document.getElementById('frame');
        var el = document.createElement("div");
        el.className += ' objectTitle';
        el.setAttribute("id", id);
        parent.appendChild(el);

        var textPlace = document.createElement("span");
        textPlace.innerHTML = title.substring(0, 12);
        el.appendChild(textPlace);

        var healthPlace = document.createElement("span");
        healthPlace.className += ' health';
        healthPlace.style.width = '100%';
        el.appendChild(healthPlace);
    }
}

function interfaceSetHealth(id, percent)
{
    var el = document.getElementById(id);
    if(el)
    {
        el.getElementsByClassName('health')[0].style.width = percent + '%';
    }
}






/////////////////////////////////
// mouse events
/////////////////////////////////

$(document).ready(function(){
    // start load data of map
    startAppInit();
});

function inputDevicesInit()
{
	$(document).on('mousedown', function(e) {
	    onDocumentMouseDown(e);
	});

	$(document).on('mousemove', function(e) {
	    onMouseMove(e);
	});

	document.addEventListener('mousewheel', onMouseWheel, false);
	window.addEventListener('resize', onWindowResize, false);
}



/////////////////////////////////
// functions
/////////////////////////////////
function init ()
{
    // create render element and render mode
    if (Detector.webgl)
    {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    }
    else
    {
        alert('WebGLRenderer is disabled!');
        location.href = '/dashboard';
        return false;
    }

    renderer.setSize(config.window.width, config.window.height);
    renderer.shadowMap.enabled = config.light.castShadow;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.cullFace = THREE.CullFaceBack;

    if(config.scene.fog.enabled === true)
    {
        scene.fog = new THREE.Fog(0x000000, 1, 3000);
        scene.fog.color.setHSL(0.6, 0, 1);
        renderer.setClearColor(scene.fog.color);
    }

    $('#frame').append(renderer.domElement);

    // events
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({
        charCode: 'm'.charCodeAt(0)
    });

    config.map.rows = config.map.matrix.length;
    config.map.cols = config.map.matrix[0].length;

    // init floor before add new custom objects
    _create_camera();
    _create_light();
    _create_floor();
    _create_sounds();

    // add player
    add_player('player');

    // load decor (start index 0 from decor list)
    _create_decor(0);

    // add frames
    // add_frames();

    // get array of objects
    createArrayOfObjects();

    // if(config.map.showGrid === true)
    // {
    //     show_grid();
    // }


    if(config.debug.enabled)
    {
        show_statistics();
    }

    animate();
}

function init_skills(object)
{
    // set default params
    object.skills = $.extend(true, {}, skills);
    object.skills.particle.options.position = new THREE.Vector3();
    object.skills.particle.options.velocity = new THREE.Vector3();

    // init: particle
    object.skills.particle.particleSystem = new THREE.GPUParticleSystem({
        maxParticles: object.skills.particle.maxParticles
    });
    object.skills.particle.isRun = false;
    object.skills.particle.ownerName = object.name;
    particleSystems.unshift(object.skills.particle);
    scene.add(object.skills.particle.particleSystem);
}

function createArrayOfObjects()
{
    sceneObjects_array = $.map(sceneObjects, function(value, index) {
        // if(value.name != 'Floor')
        return [value];
    });
}

function _create_camera()
{
    camera = new THREE.PerspectiveCamera( 30, config.camera.aspect, 1, 10000 );
    camera.position.z = 2200;

    // material for controls
    var material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    });

    // create point for target of camera
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    cameraTarget = new THREE.Mesh(geometry, material);
    cameraTarget.name = "cameraTarget";
    cameraTarget.position.set(0, config.floor.position.y, 0);
    scene.add(cameraTarget);

    // create point for camera position
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    cameraPosition = new THREE.Mesh(geometry, material);
    cameraPosition.name = "cameraPosition";
    cameraPosition.position.set(config.camera.startX, config.camera.startY, config.camera.startZ);
    scene.add(cameraPosition);

    // create camera
    camera = new THREE.PerspectiveCamera(config.camera.angle, config.camera.aspect, config.camera.near, config.camera.far);
    camera.position.set(config.camera.startX, config.camera.startY, config.camera.startZ);
    camera.lookAt(cameraTarget.position);
    scene.add(camera);

    // set controls for camera
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);
    controls.minPolarAngle = config.camera.controls.minPolarAngle;
    controls.maxPolarAngle = config.camera.controls.maxPolarAngle;
    controls.noKeys = config.camera.controls.noKeys;
    controls.noPan = config.camera.controls.noPan;
    controls.noRotate = config.camera.controls.noRotate;
    controls.target = cameraTarget.position;
}

function _create_floor()
{
    var loader = new THREE.TextureLoader();
    var texture = loader.load('images/textures/dota_map_full_compress2.jpg');

    var material = new THREE.MeshStandardMaterial({
        map: texture,
        refractionRatio: 0,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    var floorGeometry = new THREE.PlaneGeometry(config.floor.width, config.floor.length, 1, 1);
    var floorMesh = new THREE.Mesh(floorGeometry, material);

    floorMesh.position.set(0, config.floor.position.y, 0);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = config.light.castShadow;
    floorMesh.name = "Floor";
    floorMesh.callback = object_click;
    sceneObjects.floor = floorMesh;
    scene.add(floorMesh);
}

function _create_sounds()
{
    // set to camera
    camera.add(audioListener);

    // load files
    loadSoundFile(audioFiles.skills.particle.start, 'particle');
    loadSoundFile(audioFiles.skills.particle.collision, 'particle_collision');
    loadSoundFile(audioFiles.move, 'move');
}

function _create_light()
{
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 200, 0);
    spotLight.castShadow = true;
    spotLight.intensity = 4;
    spotLight.angle = 0.5;
    spotLight.exponent = 2.0;
    spotLight.penumbra = 0.6;
    spotLight.decay = 2;
    spotLight.distance = 1000;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    // shadow camera helper
    spotLight.shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 20000;
    scene.add(spotLight);

    scene.add(new THREE.HemisphereLight(0x111111, 0x111111));
}

function loadSoundFile(audioFile, methodName)
{
    var sound = new THREE.Audio(audioListener),
        audioLoader = new THREE.AudioLoader();

    audioLoader.load(audioFile, function(buffer) {
        sound.setBuffer(buffer);
        sounds[methodName] = sound;
        scene.add(sound);
    });
}

// function show_grid()
// {
//     // create object - cube
//     var geometry = new THREE.CubeGeometry(config.floor.width, 10, config.floor.length, config.map.cols, 1, config.map.rows);
//     var material = new THREE.MeshPhongMaterial({
//         color: 0xff0000,
//         wireframe: true
//     });
//     var mesh = new THREE.Mesh(geometry, material);
//     mesh.position.set(0, 0, 0);

//     mesh.name = "Grid";
//     mesh.callback = object_click;
//     mesh.position.set(0, config.floor.position.y, 0);
//     sceneObjects.cube = mesh;
//     scene.add(mesh);
// }

// function add_frames()
// {
//     // create objects
//     var material = new THREE.MeshPhongMaterial({
//         color: 0xffffff
//     });
//     var geometry = new THREE.CubeGeometry(10, 5, 10, 1, 1, 1);
//     var cube = new THREE.Mesh(geometry, material);
//     cube.name = "default";
//     cube.collision = true;
//     cube.callback = object_click;
//     cube.position.set(-500, 0, 0);
//     cube.castShadow = config.light.frameCastShadow;
//     cube.receiveShadow = config.light.frameCastShadow;
//     var check_positions;

//     for(var y = 1; y < config.map.matrix.length - 1; y++)
//     {
//         for(var x = 1; x < config.map.matrix[0].length - 1; x++)
//         {
//             if(config.map.matrix[y][x] == 0)
//             {
//                 check_positions = getMapPositionToPixels(y, x);
//                 var clone = cube.clone();
//                 clone.name = 'frame_' + y + '_' + x;
//                 clone.position.set(check_positions.x + 5, config.floor.position.y, check_positions.z + 5);
//                 clone.callback = object_click;
//                 sceneObjects['frame_' + y + '_' + x] = clone;
//                 sceneCollisionObjects.push(clone);
//                 scene.add(clone);
//             }
//         }
//     }
// }

function _create_decor(i)
{
	loaderObjectFromJS.load(decor[i].model, function (geometry, materials){
        createScene(geometry, materials, {
            x: decor[i].position.x,
            y: decor[i].position.y,
            z: decor[i].position.z
        }, {
            x: decor[i].rotate.x,
            y: decor[i].rotate.y,
            z: decor[i].rotate.z
        }, decor[i].scale, decor[i].type, decor[i].objectName);

        // next load
        if(i < (decor.length - 1))
        {
        	_create_decor(i + 1);
        }
    });
}

function add_player(objectType)
{
    // load the model
    loaderObjectFromJS.load(player.character.model, function (geometry, materials){
        createScene(geometry, materials, {
            x: player.position.x,
            y: player.position.y,
            z: player.position.z
        }, {
            x: 0,
            y: 0,
            z: 0
        }, 0.3, objectType, player.name);
    });
}

function show_statistics()
{
    // show FPS and etc. statistics
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10%';
    stats.domElement.style.zIndex = 100;
    $('#frame').append(stats.domElement);
}

function render()
{
    var delta = 0.75 * clock.getDelta();
    if(typeof sceneObjects.player !== 'undefined' && typeof sceneObjects.player.mixer !== 'undefined')
    {
        // Update the object's rotation & apply it
        sceneObjects.player.mixer.update(delta);
    }

    Object.keys(opponents).forEach(function(key){
        if(typeof opponents[key].mixer !== 'undefined')
        {
            opponents[key].mixer.update(delta);
        }
    });

    // render the main scene
    renderer.render(scene, camera);
}

function animate ()
{
    var delta;

    render();
    update();
    controls.update();
    stats.update();
    TWEEN.update();
    requestAnimationFrame(animate);
}

function update()
{
    // set camera position
    camera.position.x = cameraPosition.position.x;
    camera.position.y = cameraPosition.position.y;
    camera.position.z = cameraPosition.position.z;

    // set light position
    if(typeof sceneObjects.player !== 'undefined')
    {
        spotLight.position.x = sceneObjects.player.position.x;
        spotLight.position.z = sceneObjects.player.position.z;
    }

    updatePaticles();

    pingOtherObjectsForPlayer();

    // screen move
    if(isScreenMove === true)
        screenMove();
}

function updatePaticles()
{
    var delta = clock.getDelta();

    Object.keys(particleSystems).forEach(function(key){
        particleSystems[key].tick += delta;
        if(particleSystems[key].tick < 0)
        {
            particleSystems[key].tick = 0;
        }

        if(delta > 0 && particleSystems[key].isRun == true)
        {
            for(var x = 0; x < particleSystems[key].spawnerOptions.spawnRate * delta; x++)
            {
                particleSystems[key].particleSystem.spawnParticle(particleSystems[key].options);
            }
        }
        particleSystems[key].particleSystem.update(particleSystems[key].tick);
    });
}

function pingOtherObjectsForPlayer()
{
    Object.keys(opponents).forEach(function(key){
        if(typeof opponents[key] !== 'undefined' && opponents[key] != null && opponents[key] != 'loading')
        {
            var screen_position = toScreenPosition(opponents[key], camera);
            interfaceShowObjectTitle(opponents[key].uuid, opponents[key].name, screen_position.x, screen_position.y);
        }
    });
}

function object_click()
{
    console.log('click on ', this.name);
    socket.emit('click on object', {
    	name: this.name,
    	mouse_pos: {
    		x: sceneObjects.floor.mouse_pos.x,
    		z: sceneObjects.floor.mouse_pos.z
    	}
    });
    if(this.name == 'Floor')
    {
        // console.log('click position: ', this.mouse_pos);
        move_object();
    }
}

function move_object()
{
    // convert world position to local position by floor
    var local_x = parseInt(sceneObjects.player.position.x + (config.floor.width / 2)),
        local_z = parseInt(sceneObjects.player.position.z + (config.floor.length / 2));

    // get coordinates on matrix
    var move_from = getMapClickPosition(local_x, local_z),
        move_to = getMapClickPosition(sceneObjects.floor.mouse_pos.x, sceneObjects.floor.mouse_pos.z);

    // get move path
    var graph = new Graph(config.map.matrix, {
        diagonal: true
    });
    var start = graph.grid[move_from.row][move_from.column],
        end = graph.grid[move_to.row][move_to.column],
        path = astar.search(graph, start, end, {
            heuristic: astar.heuristics.diagonal
        });

    // get move points
    var points = [];

    // add first point as object position
    points.push(new THREE.Vector3(sceneObjects.player.position.x, config.floor.position.y, sceneObjects.player.position.z));

    // get size of map col / row in pixels
    var pixel_size_x = config.floor.width / config.map.cols,
        pixel_size_z = config.floor.length / config.map.rows;

    // set status move to object
    sceneObjects.player.isMove = true;

    // play sound
    soundPlay('move', 0, true);

    // calc points position in pixels
    for(var p = 0; p < path.length; p++)
    {
        var new_x = (path[p].y * pixel_size_x) - (config.floor.width / 2),
            new_z = (path[p].x * pixel_size_z) - -(config.floor.length / 2) * -1;
        points.push(new THREE.Vector3(new_x, config.floor.position.y, new_z));
    }

    // add path to object (in pixels)
    sceneObjects.player.movePath = new THREE.CatmullRomCurve3(points);

    // clear old move
    clrearMoveIntervalsFromObject(sceneObjects.player);
    sceneObjects.player.moveSetTimeout = [];

    // set animation
    objectAnimationMove(sceneObjects.player, true);

    // setup move by points
    var p;
    for(p = 0; p < path.length; p++)
    {
        var new_x = (path[p].y * pixel_size_x) - (config.floor.width / 2),
            new_z = (path[p].x * pixel_size_z) - -(config.floor.length / 2) * -1;
        sceneObjects.player.moveSetTimeout.push(setTimeout('animateObject(sceneObjects.player, ' + new_x + ', ' + new_z + ')', (player.moveSpeed + 10) * p));
    }

    sceneObjects.player.moveSetTimeout.push(setTimeout('objectAnimationStay(sceneObjects.player, true)', ((player.moveSpeed + 10) * p) + 50));

    sceneObjects.player.moveSetTimeout.push(setTimeout('soundStop("move")', ((player.moveSpeed + 10) * p) + 50));
}

function animateObject(object, new_x, new_z)
{
    if(object.isMove == false)
        return;

    // rotate object to end point
    objectRotateTo(object, new_x, new_z);

    // set volume
    soundSetVolumeByDistance('move', object);

    var move_from = {
            x: object.position.x,
            z: object.position.z
        },
        move_to = {
            x: new_x,
            z: new_z
        },
        offsetX,
        tween = new TWEEN.Tween(move_from)
            .to(move_to, player.moveSpeed)
            .onUpdate(function() {
                object.position.set(this.x, config.floor.position.y, this.z);
                socket.emit('send position', {
                    name: object.name,
                    position: {
                        x: this.x,
                        z: this.z
                    },
                    rotation: {
                        y: object.rotation.y
                    },
                    action: 'move'
                });
                // if(checkContactWithObjects(object, this.x, config.floor.position.y, this.z) === true)
                // {
                //     // console.log(this.x, this.y);
                //     object.position.set(this.x, config.floor.position.y, this.z);
                // }
                // else
                // {
                //     object.isMove = false;
                //     clrearMoveIntervalsFromObject(object);
                //     tween.stop();
                // }
            })
            .start()
            .onComplete(function(){
                socket.emit('send position', {
                    name: object.name,
                    position: {
                        x: object.position.x,
                        z: object.position.z
                    }
                });
            });
}

function runTween(object, new_position, time, isCheckCollision, calback, calbackData)
{
    var move_from = {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z
        },
        move_to = {
            x: new_position.x,
            y: new_position.y,
            z: new_position.z
        },
        collision,
        tween = new TWEEN.Tween(move_from)
            .to(move_to, time)
            .onUpdate(function(){
                if(isCheckCollision == true)
                {
                    collision = checkContactWithObjects(object, this)
                    if(collision !== false)
                    {
                        tween.stop();
                        if(calback)
                        {
                            calbackData.isCollision = true;
                            calbackData.collisionObjects = collision;
                            calback(calbackData);
                        }
                    }
                }

                object.position.set(this.x, this.y, this.z);
            })
            .start()
            .onComplete(function(){
                if(calback)
                {
                    calback(calbackData);
                }
            });
}

function objectRotateTo(object, new_x, new_z)
{
    // calc angle
    var points = [];
    points.push(new THREE.Vector3(object.position.x, config.floor.position.y, object.position.z));
    points.push(new THREE.Vector3(new_x, config.floor.position.y, new_z));
    var spline = new THREE.CatmullRomCurve3(points);
    var axis = new THREE.Vector3();
    var up = new THREE.Vector3(0, 0, 1);
    var tangent = spline.getTangentAt(1).normalize();
    var axis = new THREE.Vector3(0,0,0);
    axis.crossVectors(up, tangent).normalize();
    var radians = Math.acos(up.dot(tangent));
    object.matrix.makeRotationAxis(axis.normalize(), radians);
    object.rotation.setFromRotationMatrix(object.matrix);
}

function objectAnimationStay(object, isPublic)
{
    object.action.status = 'stay';
    object.action.stay.play();
    object.action.move.stop();

    if(isPublic == true)
    {
        socket.emit('send position', {
            name: object.name,
            position: {
                x: object.position.x,
                z: object.position.z
            },
            action: 'stay'
        });
    }
}

function objectAnimationMove(object, isPublic)
{
    object.action.status = 'move';
    object.action.stay.stop();
    object.action.move.play();

    if(isPublic == true)
    {
        socket.emit('send position', {
            name: object.name,
            position: {
                x: object.position.x,
                z: object.position.z
            },
            action: 'move'
        });
    }
}

function clrearMoveIntervalsFromObject(object)
{
    if(typeof object.moveSetTimeout === 'undefined')
        return;

    for(var i = 0; i < object.moveSetTimeout.length; i++)
    {
        clearInterval(object.moveSetTimeout[i]);
    }

    object.moveSetTimeout = [];
}

function screenMove()
{
    if(mouse.moveTo == 'left' || mouse.moveTo == 'left top' || mouse.moveTo == 'left bottom')
    {
        if(cameraPosition.position.x > -config.camera.controls.worldSizeCube)
        {
            cameraPosition.position.x -= config.camera.controls.moveSpeed;
            cameraTarget.position.x -= config.camera.controls.moveSpeed;
        }
    }
    else if(mouse.moveTo == 'right' || mouse.moveTo == 'right top' || mouse.moveTo == 'right bottom')
    {
        if(cameraPosition.position.x < config.camera.controls.worldSizeCube)
        {
            cameraPosition.position.x += config.camera.controls.moveSpeed;
            cameraTarget.position.x += config.camera.controls.moveSpeed;
        }
    }

    if(mouse.moveTo == 'bottom' || mouse.moveTo == 'left bottom' || mouse.moveTo == 'right bottom')
    {
        if(cameraPosition.position.z < config.camera.controls.worldSizeCube + 200)
        {
            cameraPosition.position.z += config.camera.controls.moveSpeed;
            cameraTarget.position.z += config.camera.controls.moveSpeed;
        }
    }
    else if(mouse.moveTo == 'top' || mouse.moveTo == 'left top' || mouse.moveTo == 'right top')
    {
        if(cameraPosition.position.z > -config.camera.controls.worldSizeCube)
        {
            cameraPosition.position.z -= config.camera.controls.moveSpeed;
            cameraTarget.position.z -= config.camera.controls.moveSpeed;
        }
    }
}

function useSkill(object, targetPosition, isPlayer)
{

    // if current player and skill is avaliable
    if(isPlayer == true && $('#particle').hasClass('active') == false)
    {
        return false;
    }

    console.log('useSkill');

    // calc end position
    var Rab = Math.sqrt(Math.pow((targetPosition.world_x - object.position.x), 2)  + Math.pow((targetPosition.world_z - object.position.z), 2));
    var k = object.skills.particle.maxDistance / Rab;
    targetPosition.world_x = object.position.x + (targetPosition.world_x - object.position.x) * k;
    targetPosition.world_z = object.position.z + (targetPosition.world_z - object.position.z) * k;

    // rotate player to target
    objectRotateTo(object, targetPosition.world_x, targetPosition.world_z)

    if(object.skills.particle.isRun == true)
    {
        // skill is busy
        return;
    }

    // set start position
    object.skills.particle.options.position.x = object.position.x;
    object.skills.particle.options.position.y = object.position.y + 5;
    object.skills.particle.options.position.z = object.position.z;
    object.skills.particle.isRun = true;

    // start animation
    runTween(object.skills.particle.options, {
        x: targetPosition.world_x,
        y: object.skills.particle.options.position.y,
        z: targetPosition.world_z
    }, object.skills.particle.speed, true, calbackSkillParticle, object);

    // start sound
    soundSetVolumeByDistance('particle', object);
    soundPlay('particle');

    if(isPlayer == true)
    {
        // call interface
        interfaceUseSkill('particle');

        // send to server
        socket.emit('use skill', {
            name: object.name,
            targetPosition: {
                world_x: targetPosition.world_x,
                world_z: targetPosition.world_z
            }
        });
    }
}

function calbackSkillParticle(object)
{
    // stop nimate
    object.skills.particle.isRun = false;

    // stop sound
    soundStop('particle');

    if(typeof object.isCollision !== 'undefined' && object.isCollision === true)
    {
        // play collision tune
        soundPlay('particle_collision');

        // get collision object
        console.log(object.collisionObjects[0].object);

        // set health
        interfaceSetHealth(object.collisionObjects[0].object.uuid, 75);

        // clear
        object.isCollision = false;
        object.collisionObjects = null;
    }
}

function getClickPosition(e)
{
    // e.preventDefault();

    var onClickPosition = new THREE.Vector2();
    var array = getMousePosition(container, e.clientX, e.clientY);
    onClickPosition.fromArray(array);
    var intersects = getIntersects(onClickPosition, sceneObjects_array);
    if (intersects.length > 0 && intersects[0].uv)
    {
        var uv = intersects[0].uv,
        x, z;

        if(intersects[0].object.material.map != null)
        {
            intersects[0].object.material.map.transformUv(uv);
        }

        // translate to px on floor
        x = uv.x * config.floor.width;
        z = uv.y * config.floor.length;
        uv = {
            x: x,
            z: z,
            world_x: x - (config.floor.width / 2),
            world_z: z - (config.floor.length / 2),
            intersects: intersects
        };
        return uv;
    }
}

function getTargetClick(e)
{
    e.preventDefault();
    var onClickPosition = new THREE.Vector2();
    var array = getMousePosition(container, e.clientX, e.clientY);
    onClickPosition.fromArray(array);
    var intersects = getIntersects(onClickPosition, sceneObjects_array);
    if (intersects.length > 0 && intersects[0].uv)
    {
        var uv = intersects[0].uv;

        if(intersects[0].object.material.map != null)
        {
            intersects[0].object.material.map.transformUv(uv);
        }

        // translate to px on floor
        uv = {
            x: uv.x * config.floor.width,
            z: uv.y * config.floor.length,
        };
        sceneObjects.floor.mouse_pos = uv;
        // console.log('intersects', intersects, sceneObjects.floor.mouse_pos);
        intersects[0].object.callback();
    }
}

var getMousePosition = function(dom, x, y)
{
    var rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};

var getIntersects = function(point, objects)
{
    mouse.set((point.x * 2) - 1, - (point.y * 2) + 1);
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(objects);
};

function getMapClickPosition(pixel_x, pixel_z)
{
    return {
        column: parseInt((pixel_x / config.floor.width) * config.map.matrix[0].length),
        row: parseInt((pixel_z / config.floor.length) * config.map.matrix.length)
    };
}

function getMapPositionToPixels(row, column)
{
    return {
        x: (column * (config.floor.width / config.map.matrix[0].length)) - config.floor.width / 2,
        z: (row * ((config.floor.length / config.map.matrix.length)) + -(config.floor.length / 2))
    };
}

function checkDistanceBetweenObjects(object1, object2)
{
    return Math.sqrt(Math.pow(object2.position.x - object1.position.x, 2) + Math.pow(object2.position.z - object1.position.z, 2));
}

function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
};

function checkContactWithObjects(object, nexPosition)
{
    var originPoint = object.position.clone();
    originPoint.set(nexPosition.x, nexPosition.y, nexPosition.z);

    for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++)
    {
        var localVertex = object.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(object.matrix);
        var directionVector = globalVertex.sub(object.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(sceneCollisionObjects);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
        {
            return collisionResults;
        }
    }

    return false;
}

function collision()
{
    'use strict';
    var collisions, i,
    // Maximum distance from the origin before we consider collision
    distance = 32,
    // Get the obstacles array from our world
    obstacles = basicScene.world.getObstacles();
    // For each ray
    for (i = 0; i < this.rays.length; i += 1)
    {
        // We reset the raycaster to this direction
        this.caster.set(this.mesh.position, this.rays[i]);
        // Test if we intersect with any obstacle mesh
        collisions = this.caster.intersectObjects(obstacles);
        // And disable that direction if we do
        if (collisions.length > 0 && collisions[0].distance <= distance)
        {
            // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
            if ((i === 0 || i === 1 || i === 7) && this.direction.z === 1)
            {
                this.direction.setZ(0);
            }
            else if ((i === 3 || i === 4 || i === 5) && this.direction.z === -1)
            {
                this.direction.setZ(0);
            }
            if ((i === 1 || i === 2 || i === 3) && this.direction.x === 1)
            {
                this.direction.setX(0);
            }
            else if ((i === 5 || i === 6 || i === 7) && this.direction.x === -1)
            {
                this.direction.setX(0);
            }
        }
    }
}

function soundPlay(name, volume, isLoop)
{
    if(typeof sounds[name] !== 'undefined')
    {
        if(isLoop == true)
        {
            sounds[name].setLoop(true);
        }

        if(typeof volume === 'number')
        {
            sounds[name].setVolume(volume);
        }

        sounds[name].play();
    }
}

function soundStop(name)
{
    if(typeof sounds[name] !== 'undefined')
    {
        sounds[name].stop();
        sounds[name].isPlaying = false;
    }
}

function soundSetVolumeByDistance(soundName, object)
{
    var volume = 1,
        distance = 0;

    if(typeof sounds[soundName] !== 'undefined')
    {
        // get distance
        distance = checkDistanceBetweenObjects(cameraPosition, object)

        // calc volume, 0 - 400 = 100% - 0%
        volume = (100 - (distance * 100) / config.sound.maxDistance) / 100;
        volume = (volume < 0) ? 0 : volume;
        sounds[soundName].setVolume(volume);
    }
}

function createScene(geometry, materials, position, rotation, s, objectType, objectName)
{
    geometry.computeBoundingBox();
    var bb = geometry.boundingBox;

    for(var i = 0; i < materials.length; i++)
    {
        var m = materials[i];
        if(objectType != 'decor')
        {
            m.skinning = true;
            m.morphTargets = true;
        }
        m.side = THREE.DoubleSide;
        m.color.setHSL(0.6, 0, 0.6);
    }
    mesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
    mesh.name = objectName + ' (' + parseInt(Math.random() * 10000) + ')';
    mesh.scale.set(1, 1, 1);
    mesh.collision = true;
    mesh.callback = object_click;
    mesh.scale.set(s, s, s);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.castShadow = config.light.castShadow;

    // init skills
    init_skills(mesh);

    if(objectType == 'decor')
    {
        sceneObjects[objectName] = mesh;
        sceneCollisionObjects.push(mesh);
        scene.add(mesh);
    }
    else
    {
        mesh.mixer = new THREE.AnimationMixer(mesh);
        mesh.action = {
            stay: mesh.mixer.clipAction(geometry.animations[0], null),
            move: mesh.mixer.clipAction(geometry.animations[1], null)
        };

        if(objectType == 'player')
        {
            sceneObjects.player = mesh;
            scene.add(mesh);

            spotLight.target = sceneObjects.player;
            opponents[objectType] = sceneObjects.player;

            socket.emit('send position', {
                name: sceneObjects.player.name,
                position: {
                    x: sceneObjects.player.position.x,
                    z: sceneObjects.player.position.z
                },
                action: 'stay'
            });
        }
        else
        {
            opponents[objectType] = mesh;
            sceneCollisionObjects.push(mesh);
            scene.add(mesh);
        }

        // start stay animation
        mesh.action.stay.play();
    }
}

function onDocumentMouseDown(e)
{
    e.preventDefault();

    mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (e.offsetY / renderer.domElement.clientHeight) * 2 + 1;
    mouse.target = e.target.nodeName;

    if(mouse.target != 'CANVAS')
    {
        return;
    }

    switch(e.which)
    {
        case 1:
            // left button
            useSkill(sceneObjects.player, getClickPosition(e), true);
            return false;
            break;
        case 2:
            // middle button
            return false;
            break;
        case 3:
            // right button
            getTargetClick(e);
            break;
        default: console.log('onDocumentMouseDown: ' + e.which);
    }
}

function onMouseMove(e)
{
    e.preventDefault();

    mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (e.offsetY / renderer.domElement.clientHeight) * 2 + 1;
    mouse.target = e.target.nodeName;

    if(config.camera.controls.enabled && mouse.target == 'CANVAS')
    {
        if(mouse.x < -config.camera.controls.screenPadding && mouse.y > config.camera.controls.screenPadding)
            mouse.moveTo = 'left top';
        else if(mouse.x < -config.camera.controls.screenPadding && mouse.y < -config.camera.controls.screenPadding)
            mouse.moveTo = 'left bottom';
        else if(mouse.x > config.camera.controls.screenPadding && mouse.y > config.camera.controls.screenPadding)
            mouse.moveTo = 'right top';
        else if(mouse.x > config.camera.controls.screenPadding && mouse.y < -config.camera.controls.screenPadding)
            mouse.moveTo = 'right bottom';
        else if(mouse.x < -config.camera.controls.screenPadding)
            mouse.moveTo = 'left';
        else if(mouse.x > config.camera.controls.screenPadding)
            mouse.moveTo = 'right';
        else if(mouse.y > config.camera.controls.screenPadding)
            mouse.moveTo = 'top';
        else if(mouse.y < -config.camera.controls.screenPadding)
            mouse.moveTo = 'bottom';
        else
            mouse.moveTo = '';

        if(mouse.moveTo != '')
            isScreenMove = true;
        else
            isScreenMove = false;
    }
}

function onMouseWheel(e)
{
    if(e.deltaY < 0 && cameraPosition.position.y > config.camera.controls.minDistance)
        cameraPosition.position.y -= config.camera.controls.moveSpeed;
    else if(cameraPosition.position.y < config.camera.controls.maxDistance)
        cameraPosition.position.y += config.camera.controls.moveSpeed;
}

function onWindowResize(e)
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onWindowKeyPress (event)
{
}