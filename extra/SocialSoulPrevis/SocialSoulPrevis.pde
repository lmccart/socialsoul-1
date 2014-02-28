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
  textFont(font, 512);
  textAlign(CENTER, CENTER);
}

void draw() {
  background(0);
  float totalWidth = screenCount[0] * (screenSize[0] + screenSpacing);
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
}

void drawScreen(int screenId) {
  noStroke();
  float bg = (1000. * sin(millis() / 1000.) + screenId * 1000) % 255;
  fill(bg);
  rect(0, 0, screenSize[0], screenSize[1]);
  fill(0);
  text(str(screenId), screenSize[0] / 2, screenSize[1] / 2);
}
