float screenSize[] = {
  1920, 1080
};
float screenSpacing = 100;
int screenCount[] = {
  5, 10
};
int screenIds[] = {
  12, 10, 9, 10, 12,
  10, 8, 7, 8, 10,
  8, 6, 5, 6, 8,
  7, 4, 3, 4, 7,
  7, 3, 1, 2, 7,
  7, 2, 1, 3, 7,
  7, 4, 3, 4, 7,
  8, 6, 5, 6, 8,
  10, 8, 7, 8, 10,
  12, 10, 9, 10, 12
};

PFont font;

void setup() {
  size(800, 935); // 1024x800
  font = createFont("Helvetica", 16);
  textAlign(CENTER, CENTER);
/*
  float lowestDev = 0;
  for (float divisor = 6168; divisor < 6672; divisor+=.1) {
      int allCount[] = new int[12];
      for (int j = 0; j < screenCount[1]; j++) {
        for (int i = 0; i < screenCount[0]; i++) {
          float x = i * (screenSize[0] + screenSpacing);
          float y = j * (screenSize[1] + screenSpacing);
          float xc = ((screenCount[0] - 1) / 2.) * (screenSize[0] + screenSpacing);
          float yc = ((screenCount[1] - 1) / 2.) * (screenSize[1] + screenSpacing);
          float d = dist(xc, yc, x, y);
          d /= divisor; // 514 - 556
          d = constrain(d, 0, 1);
//          d = pow(d, 2);
          d *= 12;
          d = constrain(d, 1, 12);
          int k = j * screenCount[0] + i;
          screenIds[k] = int(d);
          allCount[int(d) - 1]++;
        }
      }
      float mean = 0;
      for (int i = 0; i < allCount.length; i++) {
        mean += allCount[i];
      }
      mean /= allCount.length;
      float curDev = 0;
      for (int i = 0; i < allCount.length; i++) {
        curDev += sq(allCount[i] - mean);
      }
      if (lowestDev == 0 || curDev < lowestDev) {
        lowestDev = curDev;
        println("lowest: " + divisor);
        println(allCount);
    }
  }
  */
}

void draw() {
  background(0);
  float totalWidth = screenCount[0] * (screenSize[0] + screenSpacing);
  textFont(font, 512);
  pushMatrix();
  scale(width / totalWidth);
  translate(screenSpacing / 2, screenSpacing / 2);
  for (int j = 0; j < screenCount[1]; j++) {
    for (int i = 0; i < screenCount[0]; i++) {
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

