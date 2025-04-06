import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CalculatorService } from '../services/calculator.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  display: string = '0';
  lastOperation: string = '';
  currentInput: string = '0';
  isScientificMode: boolean = false;
  waitingForOperand: boolean = false;
  activeButton: string | null = null;
  memoryDisplay: string = '';

  constructor(private calculatorService: CalculatorService,
              private renderer: Renderer2,
              private el: ElementRef
  ) {}

  // Manipulação de números
  inputDigit(digit: string): void {
    if (this.waitingForOperand) {
      this.currentInput = digit;
      this.waitingForOperand = false;
    } else {
      this.currentInput =
        this.currentInput === '0' ? digit : this.currentInput + digit;
    }
    this.updateDisplay();
  }

  inputDecimal(): void {
    if (this.waitingForOperand) {
      this.currentInput = '0.';
      this.waitingForOperand = false;
    } else if (this.currentInput.indexOf('.') === -1) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  // Operações básicas
  performOperation(operation: string): void {
    const inputValue = parseFloat(this.currentInput);

    if (this.lastOperation && !this.waitingForOperand) {
      this.calculate();
    }

    this.calculatorService.setCurrentValue(inputValue);
    this.lastOperation = operation;
    this.waitingForOperand = true;
    this.updateDisplay();
  }

  calculate(): void {
    const inputValue = parseFloat(this.currentInput);

    if (this.lastOperation) {
      switch (this.lastOperation) {
        case '+':
          this.calculatorService.add(inputValue);
          break;
        case '-':
          this.calculatorService.subtract(inputValue);
          break;
        case '*':
          this.calculatorService.multiply(inputValue);
          break;
        case '÷':
          this.calculatorService.divide(inputValue);
          break;
        case '^':
          this.calculatorService.power(inputValue);
          break;
      }

      this.currentInput = this.calculatorService.getCurrentValue().toString();
      this.lastOperation = '';
      this.waitingForOperand = true;
      this.updateDisplay();
    }
  }

  // Funções científicas
  scientificFunction(func: string): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.setCurrentValue(currentValue);

    switch (func) {
      case 'sqrt':
        this.calculatorService.squareRoot();
        break;
      case 'sin':
        this.calculatorService.sin();
        break;
      case 'cos':
        this.calculatorService.cos();
        break;
      case 'tan':
        this.calculatorService.tan();
        break;
      case 'log':
        this.calculatorService.log();
        break;
      case 'ln':
        this.calculatorService.ln();
        break;
    }

    this.currentInput = this.calculatorService.getCurrentValue().toString();
    this.updateDisplay();
  }

  // Métodos de memória
  memoryAdd(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.memoryAdd(currentValue);
    this.updateMemoryDisplay();
  }

  memorySubtract(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.memorySubtract(currentValue);
    this.updateMemoryDisplay();
  }

  memoryStore(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.memoryStore(currentValue);
    this.updateMemoryDisplay();
  }

  memoryRecall(): void {
    const memoryValue = this.calculatorService.memoryRecall();
    this.currentInput = memoryValue.toString();
    this.updateDisplay();
  }

  memoryClear(): void {
    this.calculatorService.memoryClear();
    this.updateMemoryDisplay();
  }

  private updateMemoryDisplay(): void {
    const memoryValue = this.calculatorService.memoryRecall();
    this.memoryDisplay = memoryValue !== 0 ? 'M' : '';
  }

  // Atualiza o display
  private updateDisplay(): void {
    this.display = this.currentInput;
  }

  // Limpar
  clear(): void {
    this.currentInput = '0';
    this.calculatorService.clear();
    this.updateDisplay();
  }

  toggleSign(): void {
    if (this.currentInput === '0') return; // Não faz nada se for zero

    if (this.currentInput.startsWith('-')) {
      // Remove o sinal negativo se existir
      this.currentInput = this.currentInput.substring(1);
    } else {
      // Adiciona sinal negativo se não existir
      this.currentInput = '-' + this.currentInput;
    }
    this.updateDisplay();
  }

  backSpace(): void {
    if (this.currentInput.length === 1) {
      // Se só tem um dígito, volta para zero
      this.currentInput = '0';
    } else {
      // Remove o último caractere
      this.currentInput = this.currentInput.slice(0, -1);

      // Se ficar vazio ou apenas "-", volta para zero
      if (this.currentInput === '' || this.currentInput === '-') {
        this.currentInput = '0';
      }
    }
    this.updateDisplay();
  }

  clearEntry(): void {
    this.currentInput = '0';
    this.updateDisplay();
  }

  clearAll(): void {
    this.calculatorService.clearAll();
    this.currentInput = '0';
    this.lastOperation = '';
    this.waitingForOperand = false;
    this.updateDisplay();
  }

  // Função para porcentagem
  percentage(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.setCurrentValue(currentValue);
    this.calculatorService.percentage();
    this.currentInput = this.calculatorService.getCurrentValue().toString();
    this.updateDisplay();
  }

  // Função para inverso (1/x)
  reciprocal(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.setCurrentValue(currentValue);
    try {
      this.calculatorService.reciprocal();
      this.currentInput = this.calculatorService.getCurrentValue().toString();
    } catch (error) {
      this.currentInput = 'Error';
    }
    this.updateDisplay();
  }

  // Função para quadrado (x²)
  square(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.setCurrentValue(currentValue);
    this.calculatorService.square();
    this.currentInput = this.calculatorService.getCurrentValue().toString();
    this.updateDisplay();
  }

  // Função para raiz quadrada (²√x)
  squareRoot(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.setCurrentValue(currentValue);
    this.calculatorService.squareRoot();
    this.currentInput = this.calculatorService.getCurrentValue().toString();
    this.updateDisplay();
  }

  tenPowerX(): void {
    const currentValue = parseFloat(this.currentInput);
    this.calculatorService.setCurrentValue(currentValue);
    this.calculatorService.tenPowerX();
    this.currentInput = this.calculatorService.getCurrentValue().toString();
    this.updateDisplay();
  }

  // Alternar modo científico
  toggleScientificMode(): void {
    const elemento: HTMLElement = document.getElementsByClassName('calculator')[0] as HTMLElement;

    this.isScientificMode = !this.isScientificMode;
    if (this.isScientificMode) {
      this.lastOperation = '';
      this.waitingForOperand = false;
      this.renderer.removeClass(elemento, 'calculator');
      this.renderer.addClass(elemento, 'calculator-scientific');
    } else {
      this.renderer.removeClass(elemento, 'calculator-scientific');
      this.renderer.addClass(elemento, 'calculator');
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    const keyMap: {[key: string]: {action: () => void, buttonId: string}} = {
      '0': {action: () => this.inputDigit('0'), buttonId: 'btn-0'},
      '1': {action: () => this.inputDigit('1'), buttonId: 'btn-1'},
      '2': {action: () => this.inputDigit('2'), buttonId: 'btn-2'},
      '3': {action: () => this.inputDigit('3'), buttonId: 'btn-3'},
      '4': {action: () => this.inputDigit('4'), buttonId: 'btn-4'},
      '5': {action: () => this.inputDigit('5'), buttonId: 'btn-5'},
      '6': {action: () => this.inputDigit('6'), buttonId: 'btn-6'},
      '7': {action: () => this.inputDigit('7'), buttonId: 'btn-7'},
      '8': {action: () => this.inputDigit('8'), buttonId: 'btn-8'},
      '9': {action: () => this.inputDigit('9'), buttonId: 'btn-9'},
      '.': {action: () => this.inputDecimal(), buttonId: 'btn-decimal'},
      '+': {action: () => this.performOperation('+'), buttonId: 'btn-add'},
      '-': {action: () => this.performOperation('-'), buttonId: 'btn-subtract'},
      '*': {action: () => this.performOperation('*'), buttonId: 'btn-multiply'},
      '/': {action: () => this.performOperation('÷'), buttonId: 'btn-divide'},
      'Enter': {action: () => this.calculate(), buttonId: 'btn-equals'},
      '=': {action: () => this.calculate(), buttonId: 'btn-equals'},
      'Escape': {action: () => this.clearAll(), buttonId: 'btn-clear-all'},
      'Backspace': {action: () => this.backSpace(), buttonId: 'btn-backSpace'},
      '^': {action: () => this.performOperation('^'), buttonId: 'btn-power'},
      's': {action: () => this.scientificFunction('sin'), buttonId: 'btn-sin'},
      'c': {action: () => this.scientificFunction('cos'), buttonId: 'btn-cos'},
      't': {action: () => this.scientificFunction('tan'), buttonId: 'btn-tan'},
      'l': {action: () => this.scientificFunction('log'), buttonId: 'btn-log'},
      'n': {action: () => this.scientificFunction('ln'), buttonId: 'btn-ln'},
      'q': {action: () => this.scientificFunction('sqrt'), buttonId: 'btn-sqrt'},
      '%': {action: () => this.percentage(), buttonId: 'btn-percentage'},
      'r': {action: () => this.reciprocal(), buttonId: 'btn-reciprocal'},
      '²': {action: () => this.square(), buttonId: 'btn-square'},
      '√': {action: () => this.squareRoot(), buttonId: 'btn-sqrt'},
      'Delete': {action: () => this.clearEntry(), buttonId: 'btn-clear-entry'},
      'F9': {action: () => this.toggleSign(), buttonId: 'btn-toggle-sign'},
      'p': {action: () => this.tenPowerX(), buttonId: 'btn-ten-power'},
    };

    if (keyMap[key]) {
      event.preventDefault();
      this.highlightButton(keyMap[key].buttonId);
      keyMap[key].action();
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (this.activeButton) {
      this.removeHighlight(this.activeButton);
      this.activeButton = null;
    }
  }

  highlightButton(buttonId: string) {
    this.activeButton = buttonId;
    const button = this.el.nativeElement.querySelector(`#${buttonId}`);
    if (button) {
      this.renderer.addClass(button, 'active-key');
    }
  }

  removeHighlight(buttonId: string) {
    const button = this.el.nativeElement.querySelector(`#${buttonId}`);
    if (button) {
      this.renderer.removeClass(button, 'active-key');
    }
  }
}
