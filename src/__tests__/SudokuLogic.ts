import SudokuLogic from '../SudokuLogic';
import { ISudokuLogic, SudokuBoard, SudokuCell } from '../SudokuTypes';

describe('SudokuLogic', () => {
  let sudokuLogic: ISudokuLogic;

  beforeEach(() => {
    sudokuLogic = SudokuLogic({
      areasCount: 9,
      squareColumns: 3,
      squareRows: 3,
    });
  });

  describe('markErrors', () => {
    it('should mark errors', () => {
      const board: SudokuBoard = [[{
        value: 1,
        error: false,
        options: [1],
      }, {
        value: 1,
        error: false,
        options: [1],
      }]];
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
    it('should remove options if', () => {
      sudokuLogic = SudokuLogic({
        areasCount: 4,
        squareColumns: 2,
        squareRows: 2,
      });

      const board: SudokuBoard = [[
        { error: false, options: [1, 2, 3, 4] },
        { error: false, options: [1, 2, 3] },
        { error: false, options: [1, 2, 3] },
        { error: false, options: [1, 2, 3] },
      ], [
        { error: false, options: [1, 2, 3, 4] },
        { error: false, options: [1, 2] },
        { error: false, options: [2, 3] },
        { error: false, options: [1, 3] },
      ], [
        { error: false, options: [1, 2, 3, 4] },
        { error: false, options: [1, 2, 4] },
        { error: false, options: [2, 3] },
        { error: false, options: [2, 3] },
      ], [
        { error: false, options: [1, 2, 3, 4] },
        { error: false, options: [1, 2, 3, 4] },
        { error: false, options: [1, 2, 3, 4] },
        { error: false, options: [1] },
      ]];

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
});
