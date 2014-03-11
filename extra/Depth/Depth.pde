import processing.pdf.*;

float[] totalScale = {
  1080,//12 * 9 + 5,
  1404//12 * 11 + 9
};
float[] screenSize = {
  192,//22 + (1. / 2.),
  108//13 + (1. / 8.)
};
int[] screenCount = {
  5,
  10
};

float z(float x, float y) {
  float base = -cos(TWO_PI * x / totalScale[0]) * cos(TWO_PI * y / totalScale[1]);
  base = depth * ((1 - base) / 2.);
  base = float(round(base * 2)) / 2;
  return (21 - depth) + base;
}

float[][] monitors = {
{12, 10, 9, 10, 12},
{10, 8, 7, 8, 10},
{8, 6, 5, 6, 8},
{11, 4, 3, 4, 11},
{7, 3, 1, 2, 7},
{7, 2, 1, 3, 7},
{11, 4, 3, 4, 11},
{8, 6, 5, 6, 8},
{10, 8, 7, 8, 10},
{12, 10, 9, 10, 1}
};

PFont font;
float rescale = 6;
float depth = 10;
float c = 3;
void setup() {
  size((int) (rescale * totalScale[0]), (int) (rescale * totalScale[1]), PDF, "out.pdf");
  textMode(SHAPE);
  font = createFont("Helvetica", 32);
  textFont(font, 16 / rescale);
//} void draw() {
  scale(rescale, rescale);
  background(255);

  float[] spacing = {
    (totalScale[0] - (screenSize[0] * screenCount[0])) / screenCount[0],
    (totalScale[1] - (screenSize[1] * screenCount[1])) / screenCount[1]
  };
  float[] leftovers = {
    spacing[0] / 2,
    spacing[1] / 2
  };

  println("var map={};for(i = 0; i < 12; i++){map[i]=[]}");
  for (int i = 0; i < screenCount[0]; i++) {
    for (int j = 0; j < screenCount[1]; j++) {
      float x = leftovers[0] + (screenSize[0] + spacing[0]) * i;
      float y = leftovers[1] + (screenSize[1] + spacing[1]) * j;
      println("map["+int(monitors[j][i]-1) + "].push([" + round(x) + ", " + round(y) + "])");
      
      stroke(0, 10);
      noFill();
      line(x + c, y + c, x + screenSize[0] - c, y + screenSize[1] - c);
      line(x + screenSize[0] - c, y + c, x + c, y + screenSize[1] - c);
      
      drawSample(x, y, LEFT, TOP);
      drawSample(x + screenSize[0], y, RIGHT, TOP);
      drawSample(x, y + screenSize[1], LEFT, BOTTOM);
      drawSample(x + screenSize[0], y + screenSize[1], RIGHT, BOTTOM);
    }
  }
  println("console.log(JSON.stringify(map));");
}

void drawSample(float x, float y, int lr, int tb) {
  fill(0);
  noStroke();  
  textAlign(lr, tb);
  text(nf(z(x, y), 0, 1), x, y);
}
