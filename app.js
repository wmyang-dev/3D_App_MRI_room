
let z = 10;
let x = 0;
let heading = 0;
let headingDelta = Math.PI / 60;

function keyup(event){
    let key = event.key;
    console.log(key);
    switch (key) {
        case "ArrowUp":
            z-= Math.cos(heading)
            x-= Math.sin(heading);
            break;
        case "ArrowDown":
            z+= Math.cos(heading);
            x-= Math.sin(heading);
            break;
        case "ArrowLeft":
            heading+= headingDelta;
            break;
        case "ArrowRight":
            heading-= headingDelta;
            break;
    }

    let viewpoint = document.getElementById("viewpoint");
    viewpoint.setAttribute("position", x+" 2 " + z);
    viewpoint.setAttribute("orientation", "0 1 0 " + heading);
}
//default parameters need to be after required parameters, JS restriction
//That's why location and such... etc  were put there
function createTriangle(scene, triCoord, location="0 0 0", color="0 0 1"){
    let transform = document.createElement("transform");
    transform.setAttribute("translation", location)
    //first level
    let shape = document.createElement("shape");
    //second level
    let appearance = document.createElement("appearance");
    let triangleSet = document.createElement("triangleSet");
    triangleSet.setAttribute('solid', 'false');
    //2-1 inside Appearance
    let material = document.createElement("material");
    material.setAttribute('diffuseColor',color); // close the triangle
    //2-2 inside TriangleSet
    let coordinate = document.createElement("coordinate");
    coordinate.setAttribute('point', triCoord);

    appearance.append(material);
    triangleSet.append(coordinate);
    shape.append(appearance);
    shape.append(triangleSet);
    transform.append(shape);
    scene.append(transform);
}
// let quadCoords = [
//     // Quad vertices in the form (x, y, z)
//     -1, 0, 0,   // Vertex 1, buttom left
//     1, 0, 0,    // Vertex 2, bottom right
//     1, 1, 0,    // Vertex 3, top right
//     -1, 1, 0    // Vertex 4, top-left
// ];
//ignore z while locating vertices for readability
function createQuad(scene, quadCoord, location="0 0 0", color="0 0 1"){
    //   /|      |  /
    //  / |      | /
    // /__|      |/
    let tri1 = `${quadCoord[0]} ${quadCoord[1]} ${quadCoord[2]}, ${quadCoord[3]} ${quadCoord[4]} ${quadCoord[5]}, ${quadCoord[6]} ${quadCoord[7]} ${quadCoord[8]}`;
    let tri2 = `${quadCoord[0]} ${quadCoord[1]} ${quadCoord[2]}, ${quadCoord[6]} ${quadCoord[7]} ${quadCoord[8]}, ${quadCoord[9]} ${quadCoord[10]} ${quadCoord[11]} `;
    createTriangle(scene, tri1, location, color);
    createTriangle(scene, tri2, location, color);
}
function createCube(scene, width = 2, height= 2, depth= 2 , location = "0 0 0", color = "1 0 0") {
    //for non-uniform scaling, for the arch later on
    let halfWidth = width / 2;
    let halfHeight = height /2;
    let halfDepth = depth / 2;
    //create a transform node for each face of the entire cube
    let cubeTransform = document.createElement("transform");
    cubeTransform.setAttribute("translation", location);
    // Define vertices for each face of the cube
    let front = [
        -halfWidth, -halfHeight, halfDepth,   // 0: front-bottom-left
        halfWidth, -halfHeight, halfDepth,    // 1: front-bottom-right
        halfWidth, halfHeight, halfDepth,     // 2: front-top-right
        -halfWidth, halfHeight, halfDepth     // 3: front-top-left
    ];
    let back = [
        -halfWidth, -halfHeight, -halfDepth,  // 4: back-bottom-left
        halfWidth, -halfHeight, -halfDepth,   // 5: back-bottom-right
        halfWidth, halfHeight, -halfDepth,    // 6: back-top-right
        -halfWidth, halfHeight, -halfDepth    // 7: back-top-left
    ];
    let left = [
        -halfWidth, -halfHeight, -halfDepth,  // 4
        -halfWidth, -halfHeight, halfDepth,   // 0
        -halfWidth, halfHeight, halfDepth,    // 3
        -halfWidth, halfHeight, -halfDepth    // 7
    ];
    let right = [
        halfWidth, -halfHeight, -halfDepth,   // 5
        halfWidth, -halfHeight, halfDepth,    // 1
        halfWidth, halfHeight, halfDepth,     // 2
        halfWidth, halfHeight, -halfDepth     // 6
    ];
    let top = [
        -halfWidth, halfHeight, halfDepth,    // 3
        halfWidth, halfHeight, halfDepth,     // 2
        halfWidth, halfHeight, -halfDepth,    // 6
        -halfWidth, halfHeight, -halfDepth   // 7
    ];
    let bottom = [
        -halfWidth, -halfHeight, halfDepth,   // 0
        halfWidth, -halfHeight, halfDepth,    // 1
        halfWidth, -halfHeight, -halfDepth,   // 5
        -halfWidth, -halfHeight, -halfDepth   // 4
    ];
    // apply vertices to each face of the cube
    createQuad(cubeTransform, front, "0 0 0", color);
    createQuad(cubeTransform, back, "0 0 0", color);
    createQuad(cubeTransform, left, "0 0 0", color);
    createQuad(cubeTransform, right, "0 0 0", color);
    // createQuad(cubeTransform, right, "0 0 0", "0 0 1");  //set different color for a particular face
    // createQuad(cubeTransform, top, "0 0 0", "1 1 0");    //for debugging
    createQuad(cubeTransform, top, "0 0 0", color);

    createQuad(cubeTransform, bottom, "0 0 0", color);

    scene.appendChild(cubeTransform);
}
// not used anymore, this is 2D arc, change to 3D arc by cube instead
function createArc(scene, radius = 2, segments = 50, location = "0 0 0", rotation = "0 0 1 0", color = "0 0 1",depth = 0.5) {
    let parentTransform = document.createElement("transform");
    parentTransform.setAttribute("translation", location);
    parentTransform.setAttribute("rotation", rotation); // Rotate whole arc

    let angleStep = Math.PI / segments; // Divide half-circle into segments
    let quadWidth = radius * Math.sin(angleStep / 2) * 2;
    let quadHeight = 2; // Adjust thickness

    for (let i = 0; i < segments; i++) {
        let angle = angleStep * i - Math.PI / 2; // Shift to center the arc
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);

        let quadCoord = [
            -quadWidth / 2, -quadHeight / 2, -depth / 2,  // Bottom-left of the quad (Z negative)
            quadWidth / 2, -quadHeight / 2, -depth / 2,   // Bottom-right of the quad (Z negative)
            quadWidth / 2, quadHeight / 2, -depth / 2,    // Top-right of the quad (Z negative)
            -quadWidth / 2, quadHeight / 2, -depth / 2,   // Top-left of the quad (Z negative)

            -quadWidth / 2, -quadHeight / 2, depth / 2,   // Bottom-left of the quad (Z positive)
            quadWidth / 2, -quadHeight / 2, depth / 2,    // Bottom-right of the quad (Z positive)
            quadWidth / 2, quadHeight / 2, depth / 2,     // Top-right of the quad (Z positive)
            -quadWidth / 2, quadHeight / 2, depth / 2     // Top-left of the quad (Z positive)
        ];

        let quadTransform = document.createElement("transform");
        quadTransform.setAttribute("translation", `${x} ${y} 0`);
        quadTransform.setAttribute("rotation", `0 0 1 ${angle}`); // Fix rotation

        createQuad(quadTransform, quadCoord, "0 0 0", color);
        parentTransform.append(quadTransform); // Add to parent
    }

    scene.append(parentTransform); // Add entire arc
}

function createArcCube(radius= 2, segments = 50, location = "0 0 0", rotation = "0 0 1 0", color = "0 0 1", thickness = 1){
    let parentTransform = document.createElement("transform");
    parentTransform.setAttribute("translation", location);
    parentTransform.setAttribute("rotation", rotation); // Rotate whole arc

    let angleStep = Math.PI / segments; // Divide half-circle into segments
    let segmentWidth = radius * Math.sin(angleStep / 2) * 2;
    let segmentHeight = 2;

    for (let i = 0; i < segments; i++) {
        let angle = angleStep * i - Math.PI / 2; // Shift to center the arc
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);

        let cubeTransform = document.createElement("transform");
        cubeTransform.setAttribute("translation", `${x} ${y} 0`); //z is not moving
        cubeTransform.setAttribute("rotation", `0 0 1 ${angle}`); //angle for overlapping

        createCube(cubeTransform, segmentWidth ,segmentHeight, thickness,"0 0 0", color);

        parentTransform.append(cubeTransform);
    }
    // scene.append(parentTransform); // Add entire arc
    // change to return function for reusability
    return parentTransform;
}

function createMRITunnel(){
    let mriTunnel = document.createElement("transform");
    //rotation: "1 1 1 2.1" , 2.1 =~ 120 degree
    let firstPart = createArcCube(2,100,"-4 0 0", "1 1 1 2.1", "1 1 1", 0.5);
    let middlePart = createArcCube(2, 100, "-2.5 0 0", "1 1 1 2.1", "0 1 1", 2.5);
    let lastPart = createArcCube(2,100,"-1 0 0", "1 1 1 2.1", "1 1 1", 0.5);
    mriTunnel.append(firstPart);
    mriTunnel.append(middlePart);
    mriTunnel.append(lastPart);

    return mriTunnel;
}

function createMRITable(id="",size="2 2 2",location = "0 0 0", color="0 0 1"){
    let transform = document.createElement("transform");
    transform.setAttribute("id", id);
    let shape = document.createElement("shape");
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");
    let box = document.createElement("box");

    box.setAttribute("size", size);

    transform.setAttribute("translation", location);
    material.setAttribute("diffuseColor", color);

    appearance.append(material);

    shape.append(appearance);
    shape.append(box);

    transform.append(shape);

    return transform;
}

function createLEGOCharacter(id="",location="0 0 0", rotation="0 0 0 0",bodyImage=undefined, headImage=undefined, limbColor="0 0 1") {
    let characterTransform = document.createElement("transform");
    characterTransform.setAttribute("translation", location);
    characterTransform.setAttribute("rotation", rotation);
    characterTransform.setAttribute("id", id);
    // Body (use box)
    let bodyTransform = document.createElement("transform")
    let bodyShape = document.createElement("shape");
    let bodyAppearance = document.createElement("appearance");
    //inside appearance, same level
    let bodyMaterial = document.createElement("material");
    let bodyTexture = document.createElement("ImageTexture");
    bodyTexture.setAttribute("url", bodyImage);
    bodyMaterial.setAttribute("diffuseColor", "1 1 0");
    //been added in appearance after setting
    bodyAppearance.appendChild(bodyMaterial);
    bodyAppearance.appendChild(bodyTexture);
    //
    let bodyBox = document.createElement("box");
    bodyBox.setAttribute("size", "1 1 0.5");  // Size of the body
    bodyShape.appendChild(bodyAppearance);
    bodyShape.appendChild(bodyBox);
    bodyTransform.append(bodyShape);
    bodyTransform.setAttribute("translation", "0 0 0");

    // Head (use sphere)
    let headTransform = document.createElement("transform");
    let headShape = document.createElement("shape");
    let headAppearance = document.createElement("appearance");
    //inside appearance
    let headMaterial = document.createElement("material");
    let headTexture = document.createElement("ImageTexture");
    headMaterial.setAttribute("diffuseColor", "1 0 0");
    headTexture.setAttribute("url",headImage);
    //adding in appearance after setting
    headAppearance.appendChild(headMaterial);
    headAppearance.appendChild(headTexture);
    //
    headAppearance.appendChild(headMaterial);
    let headSphere = document.createElement("sphere");
    headSphere.setAttribute("radius", "0.45");  // Radius of the head(size)
    headShape.appendChild(headAppearance);
    headShape.appendChild(headSphere);
    headTransform.append(headShape);
    headTransform.setAttribute("translation", "0 0.9 0"); // Position the head on top of the body

    // Legs (use cylinders)
    let legsTransform = document.createElement("transform");

    let legShapeLeft = createLimb("0 0 0", limbColor, "0.15");
    legShapeLeft.setAttribute("translation", "-0.3 -0.8 0 ");  // Position of the left leg
    let legShapeRight = createLimb("0 0 0", limbColor,"0.15");
    legShapeRight.setAttribute("translation", "0.3 -0.8 0");  // Position of the right leg

    let leftHand = createHand("-1 -0.08 0",limbColor,"-1")
    let rightHand = createHand("1 -0.08 0",limbColor,"1");

    characterTransform.appendChild(bodyTransform);
    characterTransform.appendChild(headTransform);
    characterTransform.appendChild(legsTransform);
    characterTransform.appendChild(legShapeLeft);
    characterTransform.appendChild(legShapeRight);
    characterTransform.appendChild(leftHand);
    characterTransform.appendChild(rightHand);


    return characterTransform;
}

function createLimb(location="0 0 0", color="0 0 1", radius="0.1",height="0.8") {
    let limbTransform = document.createElement("transform");
    limbTransform.setAttribute("translation", location);
    let limbShape = document.createElement("shape");
    let limbAppearance = document.createElement("appearance");
    let limbMaterial = document.createElement("material");
    limbMaterial.setAttribute("diffuseColor", color);
    limbAppearance.appendChild(limbMaterial);
    let limbCylinder = document.createElement("cylinder");
    limbCylinder.setAttribute("radius", radius);
    limbCylinder.setAttribute("height", height);
    limbShape.appendChild(limbAppearance);
    limbShape.appendChild(limbCylinder);

    limbTransform.append(limbShape);
    return limbTransform;
}
//handRotation set -1 for left hand by default
function createHand(location="0 0 0",armColor="1 1 0", handRotation="-1") {
    let handTransform = document.createElement("transform");
    handTransform.setAttribute("translation", location);

    //arm part, use createLimb
    let armTransform = document.createElement("transform");
    armTransform.setAttribute("translation", "0 0 0");
    let arm = createLimb("0 0.45 0",armColor, "0.13", "0.6");//attach to palm, palm remain in origin
    armTransform.append(arm);
    //palm, a sphere
    let palmTransform = document.createElement("transform");
    palmTransform.setAttribute("translation", "0 0 0");
    let palmShape = document.createElement("shape");
    let palmAppearance = document.createElement("appearance");
    let palmMaterial = document.createElement("material");
    palmMaterial.setAttribute("diffuseColor", "1 1 0");
    palmAppearance.appendChild(palmMaterial);
    let handSphere = document.createElement("sphere");
    handSphere.setAttribute("radius", "0.15"); //radius for hand's size
    palmShape.appendChild(palmAppearance);
    palmShape.appendChild(handSphere);
    palmTransform.append(palmShape);

    //append arm,palm to hand
    handTransform.append(armTransform);
    handTransform.append(palmTransform);
    handTransform.setAttribute("rotation","0 0 1 " + handRotation);

    return handTransform;
}

function play(){
    window.requestAnimationFrame(updateModel);
}

let startTimeMilliseconds = -1;
let jumpDuration = 1000; // 1 second jump up, 1 second jump down
let moveDuration = 2000; // MRI table moves in 2 seconds
let panelOffDur = 1000; // turning the display to whole black in 1s
let ctDuration = 25000; // Depends on browser : 20000/ 137 =~ 146(ms) or 30000 / 137 =~ 219(ms) for each slice
let animationPhase = 0; // 0 = jumping up, 1 = falling down, 2 = moving MRI

function updateModel(timeStampMilliseconds) {
    if (startTimeMilliseconds === -1) {
        startTimeMilliseconds = timeStampMilliseconds;
    }
    let elapsed = timeStampMilliseconds - startTimeMilliseconds;
    //walls
    let wallsGroup = document.getElementById("walls");
    let appearances = wallsGroup.getElementsByTagName("Appearance");
    //panel
    let panelAppearances = document.getElementById("panel");
    //action
    switch (animationPhase) {
        case 0: // Doctor jumps up (y=0 → y=3)
            let progressUp = Math.min(elapsed / jumpDuration, 1);
            document.getElementById("doctor").setAttribute("translation", `-6.5 ${progressUp * 3} -3`);
            // console.log('first phase: ', progressUp);

            if (progressUp >= 1) {
                animationPhase = 1;
                startTimeMilliseconds = timeStampMilliseconds;
                // console.log('first phase end at: ', progressUp);
            }
            break;
        case 1: // Doctor falls down (y=3 → y=0)
            let progressDown = Math.min(elapsed / jumpDuration, 1);
            document.getElementById("doctor").setAttribute("translation", `-6.5 ${(1 - progressDown) * 3} -3`);
            // console.log('second phase, falling:', progressDown);
            // switch turned to off,
            document.getElementById("redButton").setAttribute("diffuseColor", `${1-progressDown} 0 0`);
            // turning off the "lights", disabling walls texture, darken the room

            for(let i=0;i< appearances.length;i++){
                let texture = appearances[i].getElementsByTagName("ImageTexture")[0];
                // console.log(texture)
                if(texture){
                    texture.setAttribute("url", "");
                }
            }
            if (progressDown >= 1) {
                animationPhase = 2;
                startTimeMilliseconds = timeStampMilliseconds;
            }
            break;
        case 2: // MRI table moves (-1, -0.5, -3 → 1, -0.5, -3)
            let progressMove = Math.min(elapsed / moveDuration, 1);
            let x = -1 + progressMove * (1 - (-1)); // 1 - (-1): end(x) - start(x)
            let intensity = progressMove * 10;

            document.getElementById("mriTable").setAttribute("translation", `${x} -0.5 -3`);
            let lightIntensity = document.getElementById("ceilingLight");
            lightIntensity.setAttribute("intensity", `${intensity}`);
            if (progressMove >= 1) {
                animationPhase = 3;
                startTimeMilliseconds = timeStampMilliseconds;
            }
            break;
        case 3: //turning panel to black before loading in texture
            let progress = Math.min(elapsed/ panelOffDur,1);
            let panelColor = panelAppearances.getElementsByTagName("material")[0];

            panelColor.setAttribute("diffuseColor", `${1-progress} ${1-progress} ${1-progress}`);

            for(let i=0;i< appearances.length;i++){
                let texture = appearances[i].getElementsByTagName("ImageTexture")[0];
                // console.log(texture)
                if(texture){
                    texture.setAttribute("url", "tile_mosaic.png");
                }
            }
            if(progress >=1) {
                // return;
                animationPhase = 4;
                startTimeMilliseconds = timeStampMilliseconds;
            }
            break;
        case 4:
            let totalSlices = 137;

            let progressCT = Math.min(elapsed / ctDuration, 1);
            let sliceIndex = Math.floor(progressCT * (totalSlices - 1)) + 1; // Map progress to slice index

            let panelAppearance = document.getElementById("panel");
            let texture = panelAppearance.getElementsByTagName("ImageTexture")[0];

            if (!texture) {
                // Create ImageTexture if it doesn't exist
                texture = document.createElement("ImageTexture");
                panelAppearance.appendChild(texture);
            }

            texture.setAttribute("url", `CT_slices/${sliceIndex}.png`);
            console.log(`Loading: CT_slices/${sliceIndex}.png`);

            if (progressCT >= 1) {
                return; // Stop after last slice
            }
            break;

    }
    window.requestAnimationFrame(updateModel);
}

function main(){
    let scene = document.getElementById("scene");

    let mriTunnel = createMRITunnel();
    mriTunnel.setAttribute("translation","5 0 -3");
    // scene.append(mriTunnel);

    let mriTable = createMRITable("mriTable","6 0.8 2");
    mriTable.setAttribute("translation", "-1 -0.5 -3");
    mriTable.querySelector("material").setAttribute("diffuseColor", "0 1 1");
    // scene.append(mriTable);

    let mriPlacement = document.createElement("transform");
    mriPlacement.setAttribute("translation", "2 0 0");
    mriPlacement.append(mriTunnel);

    let patientBody = "patient_suit.png";
    let patientHead = "patient_head.png";

    let patient = createLEGOCharacter("patient","1 0 0.7","0 0 1 -1.5", patientBody, patientHead, `${144/256} ${213/256} ${255/256}`);
    let patientZtrans = document.createElement("transform");
    patientZtrans.setAttribute("rotation", "1 0 0 -1.55");
    patientZtrans.append(patient);
    //place patient on the table
    mriTable.append(patientZtrans);
    //add table(include patient) together with tunnel
    mriPlacement.append(mriTable);

    scene.append(mriPlacement);
    let doctorBody = "doctor_suit.png";
    let doctorHead = "doctor_head.png";
    let doctor = createLEGOCharacter("doctor","-6.5 0 -3", undefined, doctorBody, doctorHead, `${194/256} ${178/256} ${128/256}`);
    scene.append(doctor);

    document.addEventListener("keyup", keyup);
}

