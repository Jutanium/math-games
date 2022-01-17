import type { Component } from 'solid-js';

export const Grid: Component<{rows: number, columns: number}> = (props) => {

  //https://windicss.org/utilities/layout/grid.html#grid-1
  
  const style = () => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gridTemplateRows: `repeat(${props.rows}, 1fr)`,
  })

  return <div class={`w-full h-full`} style={style()}>
    {props.children}
  </div>
}

export const GridItem: Component<{row: number, column: number}> = (props) => {

  return <div class={`row-start-${props.row} col-start-${props.column}`}>
    {props.children}
  </div>
}