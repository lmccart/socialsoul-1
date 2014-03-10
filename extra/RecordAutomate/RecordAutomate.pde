import java.awt.*;
import java.awt.event.*;

class Slowbot {
  Robot robot;
  int delayTime;
  Slowbot(int delayTime) {
    try {
      robot = new Robot();
    } catch(AWTException e) {
    }
    this.delayTime = delayTime;
  }
  void mouseMove(int x, int y) {
    robot.mouseMove(x, y);
    delay(delayTime);
  }
  void leftPress() {
    robot.mousePress(InputEvent.BUTTON1_MASK);
    delay(delayTime);
  }
  void leftRelease() {
    robot.mouseRelease(InputEvent.BUTTON1_MASK);
    delay(delayTime);
  }
  void leftClick() {
    leftPress();
    leftRelease();
  }
}

void setup() {
    Slowbot robot = new Slowbot(1000);
    robot.mouseMove(194, 117); // record button
    robot.leftClick();
    robot.mouseMove(8, 102); // top left
    robot.leftPress();
    robot.mouseMove(8 + 960, 102 + 540); // bottom right
    robot.leftRelease();
    robot.mouseMove(484, 373); // record button
    robot.leftClick();
    robot.mouseMove(0, 0);
    
    loadStrings("http://localhost:3000/controller?action=trigger&user=kcimc");
    
    delay(5000);
    robot.mouseMove(1182, 9); // stop button
    robot.leftClick();
}
