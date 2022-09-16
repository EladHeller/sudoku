import SudokuLogic from '../SudokuLogic';
import { ISudokuLogic, SudokuBoard, SudokuCell } from '../SudokuTypes';

describe('SudokuLogic', () => {
  let sudokuLogic: ISudokuLogic;

  beforeEach(() => {
    sudokuLogic = SudokuLogic({
      areasCount: 4,
      squareColumns: 2,
      squareRows: 2,
    });
  });

  describe('markErrors', () => {
    it('should mark errors', () => {
      const board: SudokuBoard = [
        [
          {
            value: 1,
            error: false,
            options: [1],
          },
          {
            value: 1,
            error: false,
            options: [1],
          },
        ],
      ];
      const result = sudokuLogic.markErrors(board);
      expect(result).toBe(true);
      expect(board).toEqual([
        [
          {
            value: 1,
            options: [1],
            error: true,
          },
          {
            value: 1,
            options: [1],
            error: true,
          },
        ],
      ]);
    });
  });

  describe('getSameCells', () => {
    it('should return same cells', () => {
      const firstCell: SudokuCell = { error: false, options: [2, 3] };
      const row: SudokuCell[] = [
        { error: false, options: [4, 5, 6] },
        { error: false, options: [2, 3] },
      ];

      const results = sudokuLogic.getSameCells(row, 2, [firstCell]);
      expect(results).toEqual([firstCell, row[1]]);
    });
  });

  describe('calcOptions', () => {
    it('should remove options if other cells must have this option', () => {
      sudokuLogic = SudokuLogic({
        areasCount: 4,
        squareColumns: 2,
        squareRows: 2,
      });

      const board: SudokuBoard = [
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 3] },
          { error: false, options: [1, 2, 3] },
          { error: false, options: [1, 2, 3] },
        ],
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2] },
          { error: false, options: [2, 3] },
          { error: false, options: [1, 3] },
        ],
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 4] },
          { error: false, options: [2, 3] },
          { error: false, options: [2, 3] },
        ],
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1] },
        ],
      ];

      const changed = sudokuLogic.calcOptions(board);
      expect(changed).toBe(true);
      expect(board[0][0].options).toEqual([4]);
      expect(board[1][0].options).toEqual([4]);
      expect(board[2][0].options).toEqual([1, 4]);
      expect(board[2][0].options).toEqual([1, 4]);
      expect(board[3][0].options).toEqual([2, 3, 4]);
      expect(board[3][1].options).toEqual([2, 3, 4]);
      expect(board[3][2].options).toEqual([2, 3, 4]);
    });
  });

  describe('getAllAreas', () => {
    it('should get all areas from suduko board', () => {
      const board: SudokuBoard = [
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 4] },
          { error: false, options: [3, 4] },
          { error: false, options: [1, 3, 4] },
        ],
        [
          { error: true, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [2, 3, 4] },
          { error: false, options: [2, 4] },
          { error: false, options: [2, 3, 4] },
          { error: true, options: [1], value: 1 },
        ],
        [
          { error: false, options: [1, 2] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [3, 4] },
        ],
      ];

      const {
        columns, horizontalSquares, rows, squares,
      } = sudokuLogic.getAllAreas(board);

      expect(rows).not.toBe(board);
      expect(rows).toEqual(board);
      expect(columns).toEqual([
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: true, options: [1, 2, 3, 4] },
          { error: false, options: [2, 3, 4] },
          { error: false, options: [1, 2] },
        ],
        [
          { error: false, options: [1, 4] },
          { error: false, options: [1, 2, 4] },
          { error: false, options: [2, 4] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [1, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: true, options: [1], value: 1 },
          { error: false, options: [3, 4] },
        ],
      ]);
      expect(squares).toEqual([
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 4] },
          { error: true, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 4] },
        ],
        [
          { error: false, options: [3, 4] },
          { error: false, options: [1, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [2, 3, 4] },
          { error: false, options: [2, 4] },
          { error: false, options: [1, 2] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [2, 3, 4] },
          { error: true, options: [1], value: 1 },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [3, 4] },
        ],
      ]);
      expect(horizontalSquares).toEqual([
        [
          { error: false, options: [1, 2, 3, 4] },
          { error: true, options: [1, 2, 3, 4] },
          { error: false, options: [1, 4] },
          { error: false, options: [1, 2, 4] },
        ],
        [
          { error: false, options: [2, 3, 4] },
          { error: false, options: [1, 2] },
          { error: false, options: [2, 4] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: false, options: [1, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
        ],
        [
          { error: false, options: [2, 3, 4] },
          { error: false, options: [1, 2, 3, 4] },
          { error: true, options: [1], value: 1 },
          { error: false, options: [3, 4] },
        ],
      ]);

      expect(rows[0][0]).toBe(columns[0][0]);
      expect(rows[0][0]).toBe(squares[0][0]);
      expect(rows[0][0]).toBe(horizontalSquares[0][0]);
    });

    it('should works with difference number of rows and columns', () => {
      sudokuLogic = SudokuLogic({
        areasCount: 6,
        squareColumns: 3,
        squareRows: 2,
      });

      const board: SudokuBoard = [
        [
          { error: false, options: [4, 6] },
          { error: false, options: [2, 3] },
          { error: false, options: [1, 2] },
          { error: true, options: [1, 2, 4] },
          { error: false, options: [2, 3] },
          { error: false, options: [1, 2, 3, 4, 6] },
        ],
        [
          { error: false, options: [4, 5, 6] },
          { error: false, options: [1, 3, 4, 5] },
          { error: false, options: [1, 2, 4, 5, 6] },
          { error: false, options: [2, 4] },
          { error: false, options: [2, 3, 5, 6] },
          { error: false, options: [1, 2, 3, 4, 5, 6] },
        ],
        [
          { error: false, options: [1, 2, 3, 4, 5, 6] },
          { error: false, options: [1, 2, 3, 4, 5] },
          { error: false, options: [1, 2, 3, 4, 5, 6] },
          { error: false, options: [1, 2, 4, 5, 6] },
          { error: true, options: [2, 4] },
          { error: false, options: [2, 3, 4, 5] },
        ],
        [
          { error: true, options: [1, 2, 3, 4, 5, 6] },
          { error: false, options: [1, 2, 3, 5, 6] },
          { error: false, options: [1, 2, 3, 5, 6] },
          { error: false, options: [2], value: 2 },
          { error: false, options: [1, 4] },
          { error: false, options: [1, 6] },
        ],
        [
          { error: false, options: [1, 2, 5] },
          { error: false, options: [1, 3, 4, 5, 6] },
          { error: false, options: [1, 2, 3, 4, 6] },
          { error: false, options: [2, 5] },
          { error: true, options: [6], value: 6 },
          { error: false, options: [1, 2, 4, 6] },
        ],
        [
          { error: false, options: [1, 5, 6] },
          { error: false, options: [2, 4, 5, 6] },
          { error: false, options: [6], value: 6 },
          { error: false, options: [2, 4] },
          { error: false, options: [2, 6] },
          { error: false, options: [1, 2, 4, 6] },
        ],
      ];

      const {
        columns, horizontalSquares, rows, squares,
      } = sudokuLogic.getAllAreas(board);

      expect(rows).not.toBe(board);
      expect(rows).toEqual(board);
      expect(columns).toEqual([
        [
          board[0][0],
          board[1][0],
          board[2][0],
          board[3][0],
          board[4][0],
          board[5][0],
        ],
        [
          board[0][1],
          board[1][1],
          board[2][1],
          board[3][1],
          board[4][1],
          board[5][1],
        ],
        [
          board[0][2],
          board[1][2],
          board[2][2],
          board[3][2],
          board[4][2],
          board[5][2],
        ],
        [
          board[0][3],
          board[1][3],
          board[2][3],
          board[3][3],
          board[4][3],
          board[5][3],
        ],
        [
          board[0][4],
          board[1][4],
          board[2][4],
          board[3][4],
          board[4][4],
          board[5][4],
        ],
        [
          board[0][5],
          board[1][5],
          board[2][5],
          board[3][5],
          board[4][5],
          board[5][5],
        ],
      ]);
      expect(squares).toEqual([
        [
          board[0][0], board[0][1], board[0][2],
          board[1][0], board[1][1], board[1][2],
        ],
        [
          board[0][3], board[0][4], board[0][5],
          board[1][3], board[1][4], board[1][5],
        ],
        [
          board[2][0], board[2][1], board[2][2],
          board[3][0], board[3][1], board[3][2],
        ],
        [
          board[2][3], board[2][4], board[2][5],
          board[3][3], board[3][4], board[3][5],
        ],
        [
          board[4][0], board[4][1], board[4][2],
          board[5][0], board[5][1], board[5][2],
        ],
        [
          board[4][3], board[4][4], board[4][5],
          board[5][3], board[5][4], board[5][5],
        ],
      ]);

      expect(horizontalSquares).toEqual([
        [
          board[0][0], board[1][0], board[2][0],
          board[0][1], board[1][1], board[2][1],
        ],
        [
          board[3][0], board[4][0], board[5][0],
          board[3][1], board[4][1], board[5][1],
        ],
        [
          board[0][2], board[1][2], board[2][2],
          board[0][3], board[1][3], board[2][3],
        ],
        [
          board[3][2], board[4][2], board[5][2],
          board[3][3], board[4][3], board[5][3],
        ],
        [
          board[0][4], board[1][4], board[2][4],
          board[0][5], board[1][5], board[2][5],
        ],
        [
          board[3][4], board[4][4], board[5][4],
          board[3][5], board[4][5], board[5][5],
        ],
      ]);
    });
  });

  describe('solveSudoku', () => {
    it('should solve sudoku', () => {
      const board: SudokuBoard = [[
        { error: false, options: [] },
        { error: false, options: [] },
        { error: false, options: [] },
        { error: false, options: [] },
      ], [
        { error: false, options: [1], value: 1 },
        { error: false, options: [] },
        { error: false, options: [2], value: 2 },
        { error: false, options: [] },
      ], [
        { error: false, options: [] },
        { error: false, options: [4], value: 4 },
        { error: false, options: [] },
        { error: false, options: [3], value: 3 },
      ], [
        { error: false, options: [] },
        { error: false, options: [] },
        { error: false, options: [] },
        { error: false, options: [] },
      ]];

      const result = sudokuLogic.solveSudoku(board);
      expect(result[0][0]).not.toBe(board[0][0]);

      expect(result).toEqual([[
        { error: false, options: [4], value: 4 },
        { error: false, options: [2], value: 2 },
        { error: false, options: [3], value: 3 },
        { error: false, options: [1], value: 1 },
      ], [
        { error: false, options: [1], value: 1 },
        { error: false, options: [3], value: 3 },
        { error: false, options: [2], value: 2 },
        { error: false, options: [4], value: 4 },
      ], [
        { error: false, options: [2], value: 2 },
        { error: false, options: [4], value: 4 },
        { error: false, options: [1], value: 1 },
        { error: false, options: [3], value: 3 },
      ], [
        { error: false, options: [3], value: 3 },
        { error: false, options: [1], value: 1 },
        { error: false, options: [4], value: 4 },
        { error: false, options: [2], value: 2 },
      ]]);
    });
  });
});
