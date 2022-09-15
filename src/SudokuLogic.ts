/* eslint-disable no-param-reassign */
import {
  SudokuBoard, SudokuValue, SudokuCell, SudokuConfig, ISudokuLogic, AllAreas,
} from './SudokuTypes';

export default function SudokuLogic(config: SudokuConfig): ISudokuLogic {
  function markErrors(board: SudokuBoard): boolean {
    let isError = false;
    board.forEach((row) => {
      row.forEach((cell, index) => {
        const isDuplicate = cell.value != null
          && row.some((c, cIndex) => c.value === cell.value && cIndex !== index);
        cell.error ||= isDuplicate;
        isError ||= isDuplicate;
      });
    });
    return isError;
  }

  function resetOptions(board: SudokuBoard): void {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.options = cell.value ? [cell.value] : Array(config.areasCount).fill(1)
          .map((_, index) => (index + 1) as SudokuValue);
      });
    });
  }

  function resetErrors(board: SudokuBoard): void {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.error = false;
      });
    });
  }

  function removeOptions(
    area: SudokuCell[],
    notToRemoveCells: SudokuCell[],
    optionsToRemove: number[],
  ): boolean {
    const results = area.map((cell) => {
      if (notToRemoveCells.includes(cell)) {
        return false;
      }
      const beforeLength = cell.options.length;
      cell.options = cell.options.filter((option) => !optionsToRemove.includes(option));
      return cell.options.length !== beforeLength;
    });

    return results.some((r) => r);
  }

  function getSameCells(
    relevantCells: SudokuCell[],
    requestedSameCount: number,
    matchCells: SudokuCell[],
  ): SudokuCell[] | undefined {
    if (relevantCells.length + matchCells.length < requestedSameCount) {
      return undefined;
    }

    if (matchCells.length === requestedSameCount) {
      return matchCells;
    }

    const sameNumbers = matchCells.flatMap((x) => x.options);
    for (const cell of relevantCells) {
      const newSameNumbers = new Set(sameNumbers.concat(cell.options));
      if (newSameNumbers.size <= requestedSameCount) {
        const newMatch = getSameCells(
          relevantCells.slice(relevantCells.indexOf(cell) + 1),
          requestedSameCount,
          matchCells.concat(cell),
        );
        if (newMatch?.length === requestedSameCount) {
          return newMatch;
        }
      }
    }
    return undefined;
  }

  function setValues(board: SudokuBoard) {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.value = cell.options.length === 1 ? cell.options[0] : undefined;
      });
    });
  }

  function calcOptions(board: SudokuBoard): boolean {
    let isChanged = false;

    board.forEach((area) => {
      for (let requestedSameCount = 1;
        requestedSameCount < config.areasCount;
        requestedSameCount++) {
        const relevantCells = area.filter((cell) => cell.options.length <= requestedSameCount);
        isChanged = relevantCells.some((cell) => {
          const matchCells = getSameCells(
            relevantCells.slice(relevantCells.indexOf(cell) + 1),
            requestedSameCount,
            [cell],
          );
          if (matchCells) {
            return removeOptions(area, matchCells, matchCells.flatMap((x) => x.options));
          }
          return false;
        }) || isChanged;
      }
    });
    return isChanged;
  }

  function getAllAreas(board: SudokuBoard): AllAreas {
    const rows: SudokuBoard = JSON.parse(JSON.stringify(board));
    const columns = rows.map((row, rIndex) => row.map((_, cIndex) => rows[cIndex][rIndex]));
    const squares = rows.map(
      (row, rIndex) => row.map(
        (_, cIndex) => rows[
          Math.floor(rIndex / config.squareRows) * config.squareRows
           + Math.floor(cIndex / config.squareColumns)
        ][
          (rIndex % config.squareRows) * config.squareColumns + (cIndex % config.squareColumns)
        ],
      ),
    );

    const horizontalSquares = rows.map(
      (row, rIndex) => row.map(
        (_, cIndex) => rows[
          (rIndex % config.squareRows) * config.squareColumns + (cIndex % config.squareColumns)
        ][
          Math.floor(rIndex / config.squareRows) * config.squareRows
           + Math.floor(cIndex / config.squareColumns)
        ],
      ),
    );

    return {
      rows, columns, squares, horizontalSquares,
    };
  }

  function solveSudoku(board: SudokuBoard): SudokuBoard {
    const { columns, squares, rows } = getAllAreas(board);
    resetOptions(rows);

    let isError = false;
    let isChanged = false;

    do {
      isChanged = false;
      isError = markErrors(rows) || isError;
      isError = markErrors(columns) || isError;
      isError = markErrors(squares) || isError;
      if (!isError) {
        isChanged = calcOptions(rows) || isChanged;
        isChanged = calcOptions(columns) || isChanged;
        isChanged = calcOptions(squares) || isChanged;
      }
    } while (isChanged && !isError);
    setValues(rows);
    return rows;
  }

  function createDefaultBoard(): SudokuBoard {
    return Array(config.areasCount).fill(1).map(() => Array(config.areasCount).fill(1).map(() => ({
      options: Array(config.areasCount).fill(1).map((_, index) => (index + 1) as SudokuValue),
      error: false,
    })));
  }

  return {
    createDefaultBoard,
    calcOptions,
    markErrors,
    resetErrors,
    getSameCells,
    getAllAreas,
    solveSudoku,
  };
}
