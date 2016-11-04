PFont font;

void setup() {
  size(1920, 1080);
  font = createFont("Helvetica", height, true);
  textFont(font);
  textAlign(CENTER, CENTER);
  
  for(int k = 0; k < 12; k++) {
    String id = str(k);
    while(id.length() < 2) {
      id = "0" + id;
    }
    
    strokeWeight(1);
    noStroke();
    fill(255);
    rect(0, 0, width, height);
    
    pushMatrix();
    colorMode(HSB);
    int hspace = height / 20;
    
    translate(0, height / 2 - hspace * 2);
    for(int i = 0; i < width; i++) {
      float hue = map(i, 0, width, 0, 255);
      stroke(hue, 255, 255);
      line(i, 0, i, hspace);
    }
    
    translate(0, hspace);
    colorMode(RGB);
    for(int i = 0; i < width; i++) {
      float brightness = map(i, 0, width, 0, 255);
      stroke(brightness, brightness, brightness);
      line(i, 0, i, hspace * 1.5);
    }
    
    translate(0, hspace);
    stroke(0);
    noFill();
    for(int i = 0; i < width; i++) {
      if(i % 2 == 0) {
        line(i, 0, i, hspace);
      }
    }
    
    translate(0, hspace);
    colorMode(RGB);
    int resolution = 16;
    for(int i = 0; i < width; i++) {
      float brightness = (256 / resolution) * int(map(i, 0, width, 0, resolution + 1));
      stroke(brightness, brightness, brightness);
      line(i, 0, i, hspace);
    }
    
    popMatrix();
    
    strokeWeight(4);
    
    fill(0);
    stroke(255);
    text(id, width / 2, height / 2);
    
    stroke(0, 128.);
    line(0, 0, width, height);
    line(width, 0, 0, height);
    line(int(width / 2), 0, int(width / 2), height);
    line(0, int(height / 2), width, int(height / 2));
    
    int offset = height / 20;
    fill(0);
    stroke(255);
    for(int i = 0; i < 2; i++) {
      int s = offset / (i + 1);
      ellipse(offset, offset, s, s);
      ellipse(width - offset, offset, s, s);
      ellipse(width - offset, height - offset, s, s);
      ellipse(offset, height - offset, s, s);
    }
    
    saveFrame("background-" + id + ".png"); 
  }
}