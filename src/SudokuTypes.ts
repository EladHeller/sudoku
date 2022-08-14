import { Observable } from 'rxjs';

export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SudokuCell {
  value?: SudokuValue;
  error: boolean;
  options: Array<SudokuValue>;
}

export type SudokuBoard = SudokuCell[][];

export interface SudokuConfig {
  areasCount: number;
  squareRows: number;
  squareColumns: number;
}

export interface ISudokuLogic {
  markErrors: (board: SudokuBoard) => boolean;
  resetErrors: (board: SudokuBoard) => void;
  getSameCells: (
    relevantCells: SudokuCell[],
    requestedSameCount: number,
    matchCells: SudokuCell[]
  ) => SudokuCell[] | undefined;
  getAllAreas: (
    board: SudokuBoard
  ) => { rows: SudokuBoard; columns: SudokuBoard; squares: SudokuBoard };
  solveSudoku: (board: SudokuBoard) => SudokuBoard;
  createDefaultBoard(): SudokuBoard;
  calcOptions(board: SudokuBoard): boolean;
}

export interface ISudokuModel {
  board$: Observable<SudokuBoard>;
  reset(): void;
  calc(board: SudokuBoard): void;
  setBoard(board: SudokuBoard): void;
}
