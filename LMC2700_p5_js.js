// State management
let gameState = 0; 
let titleImage;
let showHint = false; // Tracks if the popup is open

// ==========================================
// 🛠️ DEBUG MODE & BASE TUNING VARIABLES
// ==========================================
let debugMode = false; // Set to false to hide the colored tuning boxes

// --- START BUTTON ---
let b_hitX = 400; let b_hitY = 260; let b_hitW = 100; let b_hitH = 30;
let b_monX = 400; let b_monY = 210; let b_monW = 390; let b_monH = 210;

// --- HINT FOLDER --- (Adjust these to fit the folder on the right)
let b_hintX = 720; // Left/Right position
let b_hintY = 190; // Up/Down position
let b_hintW = 120; // Width
let b_hintH = 90; // Height
// ==========================================

function preload() {
  titleImage = loadImage('GameTitleScreen.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  rectMode(CENTER); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (gameState === 0) {
    drawTitleScreen();
  } else if (gameState === 1) {
    drawGameScreen();
  }
}

function drawTitleScreen() {
  // 1. Calculate dynamic scale multipliers
  let rx = width / 800; 
  let ry = height / 450;
  
  // Apply multipliers
  let hitX = b_hitX * rx; let hitY = b_hitY * ry; 
  let hitW = b_hitW * rx; let hitH = b_hitH * ry;
  let monX = b_monX * rx; let monY = b_monY * ry; 
  let monW = b_monW * rx; let monH = b_monH * ry;
  
  // Hint Box multipliers
  let hintX = b_hintX * rx; let hintY = b_hintY * ry; 
  let hintW = b_hintW * rx; let hintH = b_hintH * ry;

  // 2. Draw background
  imageMode(CORNER);
  image(titleImage, 0, 0, width, height); 
  
  // 3. Hover Detections (Only check if the pop-up is CLOSED)
  let isHoveringStart = false;
  let isHoveringHint = false;
  
  if (!showHint) {
    isHoveringStart = (mouseX > hitX - hitW/2 && mouseX < hitX + hitW/2 && 
                       mouseY > hitY - hitH/2 && mouseY < hitY + hitH/2);
                       
    isHoveringHint = (mouseX > hintX - hintW/2 && mouseX < hintX + hintW/2 && 
                      mouseY > hintY - hintH/2 && mouseY < hintY + hintH/2);
  }
  
  // 4. Draw Glow Effects
  if (isHoveringStart) {
    drawGlow(monX, monY, monW, monH, 10 * rx, rx);
  }
  if (isHoveringHint) {
    drawGlow(hintX, hintY, hintW, hintH, 5 * rx, rx);
  }
  
  // 5. Draw Debug Visuals
  if (debugMode) {
    push();
    noFill();
    strokeWeight(2);
    
    // Start button guides
    stroke(255, 0, 0); rect(monX, monY, monW, monH);
    fill(255, 255, 0, 150); stroke(255, 255, 0); rect(hitX, hitY, hitW, hitH);
    
    // Hint folder guide (Blue)
    fill(0, 150, 255, 150); stroke(0, 150, 255); rect(hintX, hintY, hintW, hintH);
    pop();
  }
  
  // 6. Draw the Pop-up Hint Window (if active)
  if (showHint) {
    push();
    // Dark semi-transparent overlay to dim the background
    fill(0, 0, 0, 180);
    noStroke();
    rect(width/2, height/2, width, height);
    
    // The pop-up box
    fill(26, 20, 35); // Dark background matching the desk
    stroke(16, 255, 104); // Terminal green border
    strokeWeight(4 * rx);
    drawingContext.shadowBlur = 30 * rx; // Add a glow to the pop-up itself
    drawingContext.shadowColor = color(16, 255, 104);
    rect(width/2, height/2, 500 * rx, 300 * ry, 15 * rx);
    
    // Reset shadow blur for text
    drawingContext.shadowBlur = 0; 
    
    // Text inside the pop-up
    fill(16, 255, 104);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24 * rx);
    text("CLASSIFIED FILE ACCESSED.", width/2, height/2 - (60 * ry));
    
    textSize(18 * rx);
    text("The robot uprising began exactly at 0101.\nCheck the newspaper clippings on the wall.", width/2, height/2);
    
    // Close instruction
    textSize(14 * rx);
    fill(255);
    text("[ CLICK ANYWHERE TO CLOSE ]", width/2, height/2 + (100 * ry));
    pop();
  }
}

// A reusable function for the thin outline and bright halo effect
function drawGlow(x, y, w, h, corners, scaleFactor) {
  push();
  noFill();
  
  // 1. The extremely bright halo
  drawingContext.shadowBlur = 60 * scaleFactor; // Cranked up blur
  drawingContext.shadowColor = color(255, 255, 255); 
  
  // 2. The thin white outline
  strokeWeight(2 * scaleFactor); // Thin, sharp line
  stroke(255, 255, 255); // Solid white, no transparency
  
  // 3. Draw it twice! This doubles the intensity of the shadow for that "extreme" brightness
  rect(x, y, w, h, corners); 
  rect(x, y, w, h, corners); 
  
  pop(); 
}

function drawGameScreen() {
  background(0);
  fill(16, 255, 104);
  textAlign(CENTER, CENTER);
  textSize(32 * (width/800)); 
  text("SYSTEM ACCESSED.\nGAME LOGIC GOES HERE.", width / 2, height / 2);
}

function mousePressed() {
  if (gameState === 0) {
    // If the hint is currently showing, clicking ANYWHERE closes it.
    if (showHint) {
      showHint = false;
      return; // Stop the rest of the mousePressed code from running this frame
    }
    
    // Recalculate hitboxes for click detection
    let rx = width / 800; 
    let ry = height / 450;
    
    let hitX = b_hitX * rx; let hitY = b_hitY * ry; 
    let hitW = b_hitW * rx; let hitH = b_hitH * ry;
    
    let hintX = b_hintX * rx; let hintY = b_hintY * ry; 
    let hintW = b_hintW * rx; let hintH = b_hintH * ry;

    // Check if clicking Start
    if (mouseX > hitX - hitW/2 && mouseX < hitX + hitW/2 && 
        mouseY > hitY - hitH/2 && mouseY < hitY + hitH/2) {
      gameState = 1; 
    }
    
    // Check if clicking Hint Folder
    if (mouseX > hintX - hintW/2 && mouseX < hintX + hintW/2 && 
        mouseY > hintY - hintH/2 && mouseY < hintY + hintH/2) {
      showHint = true; 
    }
  }
}
