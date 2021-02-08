import { GameGeometry } from "../typings/game_geometry";
import MathUtils from "./math_util";
import TouchableArea from "./touchable_area";
import Vector2 from "./vector2";

interface ISwipeConfig {
  distance: number;
  angelRangeInDegree: [number, number];
  mode: "instantaneous" | "end"; // 瞬时触发还是结束触发
}

export interface GesturesAreaSwipeEvent {
  distance: number;
  speed_ms: number;
  duration_ms: number;
  startPoint: Vector2;
  endPoint: Vector2;
}

interface GesturesAreaEventMap {
  swipeout: GesturesAreaSwipeEvent;
}

interface GesturesAreaListenerMap {
  swipeout: (ev: GesturesAreaSwipeEvent) => void;
}

export default class GesturesArea extends TouchableArea {
  private _geslisteners: Map<
    keyof GesturesAreaListenerMap,
    Set<GesturesAreaListenerMap[keyof GesturesAreaListenerMap]>
  > = new Map();

  private _swipe_config: ISwipeConfig;
  constructor(vertexes: GameGeometry.IVector2[], config: ISwipeConfig) {
    super(vertexes);
    this._swipe_config = config;
    this.ontouchstart = this.ontouchstart.bind(this);
    this.ontouchmove = this.ontouchmove.bind(this);
    this.ontouchend = this.ontouchend.bind(this);
  }

  public addGestureEventListeners<K extends keyof GesturesAreaEventMap>(
    event: K,
    listener: (ev: GesturesAreaEventMap[K]) => any
  ): void {
    const his = this._geslisteners.get(event) || new Set();
    his.add(listener);
    this._geslisteners.set(event, his);
  }

  public removeGestureEventListeners<K extends keyof GesturesAreaEventMap>(
    event: K,
    listener: (ev: GesturesAreaEventMap[K]) => any
  ) {
    const his = this._geslisteners.get(event) || new Set();
    his.delete(listener);
    this._geslisteners.set(event, his);
  }

  protected touched_start_move_in: boolean = false;
  protected touched_start_ms: number;
  protected touched_move_trigged: boolean = false;

  private emitSwipeEvent(event: GesturesAreaSwipeEvent) {
    const listeners = this._geslisteners.get("swipeout");
    if (listeners) {
      listeners.forEach((handler) => {
        handler(event);
      });
    }
  }

  private detectSwipe(
    x: number,
    y: number,
    start_point: GameGeometry.IVector2,
    end_point: GameGeometry.IVector2
  ): boolean {
    const vector2 = new Vector2().subVectors(
      new Vector2(x, y),
      new Vector2(start_point[0], start_point[1])
    );
    const distance = vector2.length();
    if (distance > this._swipe_config.distance) {
      const angel = Math.atan(Math.abs(vector2.y / vector2.x));
      let angelDeg = MathUtils.radToDeg(angel);

      if (vector2.x < 0 && vector2.y >= 0) {
        angelDeg += 90;
      } else if (vector2.x < 0 && vector2.y < 0) {
        angelDeg += 180;
      } else if (vector2.x >= 0 && vector2.y < 0) {
        angelDeg += 270;
      }
      if (
        angelDeg >= this._swipe_config.angelRangeInDegree[0] &&
        angelDeg <= this._swipe_config.angelRangeInDegree[1]
      ) {
        const dura = new Date().getTime() - this.touched_start_ms;
        this.emitSwipeEvent({
          distance,
          duration_ms: dura,
          speed_ms: distance / dura,
          startPoint: new Vector2(start_point[0], start_point[1]),
          endPoint: new Vector2(end_point[0], end_point[1]),
        });
        return true;
      }
    }
    return false;
  }

  public ontouchstart(ev: TouchEvent) {
    super.ontouchstart(ev);
    const x = ev.touches[0].pageX;
    const y = ev.touches[0].pageY;
    if (this.contain_point([x, y])) {
      this.touched_start_move_in = true;
      this.touched_start_ms = new Date().getTime();
    }
  }

  public ontouchmove = (ev: TouchEvent) => {
    super.ontouchmove(ev);
    const x = ev.touches[0].pageX;
    const y = ev.touches[0].pageY;
    if (this._swipe_config.mode === "instantaneous") {
      if (this.touched_start_move_in && !this.touched_move_trigged) {
        this.touched_move_trigged = this.detectSwipe(
          x,
          y,
          this.touched_start_point,
          [x, y]
        );
      }
    }
  };

  public ontouchend(ev: TouchEvent) {
    const last_point = this.touched_last_point;
    const start_point = this.touched_start_point;
    super.ontouchend(ev);
    // console.log(last_point, start_point, "touched_last_point");
    const x = last_point[0];
    const y = last_point[1];
    if (this._swipe_config.mode === "end") {
      if (this.touched_start_move_in) {
        this.detectSwipe(x, y, start_point, last_point);
      }
    }
    this.touched_start_move_in = false;
    this.touched_start_ms = null;
    this.touched_move_trigged = false
  }
}
