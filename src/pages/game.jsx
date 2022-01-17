import { createEffect, createSignal } from "solid-js"
import { createStore } from "solid-js/store"

const columns = 5;
const rows = 3;
const cellWidth = 100;
const cellHeight = 100;
const width = columns * cellWidth;
const height = rows * cellHeight;

function GridItem (props) {

  const style = () => ({
    left: `${props.x * cellWidth}px`,
    top: `${50 + props.y * cellHeight}px`,
    width: `${cellWidth}px`,
    height: `${cellHeight}px`,
  })


  return <div onClick={props.onClick} class="absolute border border-black" style={style()}>
    <Show when={props.type}>
      <div> {props.type === 1 ? 'T' : 'F'}</div>
    </Show>
  </div>
}

// GENERAL GAME RULES
// ==================
// bLue moves Toads (left to right), red moves Frogs (right to left).
// If bLue clicks a Toad, they can:
//    Move ONE space to the right
//    Jump TWO spaces to the right if they're jumping over a Frog (Frog is not removed)
// (Target square must be empty.)
// Red's moves for Frogs are the reverse.
// Players take turns until someone can't make a move.


// Temporary starting configuration.
// 0 = unoccupied, 1 = Toad, -1 = Frog.
// (This also makes sense from a CGT standpoint, since
//  bLue/Left games are positive and Red/Right games are negative!)
const starting = [ 1, 1, 0,-1,-1,
                   1, 0, 0, 0,-1,
                   0, 1, 0,-1, 0];

export default function Game() {
    const [state, setState] = createStore({cells: starting.map(
      (type, i) => (
        { 
          x: i % columns, 
          y: Math.floor(i / columns), 
          type 
        })
    )});

    function getCell(x, y) {
      if (x >= 0 && x < columns && y >= 0 && y < rows) {
        return state.cells[x + y * columns];
      }
    }

    function setCellType(x, y, type) {
      setState('cells', x + y * columns, 'type', type)
    }

    function swapCells(cell1, cell2) {
      const type1 = cell1.type;
      const type2 = cell2.type;
      setCellType(cell1.x, cell1.y, type2);
      setCellType(cell2.x, cell2.y, type1);
    }
  
    createEffect( () => {
      console.log(state.cells)
    })
    
    function squareClicked(index) {
      const { x, y, type } = state.cells[index];
      console.log(x, y, type);

      if (type !== 0) {
        const self      = getCell(x,            y);
        const neighbor  = getCell(x + type,     y);
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

//   const [xPos, setX] = createSignal(0);
//   const [yPos, setY] = createSignal(0);

//   function move(deltaX, deltaY) {
//     if (xPos() + deltaX < 0 || xPos() + deltaX > columns - 1) {
//       return;
//     }
//     if (yPos() + deltaY < 0 || yPos() + deltaY > rows - 1) {
//       return;
//     } 

//     setX(xPos() + deltaX);
//     setY(yPos() + deltaY);
//   } 
  
//   const buttons = [
//    {text: 'Left', action: () => move(-1, 0)},
//    {text: 'Down', action: () => move(0, 1)},
//    {text: 'Up', action: () => move(0, -1)},
//    {text: 'Right', action: () => move(1, 0)},
//  ]

  const style = () => ({
    width: width + "px",
    height: height + "px",
  })

  return <div>

    {/* <div class="flex gap-2">
      <For each={buttons}>
        {(button)=> <button onClick={button.action}> {button.text} </button>}
      </For>
    </div> */} 

    <div style={style()}>
      {/* <For each={state.cells} fallback={<div></div>}> 
        { (cell, index) => (<GridItem x={cell.x} y={cell.y}></GridItem>)}
      </For> */}
      {state.cells.map((cell, i) => 
        <GridItem 
          x={cell.x} y={cell.y} type={cell.type} 
          onClick={
            () => {squareClicked(i)}
          }>
        </GridItem>)}
    </div>


  </div>
}