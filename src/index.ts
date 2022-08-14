import { AREAS_COUNT, SQUARE_COLUMNS, SQUARE_ROWS } from './SudokuConfig';
import SudokuModel from './SudokuModel';
import { SudokuBoard, SudokuValue } from './SudokuTypes';
import './sudoku.css';
import SudokuLogic from './SudokuLogic';

const root = document.querySelector('#root');
const sudokuModel = SudokuModel(SudokuLogic({
  areasCount: AREAS_COUNT,
  squareColumns: SQUARE_COLUMNS,
  squareRows: SQUARE_ROWS,
}));
let rows: SudokuBoard = [[]];

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

const viewBoard: HTMLInputElement[][] = [];

function valueChanged(e: KeyboardEvent, y: number, x: number) {
  if (e.key !== 'Tab') {
    e.preventDefault();
  }
  if (e.key.match(/^[1-9]$/)) {
    rows[y][x].value = Number(e.key) as SudokuValue;
  }
  if (['Backspace', '0'].includes(e.key)) {
    rows[y][x].value = undefined;
  }

  sudokuModel.setBoard(rows);
  let targetCell: HTMLElement | null = null;
  if (e.key === 'ArrowDown') {
    targetCell = viewBoard[y + 1]?.[x];
  } else if (e.key === 'ArrowRight') {
    targetCell = viewBoard[y]?.[x + 1];
  } else if (e.key === 'ArrowUp') {
    targetCell = viewBoard[y - 1]?.[x];
  } else if (e.key === 'ArrowLeft') {
    targetCell = viewBoard[y]?.[x - 1];
  }

  targetCell?.focus();
}

sudokuModel.board$.subscribe((board) => {
  rows = board;
  board.forEach((row, rIndex) => {
    row.forEach((cell, cIndex) => {
      const cellElement = viewBoard[rIndex]?.[cIndex];
      if (cellElement != null) {
        cellElement.value = cell.value?.toString() ?? '';
        cellElement.className = `cell ${cellElement.value ? classes[cellElement.value] : ''}`;
        cellElement.parentElement?.classList.toggle('error', cell.error);
        cellElement.classList.toggle('error', cell.error);
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
