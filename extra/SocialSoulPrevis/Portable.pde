class Stage {
  int stage = 0;
  float localState = 0, globalState = 0;
  float localTime = 0, globalTime = 0;
};

float getElapsedTime() {
  return millis() / 1000.;
}

Stage getStage() {
  float stageLengths[] = {
    1, 2, 3, 3, 2, 1
  };
  float totalLength = 0;
  for(int i = 0; i < stageLengths.length; i++) {
    totalLength += stageLengths[i];
  }
  float modTime = getElapsedTime() % totalLength;
  float curLength = 0;
  for(int i = 0; i < stageLengths.length; i++) {
    curLength += stageLengths[i];
    if(modTime < curLength) {
      Stage cur = new Stage();
      cur.stage = i;
      cur.globalTime = modTime;
      cur.localTime = modTime - curLength + stageLengths[i];
      cur.globalState = cur.globalTime / totalLength;
      cur.localState = cur.localTime / stageLengths[i];
      return cur;
    }
  }
  return new Stage();
}

void drawScreen(int screenId) {
  noStroke();
  float bg = (1000. * abs(sin(millis() / 1000.)) + (screenId + 1) * 20) % 255;
  fill(bg);
  rect(0, 0, screenSize[0], screenSize[1]);
  fill(0);
  text(str(screenId), screenSize[0] / 2, screenSize[1] / 2);
}
