import { createEffect, createSignal, Component, Show, For } from "solid-js"
import { createStore } from "solid-js/store"
import { createGrid } from "../components/grid"

type CellType = -1 | 0 | 1;
type Cell = {
  x: number,
  y: number,
  type: CellType
}

export default function () {
  const { SvgGrid, GridItem } = createGrid();
  // Temporary starting configuration.
  // 0 = unoccupied, 1 = Toad, -1 = Frog.
  // (This also makes sense from a CGT standpoint, since
  //  bLue/Left games are positive and Red/Right games are negative!)

  const cols = 5;
  const rows = 3;
  const starting: CellType[] =
    [1, 1, 0, -1, -1,
      1, 0, 0, 0, -1,
      0, 1, 0, -1, 0];

  const [state, setState] = createStore<{ cells: Cell[] }>({
    cells: starting.map(
      (type, i) => (
        {
          x: i % cols,
          y: Math.floor(i / cols),
          type
        })
    )
  });

  function getCell(x, y) {
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      return state.cells[x + y * cols];
    }
  }

  function setCellType(x, y, type) {
    setState('cells', x + y * cols, 'type', type)
  }

  function swapCells(cell1, cell2) {
    const type1 = cell1.type;
    const type2 = cell2.type;
    setCellType(cell1.x, cell1.y, type2);
    setCellType(cell2.x, cell2.y, type1);
  }

  function squareClicked(index) {
    const { x, y, type } = state.cells[index];

    if (type !== 0) {
      const self = getCell(x, y);
      const neighbor = getCell(x + type, y);
      const neighbor2 = getCell(x + 2 * type, y);

      if (neighbor?.type === 0) {
        //Move to unoccupied space.
        swapCells(self, neighbor);

      } else if (neighbor?.type === -type && neighbor2?.type === 0) {
        //Jump over opponent's piece into unoccupied space.
        swapCells(self, neighbor2);
      }
    }
  }

  const cellText = (type: CellType) => type && (type > 0 ? "Toad" : "Frog");

  return <div class="w-full max-w-screen-md">
    <SvgGrid rows={rows} cols={cols} gridLines={true}>
      <For each={state.cells}>
        {(cell, i) => <GridItem onClick={() => squareClicked(i())} x={cell.x} y={cell.y} text={cellText(cell.type)}></GridItem>}
      </For>
    </SvgGrid>

  </div>
}