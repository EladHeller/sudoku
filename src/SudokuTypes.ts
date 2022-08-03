export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SudokuCell = {
  value?: SudokuValue;
  error?: boolean;
  options: Array<SudokuValue>;
};

export type SudokuBoard = SudokuCell[][];
