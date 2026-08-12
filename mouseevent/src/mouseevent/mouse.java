package mouseevent;
import java.awt.*;
import java.awt.event.*;

public class mouse extends Frame{
	mouse(){
		setSize(400,200);
		setLayout(null);
		setVisible(true);
		addMouseListener(new MouseAdapter() {
			public void mousePressed(MouseEvent e) {
				System.out.println("Mouse Pressed");
			}
		});
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		new mouse();

	}

}
