/* eslint-disable no-param-reassign */
import { AREAS_COUNT, SQUARE_ROWS, SQUARE_COLUMNS } from './SudokuConfig';
import { SudokuBoard, SudokuValue, SudokuCell } from './SudokuTypes';

export function markErrors(board: SudokuBoard): boolean {
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
      cell.options = cell.value ? [cell.value] : Array(AREAS_COUNT).fill(1)
        .map((_, index) => (index + 1) as SudokuValue);
    });
  });
}

export function resetErrors(board: SudokuBoard): void {
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
  return area.some((cell) => {
    if (notToRemoveCells.includes(cell)) {
      return false;
    }
    const beforeLength = cell.options.length;
    cell.options = cell.options.filter((option) => !optionsToRemove.includes(option));
    return cell.options.length !== beforeLength;
  });
}

export function getSameCells(
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
    for (let requestedSameCount = 1; requestedSameCount < (AREAS_COUNT - 1); requestedSameCount++) {
      const relevantCells = area.filter((cell) => cell.options.length <= requestedSameCount)
        .slice(0, AREAS_COUNT - (requestedSameCount - 1));
      isChanged ||= relevantCells.some((cell) => {
        const matchCells = getSameCells(
          relevantCells.slice(relevantCells.indexOf(cell) + 1),
          requestedSameCount,
          [cell],
        );
        if (matchCells) {
          return removeOptions(area, matchCells, matchCells.flatMap((x) => x.options));
        }
        return false;
      });
    }
  });
  return isChanged;
}

export function getAllAreas(board: SudokuBoard) {
  const rows: SudokuBoard = JSON.parse(JSON.stringify(board));
  const columns = rows.map((row, rIndex) => row.map((_, cIndex) => rows[cIndex][rIndex]));
  const squares = rows.map(
    (row, rIndex) => row.map(
      (_, cIndex) => rows[
        Math.floor(rIndex / SQUARE_ROWS) * SQUARE_ROWS + Math.floor(cIndex / SQUARE_COLUMNS)
      ][
        (rIndex % SQUARE_ROWS) * SQUARE_ROWS + (cIndex % SQUARE_COLUMNS)
      ],
    ),
  );

  return { rows, columns, squares };
}

export function findSingleInArea(board: SudokuBoard) {
  let isChanged = false;
  for (const area of board) {
    for (let number = 0; number < AREAS_COUNT; number++) {
      const cellsWithNumber = area
        .filter((cell) => cell.options.some((option) => option === number));
      if ((cellsWithNumber.length === 1) && (cellsWithNumber[0].options.length > 1)) {
        isChanged = true;
        cellsWithNumber[0].options = cellsWithNumber[0].options.filter((x) => x === number);
      }
    }
  }

  return isChanged;
}

export function solveSudoku(board: SudokuBoard): SudokuBoard {
  const { columns, squares, rows } = getAllAreas(board);
  resetOptions(rows);

  let isError = false;
  let isChanged = false;

  do {
    isChanged = false;
    isError ||= markErrors(rows);
    isError ||= markErrors(columns);
    isError ||= markErrors(squares);
    if (!isError) {
      isChanged ||= calcOptions(rows);
      isChanged ||= calcOptions(columns);
      isChanged ||= calcOptions(squares);
      isChanged ||= findSingleInArea(rows);
      isChanged ||= findSingleInArea(columns);
      isChanged ||= findSingleInArea(squares);
    }
  } while (isChanged && !isError);
  setValues(rows);
  return rows;
}
