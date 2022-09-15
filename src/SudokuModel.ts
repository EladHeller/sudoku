import { BehaviorSubject } from 'rxjs';
import { ISudokuLogic, ISudokuModel, SudokuBoard } from './SudokuTypes';

export default function SudokuModel(logic: ISudokuLogic): ISudokuModel {
  const boardSubject = new BehaviorSubject<SudokuBoard>(logic.createDefaultBoard());
  function reset() {
    boardSubject.next(logic.createDefaultBoard());
  }

  function calc(board: SudokuBoard) {
    boardSubject.next(logic.solveSudoku(board));
  }

  function setBoard(board: SudokuBoard) {
    const { columns, squares, rows } = logic.getAllAreas(board);
    logic.resetErrors(columns);
    [columns, squares, rows].forEach(logic.markErrors);
    boardSubject.next(rows);
  }

  return {
    board$: boardSubject.asObservable(),
    setBoard,
    reset,
    calc,
  };
}
