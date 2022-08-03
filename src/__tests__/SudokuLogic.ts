import { getSameCells, markErrors } from '../SudokuLogic';
import { SudokuBoard, SudokuCell } from '../SudokuTypes';

describe('markErrors', () => {
  it('should mark errors', () => {
    const board: SudokuBoard = [[{ value: 1, options: [1] }, { value: 1, options: [1] }]];
    const result = markErrors(board);
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
    const firstCell: SudokuCell = { options: [2, 3] };
    const row: SudokuCell[] = [
      { options: [4, 5, 6] },
      { options: [2, 3] },
    ];

    const results = getSameCells(row, 2, [firstCell]);
    expect(results).toEqual([firstCell, row[1]]);
  });
});
