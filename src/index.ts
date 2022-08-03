import { AREAS_COUNT } from './SudokuConfig';
import SudokuModel from './SudokuModel';
import { SudokuBoard, SudokuValue } from './SudokuTypes';
import './sudoku.css';

const root = document.querySelector('#root');
const sudokuModel = SudokuModel();
const rows: SudokuBoard = Array(AREAS_COUNT).fill(1)
  .map(() => Array(AREAS_COUNT).fill(1).map(() => ({
    options: [],
  })));
const allowedActions = ['Backspace', 'Tab'];

const classes = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
};

function valueChanged(e: KeyboardEvent, y: number, x: number) {
  if (!allowedActions.includes(e.key)) {
    e.preventDefault();
  }
  if (!e.target || !(e.target instanceof HTMLInputElement)) {
    return;
  }
  if (e.key.match(/^[1-9]$/)) {
    rows[y][x].value = Number(e.key) as SudokuValue;
    e.target.value = e.key;
    e.target.className = `cell ${classes[e.key]}`;
    return;
  }
  if (e.key === 'Backspace') {
    e.target.value = '';
  }
  if (e.target.value === '') {
    e.target.className = 'cell';
  }
}

const viewBoard: HTMLInputElement[][] = [];

sudokuModel.board$.subscribe((board) => {
  board.forEach((row, rIndex) => {
    row.forEach((cell, cIndex) => {
      rows[rIndex][cIndex].value = cell.value;
      if (viewBoard[rIndex]?.[cIndex] != null) {
        viewBoard[rIndex][cIndex].value = cell.value?.toString() ?? '';
        if (cell.error) {
          viewBoard[rIndex][cIndex].classList.add('error');
        }
      }
    });
  });
});

function init() {
  if (!root) {
    throw new Error('No root!');
  }
  const container = document.createElement('div');
  container.className = 'container';
  root.appendChild(container);
  const reset = document.createElement('button');
  const solve = document.createElement('button');
  reset.textContent = 'Reset';
  solve.textContent = 'Solve';
  reset.addEventListener('click', () => sudokuModel.reset());
  solve.addEventListener('click', () => {
    sudokuModel.calc(rows);
  });
  root.appendChild(reset);
  root.appendChild(solve);

  const table = document.createElement('table');
  table.className = 'sudoku-board';
  for (let rowIndex = 0; rowIndex < AREAS_COUNT; rowIndex++) {
    const rowElement = document.createElement('tr');
    rowElement.className = 'row';
    const row: HTMLInputElement[] = [];
    viewBoard.push(row);
    for (let colIndex = 0; colIndex < AREAS_COUNT; colIndex++) {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.className = 'cell';
      cell.appendChild(input);
      input.addEventListener('keydown', (e) => {
        valueChanged(e, rowIndex, colIndex);
      });
      cell.className = 'cellTd';
      row.push(input);
      rowElement.appendChild(cell);
    }
    table.appendChild(rowElement);
  }
  container.appendChild(table);
}

init();
