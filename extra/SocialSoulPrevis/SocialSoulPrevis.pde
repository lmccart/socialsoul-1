int screenSize[] = {1920, 1080};
int screenSpacing = 100;
int screenCount[] = {6, 8};
int screenIds[] = {
12, 11, 9,  9,  11, 12,
10, 7,  6,  5,  8,  10,
8,  4,  2,  3,  4,  7,
5,  3,  1,  1,  2,  6,
6,  2,  1,  1,  3,  5,
7,  4,  3,  2,  4,  8,
10, 8,  5,  6,  7,  10,
12, 11, 9,  9,  11, 12
};

PFont font;

void setup() {
  size(1024, 800);
  font = createFont("Helvetica", 16);
  textAlign(CENTER, CENTER);
}

void draw() {
  background(0);
  float totalWidth = screenCount[0] * (screenSize[0] + screenSpacing);
  textFont(font, 512);
  pushMatrix();
  scale(width / totalWidth);
  translate(screenSpacing / 2, screenSpacing / 2);
  for(int j = 0; j < screenCount[1]; j++) {
    for(int i = 0; i < screenCount[0]; i++) {
      float x = i * (screenSize[0] + screenSpacing);
      float y = j * (screenSize[1] + screenSpacing);
      int k = j * screenCount[0] + i;
      pushMatrix();
      translate(x, y);
      drawScreen(screenIds[k]);
      popMatrix();      
    }
  }
  popMatrix();
  
  textFont(font, 32);
  fill(200, 200, 0);
  Stage stage = getStage();
  translate(16, 0);
  rect(0, 0, 16, 32 * stage.globalTime);
  rect(32, 0, 16, 32 * stage.localTime);
  rect(64, 0, 16, 32 * stage.globalState);
  rect(96, 0, 16, 32 * stage.localState);
  rect(128, 0, 16, 32 * stage.stage);
}
