import { GameGeometry } from "../typings/game_geometry";
import Polygon from "./polygon";

export enum TouchableAreaEvents {
  "click" = "click",
  "movein" = "movein",
  "moveout" = "moveout",
}
export default class TouchableArea {
  public polygon: Polygon;

  protected listeners: Map<TouchableAreaEvents, Set<() => void>> = new Map();

  constructor(vertexes: GameGeometry.IVector2[]) {
    this.polygon = new Polygon(vertexes);
    this.ontouchstart = this.ontouchstart.bind(this);
    this.ontouchmove = this.ontouchmove.bind(this);
    this.ontouchend = this.ontouchend.bind(this);
  }

  public addEventListeners(event: TouchableAreaEvents, handler: () => void) {
    const his = this.listeners.get(event) || new Set();
    his.add(handler);
    this.listeners.set(event, his);
  }

  public removeEventListeners(event: TouchableAreaEvents, handler: () => void) {
    const his = this.listeners.get(event) || new Set();
    his.delete(handler);
    this.listeners.set(event, his);
  }

  protected touched_start_point: GameGeometry.IVector2;
  protected touched_last_point: GameGeometry.IVector2;
  protected touched_move_in: boolean = false;

  public ontouchstart(ev: TouchEvent) {
    const x = ev.touches[0].pageX;
    const y = ev.touches[0].pageY;
    this.touched_start_point = [x, y];
    this.touched_last_point = [x, y];
  }

  public contain_point(pt: GameGeometry.IVector2) {
    return this.polygon.containPoint(pt);
  }

  public ontouchmove(ev: TouchEvent) {
    const x = ev.touches[0].pageX;
    const y = ev.touches[0].pageY;
    if (!this.touched_move_in) {
      if (this.polygon.containPoint([x, y])) {
        this.touched_move_in = true;
        const lises = this.listeners.get(TouchableAreaEvents.movein);
        if (lises) {
          lises.forEach((handler) => {
            handler();
          });
        }
      }
    } else {
      if (!this.polygon.containPoint([x, y])) {
        this.touched_move_in = false;
        const lises = this.listeners.get(TouchableAreaEvents.moveout);
        if (lises) {
          lises.forEach((handler) => {
            handler();
          });
        }
      }
    }
    this.touched_last_point = [x, y];
  }

  public ontouchend(_: TouchEvent) {
    const startIn = this.polygon.containPoint(this.touched_start_point);
    if (startIn) {
      const x = this.touched_last_point[0];
      const y = this.touched_last_point[1];
      if (this.polygon.containPoint([x, y])) {
        const lises = this.listeners.get(TouchableAreaEvents.click);
        if (lises) {
          lises.forEach((handler) => {
            handler();
          });
        }
      }
    }
    this.touched_start_point = undefined;
    this.touched_last_point = undefined;
    this.touched_move_in = false;
  }
}

export class RectTouchableArea extends TouchableArea {
  constructor(x: number, y: number, width: number, height: number) {
    super([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ]);
  }
}
