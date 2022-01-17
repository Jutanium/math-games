import { Component, Show, For, createContext, useContext, splitProps, mergeProps, JSX, createEffect} from 'solid-js';

type SVGEvents = Omit<JSX.DOMAttributes<SVGElement>, "children" | "innerHTML" | "textContent" | "innerText" | "ref">

export function createGrid() {

  const GridContext = createContext<{ rows: number, cols: number }>({ rows: 10, cols: 10 });

  const cellSize = 100;

  const SvgGrid: Component<{ rows: number, cols: number, gridLines?: boolean, gridColor?: string }> = (props) => {

    const vbWidth = () => props.cols * cellSize;
    const vbHeight = () => props.rows * cellSize;

    const viewBox = () => `0 0 ${vbWidth()} ${vbHeight()}`

    const colLines = () => Array.from({ length: props.cols - 1 }, (_, i) => (i + 1) * cellSize);
    const rowLines = () => Array.from({ length: props.rows - 1 }, (_, i) => (i + 1) * cellSize);

    const stroke = () => props.gridColor || '#ccc';

    const [contextData] = splitProps(props, ["rows", "cols"]);

    return (
      <GridContext.Provider value={contextData}>
        <svg class="w-full border" viewBox={viewBox()}>
          <Show when={props.gridLines}>
            <For each={colLines()}>
              {(x) => <line x1={x} y1="0" x2={x} y2={vbHeight()} stroke-width={1} stroke={stroke()} />}
            </For>
            <For each={rowLines()}>
              {(y) => <line x1={0} y1={y} x2={vbWidth()} y2={y} stroke-width={1} stroke={stroke()} />}
            </For>
          </Show>
          {props.children}
        </svg>
      </GridContext.Provider>
    )
  }

  type GridItemProps = {
      x: number, y: number, 
      width?: number, height?: number, 
      border?: boolean, text?: string,
  }


  const GridItem: Component<
     GridItemProps & SVGEvents> = (props) => {

    const contextData  = useContext(GridContext);

    props = mergeProps({width: 1, height: 1}, props);

    const width = () => props.width * cellSize;
    const height = () => props.height * cellSize;
    const clampedX = () => Math.min(Math.max(0, props.x), contextData.cols - 1) * cellSize; 
    const clampedY = () => Math.min(Math.max(0, props.y), contextData.rows - 1) * cellSize;

    const [_, events] = splitProps(props, ["x", "y", "width", "height", "border", "text"]);


    return (
      <svg x={clampedX()} y={clampedY()} 
           width={width()} height={height()}
           viewBox={`0 0 ${width()} ${height()}`}
           {...events}
           >
          {props.border && <rect stroke-width="1" stroke="black" fill="none" width={width()} height={height()} x="0" y="0"></rect>}
          {props.text && <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">{props.text}</text>}
          {props.children}
      </svg>
    )
  }

  return { SvgGrid, GridItem }
}