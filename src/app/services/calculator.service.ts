import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private currentValue: number = 0;
  private memory: number = 0;

  add(value: number): void {
    this.currentValue += value;
  }

  subtract(value: number): void {
    this.currentValue -= value;
  }

  multiply(value: number): void {
    this.currentValue *= value;
  }

  divide(value: number): void {
    if (value !== 0) {
      this.currentValue /= value;
    } else {
      throw new Error('Division by zero');
    }
  }

  percentage(): void {
    this.currentValue /= 100;
  }

  // Métodos de memória
  memoryAdd(value: number): void {
    this.memory += value;
  }

  memorySubtract(value: number): void {
    this.memory -= value;
  }

  memoryStore(value: number): void {
    this.memory = value;
  }

  memoryRecall(): number {
    return this.memory;
  }

  memoryClear(): void {
    this.memory = 0;
  }

  // Operações científicas

  power(exponent: number): void {
    this.currentValue = Math.pow(this.currentValue, exponent);
  }

  reciprocal(): void {
    if (this.currentValue !== 0) {
      this.currentValue = 1 / this.currentValue;
    } else {
      throw new Error('Division by zero');
    }
  }

  tenPowerX(): void {
    this.currentValue = Math.pow(10, this.currentValue);
  }

  sin(): void {
    this.currentValue = Math.sin(this.currentValue);
  }

  cos(): void {
    this.currentValue = Math.cos(this.currentValue);
  }

  tan(): void {
    this.currentValue = Math.tan(this.currentValue);
  }

  log(): void {
    this.currentValue = Math.log10(this.currentValue);
  }

  ln(): void {
    this.currentValue = Math.log(this.currentValue);
  }

  square(): void {
    this.currentValue = Math.pow(this.currentValue, 2);
  }

  squareRoot(): void {
    this.currentValue = Math.sqrt(this.currentValue);
  }

  // Getters e Setters
  getCurrentValue(): number {
    return this.currentValue;
  }

  setCurrentValue(value: number): void {
    this.currentValue = value;
  }

  clear(): void {
    this.currentValue = 0;
  }

  clearAll(): void {
    this.currentValue = 0;
    this.memory = 0;
  }

  toggleSign(): void {
    this.currentValue = -this.currentValue;
  }

}
