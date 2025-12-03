Motors are essential output actuators used in embedded systems and robotics to perform mechanical movement such as rotation, positioning, and speed control. Arduino can control different types of motors using driver circuits and PWM signals. In this experiment, we simulate the working of DC motors, servo motors, and stepper motors in a virtual lab environment, allowing safe and easy observation of motor behavior without physical hardware.

# DC Motor

A DC Motor converts electrical energy into rotational mechanical motion. It is commonly used for continuous rotation applications.

## Working Principle

Operates on direct current (DC).

Speed can be controlled by PWM (Pulse Width Modulation) signals from Arduino.

Direction is controlled using an H-Bridge motor driver (like L293D or L298N).

Higher PWM duty cycle → higher speed.

## Simulation Use

The virtual lab allows adjusting PWM values to change speed and toggling H-bridge inputs to change rotation direction.

## Applications

Robots, fans, pumps, wheels, conveyor belts.

# Servo Motor

A Servo Motor provides precise angular control. It is widely used wherever controlled rotation is required.

## Working Principle

Controlled using a PWM signal (typically 50 Hz).

The pulse width determines the angle:

~1 ms → 0°

~1.5 ms → 90°

~2 ms → 180°

Contains an internal control circuit and position feedback mechanism.

## Simulation Use

The simulation lets users set specific angles and observe instantaneous servo movement.

## Applications

Robotic arms, pan-tilt cameras, RC vehicles, precision mechanisms.

# Stepper Motor

A Stepper Motor is a precise positioning motor that rotates in fixed steps.

## Working Principle

Rotation is divided into small steps (e.g., 1.8° per step → 200 steps per revolution).

Controlled using step sequences sent through a driver module (ULN2003, A4988, etc.).

Arduino energizes coils in a specific order to move the motor:

Single stepping

Double stepping

Half stepping

Allows accurate control of position, direction, and speed.

## Simulation Use

Users can simulate step sequences, RPM control, and direction changes digitally without real hardware.

## Applications

3D printers, CNC machines, robotics, camera sliders, automation equipment.