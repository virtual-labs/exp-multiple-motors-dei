Motors are essential output actuators used in embedded systems and robotics to perform mechanical movement such as rotation, positioning, and speed control. Arduino can control different types of motors using driver circuits and PWM signals.

In this experiment, we simulate the working of **DC motors, servo motors, and stepper motors** in a virtual lab environment, enabling safe and easy observation of motor behavior without requiring physical hardware.

---

## DC Motor

A DC Motor converts electrical energy into rotational mechanical motion.  
It is commonly used for **continuous rotation** applications.

### Working Principle

- Operates on **direct current (DC)**  
- Speed is controlled using **PWM (Pulse Width Modulation)** signals  
- Direction is controlled using an **H-Bridge motor driver** (L293D, L298N)  
- Higher PWM duty cycle → **higher speed**

### Simulation Use

- Adjust PWM values to change motor speed  
- Toggle H-bridge inputs to change direction  

### Applications

- Robots  
- Fans  
- Pumps  
- Wheels  
- Conveyor belts  

---

## Servo Motor

A Servo Motor provides **precise angular control** and is used wherever controlled rotation is required.

### Working Principle

- Controlled using PWM signal (typically **50 Hz**)  
- Angle depends on pulse width:
  - ~1 ms → **0°**
  - ~1.5 ms → **90°**
  - ~2 ms → **180°**
- Contains an **internal controller** and **feedback mechanism**

### Simulation Use

- Users can set exact servo angles in simulation  
- Servo instantly moves to the selected angle  

### Applications

- Robotic arms  
- Pan-tilt camera systems  
- RC vehicles  
- Precision control mechanisms  

---

## Stepper Motor

A Stepper Motor is used for **precise step-by-step rotation**.

### Working Principle

- Rotation occurs in **fixed steps** (e.g., 1.8° per step → 200 steps per revolution)  
- Controlled through a **driver module** (ULN2003, A4988, etc.)  
- Arduino energizes motor coils in sequences:
  - Single stepping  
  - Double stepping  
  - Half stepping  
- Supports accurate **position**, **direction**, and **speed** control  

### Simulation Use

- Users can simulate stepping sequences  
- Change RPM, speed, and direction digitally  
- No need for physical motors  

### Applications

- 3D printers  
- CNC machines  
- Robotics  
- Camera sliders  
- Automation systems  
