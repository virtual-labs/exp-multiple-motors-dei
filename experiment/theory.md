#### Introduction

Motors are electromechanical devices that convert electrical energy into mechanical motion. They play a crucial role in embedded systems, robotics, automation, and industrial control applications where movement and actuation are required.

In this experiment, different types of motors such as **DC motor, servo motor, and stepper motor** are interfaced with an Arduino microcontroller. The experiment introduces learners to essential motor control concepts including **speed control, direction control, position control, and step-wise rotation**. Since Arduino cannot directly drive motors due to current limitations, external motor drivers are used for safe and efficient operation.

#### Arduino and Motor Control Basics

Arduino controls motors using various control techniques depending on the motor type:

- **Digital control signals** – Used for direction and ON/OFF control  
- **PWM (Pulse Width Modulation)** – Used for speed and position control  
- **External motor drivers** – Used to handle high current and voltage requirements  

**Key Limitations of Arduino:**
- Arduino I/O pins provide very low current  
- Motors require higher current and voltage  
- Direct connection may damage the Arduino  

#### Components

#### 1. **DC Motor**

A DC motor rotates continuously when a DC voltage is applied across its terminals. The speed of rotation is directly proportional to the applied voltage, while the direction of rotation depends on the polarity of the voltage.

To safely interface a DC motor with Arduino, an **H-Bridge motor driver** such as **L298N** is used. Direction is controlled using digital pins, and speed is controlled using PWM signals.

<div><img src="./images/dc.webp" alt="DC Motor" width="25%"></div>

**Applications:**
- Fans  
- Wheels in robotic vehicles  
- Water pumps  

#### 2. **Servo Motor**

A servo motor is designed for precise **angular position control**. Unlike DC motors, servo motors do not rotate continuously but move to a specific angle.

Servo motors are controlled using a PWM signal, typically within a range of **0° to 180°**. The control signal is connected to a digital pin of Arduino. If required, an external power supply is used. The **Servo library** simplifies servo motor control.

<div><img src="./images/servo.jpg" alt="Servo Motor" width="25%"></div>

**Applications:**
- Robotic arms  
- Camera positioning systems  
- Steering mechanisms  

#### 3. **Stepper Motor**

A stepper motor rotates in discrete steps, allowing accurate control over both position and speed. Each step corresponds to a fixed angle of rotation, making stepper motors ideal for precision applications.

Stepper motors require a dedicated driver such as **ULN2003** or **A4988** to interface with Arduino. The motor is controlled using specific step sequences and can rotate in both clockwise and anticlockwise directions without requiring feedback for basic operation.

<div><img src="./images/stepper.jpg" alt="Stepper Motor" width="30%"></div>

**Applications:**
- CNC machines  
- 3D printers  
- Precision positioning systems  

#### Circuit Connections

1. **DC Motor Connection**
   - Motor terminals connected to **H-Bridge driver**
   - Driver input pins connected to **Arduino digital pins**
   - PWM pin used for speed control

2. **Servo Motor Connection**
   - Signal pin connected to **Arduino digital pin**
   - Power and ground connected to **external supply if required**

3. **Stepper Motor Connection**
   - Motor connected to **stepper driver**
   - Driver control pins connected to **Arduino digital pins**
   - Step sequence controlled via code

#### Conclusion

This experiment demonstrates the interfacing and control of multiple types of motors using Arduino. Understanding motor control techniques such as speed control, direction control, and position control is essential for developing robotics, automation, and motion-based embedded systems.

