import { BehaviorSubject, Observable } from 'rxjs';
import { AREAS_COUNT } from './SudokuConfig';
import {
  getAllAreas, markErrors, resetErrors, solveSudoku,
} from './SudokuLogic';
import { SudokuBoard, SudokuValue } from './SudokuTypes';

interface ISudokuModel {
  board$: Observable<SudokuBoard>;
  reset(): void;
  calc(board: SudokuBoard): void;
  setBoard(board: SudokuBoard): void;
}

function createDefaultBoard(): SudokuBoard {
  return Array(AREAS_COUNT).fill(1).map(() => Array(AREAS_COUNT).fill(1).map(() => ({
    options: Array(AREAS_COUNT).fill(1).map((_, index) => (index + 1) as SudokuValue),
    error: false,
  })));
}

export default function SudokuModel(): ISudokuModel {
  const boardSubject = new BehaviorSubject<SudokuBoard>(createDefaultBoard());
  function reset() {
    boardSubject.next(createDefaultBoard());
  }

  function calc(board: SudokuBoard) {
    boardSubject.next(solveSudoku(board));
  }

  function setBoard(board: SudokuBoard) {
    const { columns, squares, rows } = getAllAreas(board);
    resetErrors(columns);
    markErrors(columns);
    markErrors(squares);
    markErrors(rows);
    boardSubject.next(rows);
  }

  return {
    board$: boardSubject.asObservable(),
    setBoard,
    reset,
    calc,
  };
}
