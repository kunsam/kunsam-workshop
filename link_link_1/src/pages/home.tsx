import React, { useState } from "react";
import Vector2 from "../core/vector2";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function degToRad(degrees: number) {
  return degrees * DEG2RAD;
}
function radToDeg(radians: number) {
  return radians * RAD2DEG;
}
function equalZero(n: number, p: number = 0.00001) {
  return Math.abs(n - 0) < p;
}

type IPosition = [number, number];

function IPositionEqual(p1: IPosition, p2: IPosition) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

class LinkPath {
  nodes: IPosition[] = [];
  insert(node: IPosition) {
    this.nodes.push(node);
  }
  lastNode() {
    return this.nodes[this.nodes.length - 1];
  }
  isVisited(node: IPosition) {
    return !!this.nodes.find((n) => IPositionEqual(n, node));
  }
  clone() {
    const linkp = new LinkPath();
    linkp.nodes = [...this.nodes];
    return linkp;
  }
  lineSegments(): [IPosition, IPosition][] {
    if (this.nodes.length < 2) {
      return [];
    }
    if (this.nodes.length === 2) {
      const p1 = this.nodes[0];
      const p2 = this.nodes[1];
      return [[p1, p2]];
    }
    const linesegs = [];
    const normallize = (pos: IPosition): IPosition => {
      const length = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
      return [pos[0] / length, pos[1] / length];
    };

    let startPoint = this.nodes[0];
    for (let i = 1; i < this.nodes.length - 1; i++) {
      const line1 = [startPoint, this.nodes[i]];
      const line2 = [this.nodes[i], this.nodes[i + 1]];
      const line1Dir = normallize([
        this.nodes[i][0] - startPoint[0],
        this.nodes[i][1] - startPoint[1],
      ]);
      const line2Dir = normallize([
        this.nodes[i + 1][0] - this.nodes[i][0],
        this.nodes[i + 1][1] - this.nodes[i][1],
      ]);
      if (!IPositionEqual(line1Dir, line2Dir)) {
        linesegs.push(line1);
        linesegs.push(line2);
        startPoint = this.nodes[i + 1];
      } else if (i === this.nodes.length - 2) {
        linesegs.push([startPoint, this.nodes[this.nodes.length - 1]]);
      }
    }

    return linesegs;
  }
}

class LinkNode {
  id: string;
  position: IPosition;
  state: {
    isOnEdge: boolean; // 是否在外圈
    eliminated: boolean;
  };
  data: {
    fillValue?: any;
    filledLinkedNodeId?: string; // 填充链接点
    eliminatedLinkedNodeId?: string; // 消除链接点
  };

  constructor({
    id,
    position,
    isOnEdge,
  }: {
    id: string;
    position: IPosition;
    isOnEdge: boolean;
  }) {
    this.id = id;
    this.position = position;
    this.state = {
      isOnEdge,
      eliminated: false,
    };
    this.data = {
      fillValue: undefined,
    };
  }
}

// 允许外圈的模式
class GameMap {
  size: [number, number];
  // 棋盘
  array: LinkNode[][];
  eliminatedArray: IPosition[];

  constructor(size: [number, number]) {
    this.array = new Array(size[0]).fill(null).map((_) => new Array(size[1]));
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        const position: IPosition = [i, j];
        this.array[i][j] = new LinkNode({
          id: this._pos2Id(position),
          position,
          isOnEdge:
            i === 0 || i === size[0] - 1 || j === 0 || j === size[1] - 1,
        });
      }
    }
    this.size = size;
    this.eliminatedArray = [];
  }

  private _pos2Id(pos: [number, number]) {
    return `${pos[0]}${pos[1]}`;
  }

  getNodeByPosition(pos: IPosition) {
    const row = this.array[pos[0]];
    if (row) {
      return row[pos[1]];
    }
    return undefined;
  }

  traverse(callBack: (node: LinkNode) => void) {
    this.array.forEach((a) => {
      a.forEach((aa) => {
        callBack(aa);
      });
    });
  }

  dump() {
    return JSON.stringify(this.array, null, 2);
  }

  isPositionOutside(pos: IPosition) {
    if (pos[0] < 0 || pos[0] >= this.size[0]) {
      return true;
    }
    if (pos[1] < 0 || pos[1] >= this.size[1]) {
      return true;
    }
    return false;
  }

  eliminate(position: IPosition, linkNode?: LinkNode) {
    const node = this.getNodeByPosition(position);
    node.state.eliminated = true;
    if (linkNode) {
      node.data.eliminatedLinkedNodeId = linkNode.id;
    }
    this.eliminatedArray.push(node.position);
  }

  fill(position: IPosition, fillValue: any, linkNode: LinkNode) {
    const node = this.getNodeByPosition(position);
    node.state.eliminated = false;
    node.data.fillValue = fillValue;
    node.data.filledLinkedNodeId = linkNode.id;
    this.eliminatedArray = this.eliminatedArray.filter(
      (e) => !IPositionEqual(e, position)
    );
  }

  getLinkPositions(from: IPosition) {
    const linkPostions: IPosition[] = [];
    this.eliminatedArray.forEach((pos) => {
      if (IPositionEqual(from, pos)) {
        return;
      }
      const paths = this.findLinkPath2(from, pos);
      if (paths.length) {
        linkPostions.push(pos);
      }
    });
    return linkPostions;
  }

  // 这个算法太过随机，复杂度过高，要用优化的算法
  // 直接构造符合要求的连接

  findLinkPath2(from: IPosition, to: IPosition): IPosition[][] {
    if (IPositionEqual(from, to)) {
      return [];
    }

    const fromV2 = new Vector2(from[0], from[1]);
    const toV2 = new Vector2(to[0], to[1]);
    const dir = new Vector2().subVectors(toV2, fromV2);
    if (dir.length() <= 1) {
      return [[from, to]];
    }
    const isPerpLine = equalZero(dir.x) || equalZero(dir.y);
    let connectPaths: IPosition[][] = [];
    if (isPerpLine) {
      // 直连路径
      const pathd: IPosition[] = [];
      for (let step = 1; step < dir.length(); step++) {
        const deltav = equalZero(dir.x)
          ? new Vector2(0, Math.sign(dir.y) * step)
          : new Vector2(Math.sign(dir.x) * step, 0);
        const pt = fromV2.clone().add(deltav);
        pathd.push([pt.x, pt.y]);
      }
      connectPaths.push(pathd);
      // 旋转1
      const p1 = dir
        .clone()
        .normalize()
        .rotateAround(new Vector2(), degToRad(90));
      p1.setX(equalZero(p1.x) ? 0 : p1.x);
      p1.setY(equalZero(p1.y) ? 0 : p1.y);
      p1.add(fromV2);
      const path1: IPosition[] = [];
      path1.push([p1.x, p1.y]);
      for (let step = 1; step <= dir.length(); step++) {
        const deltav = equalZero(dir.x)
          ? new Vector2(0, Math.sign(dir.y) * step)
          : new Vector2(Math.sign(dir.x) * step, 0);
        const pt = p1.clone().add(deltav);
        path1.push([pt.x, pt.y]);
      }
      connectPaths.push(path1);
      // 旋转2
      const p2 = dir
        .clone()
        .normalize()
        .rotateAround(new Vector2(), degToRad(-90));
      p2.setX(equalZero(p2.x) ? 0 : p2.x);
      p2.setY(equalZero(p2.y) ? 0 : p2.y);
      p2.add(fromV2);
      const path2: IPosition[] = [];
      path2.push([p2.x, p2.y]);
      if (dir.length() > 1) {
        for (let step = 1; step <= dir.length(); step++) {
          const deltav = equalZero(dir.x)
            ? new Vector2(0, Math.sign(dir.y) * step)
            : new Vector2(Math.sign(dir.x) * step, 0);
          const pt = p2.clone().add(deltav);
          path2.push([pt.x, pt.y]);
        }
      }
      connectPaths.push(path2);
    } else {
      const xVector = new Vector2(dir.x, 0);
      const yVector = new Vector2(0, dir.y);

      // 构造路径1
      const p1 = fromV2.clone().add(xVector);
      const path1: IPosition[] = [];
      path1.push([p1.x, p1.y]);
      if (xVector.length() > 1) {
        for (let step = 1; step < xVector.length(); step++) {
          const pt = fromV2
            .clone()
            .add(new Vector2(Math.sign(dir.x) * step, 0));
          path1.push([pt.x, pt.y]);
        }
      }
      if (yVector.length() > 1) {
        for (let step = 1; step < yVector.length(); step++) {
          const pt = p1.clone().add(new Vector2(0, Math.sign(dir.y) * step));
          path1.push([pt.x, pt.y]);
        }
      }

      connectPaths.push(path1);

      // 构造路径2
      const p2 = fromV2.clone().add(yVector);
      const path2: IPosition[] = [];
      path2.push([p2.x, p2.y]);
      if (yVector.length() > 1) {
        for (let step = 1; step < yVector.length(); step++) {
          const pt = fromV2
            .clone()
            .add(new Vector2(0, Math.sign(dir.y) * step));
          path2.push([pt.x, pt.y]);
        }
      }
      if (xVector.length() > 1) {
        for (let step = 1; step < xVector.length(); step++) {
          const pt = p2.clone().add(new Vector2(Math.sign(dir.x) * step, 0));
          path2.push([pt.x, pt.y]);
        }
      }

      connectPaths.push(path2);

      if (Math.abs(dir.x) > 1 && Math.abs(dir.y) > 1) {
        // x方向
        if (Math.abs(dir.x) > 1) {
          for (let i = 1; i < Math.abs(dir.x); i++) {
            // 在i列换行
            const pathx: IPosition[] = [];
            for (let step = 1; step < i; step++) {
              const pt = fromV2
                .clone()
                .add(new Vector2(Math.sign(dir.x) * step, 0));
              pathx.push([pt.x, pt.y]);
            }
            // 换行列
            for (let step = 0; step <= Math.abs(dir.y); step++) {
              const pt = fromV2
                .clone()
                .add(new Vector2(Math.sign(dir.x) * i, 0))
                .add(new Vector2(0, Math.sign(dir.y) * step));
              pathx.push([pt.x, pt.y]);
            }
            for (let step = i + 1; step < Math.abs(dir.x); step++) {
              const newRowPt = fromV2.clone().add(new Vector2(0, dir.y));
              const pt = newRowPt
                .clone()
                .add(new Vector2(Math.sign(dir.x) * step, 0));
              pathx.push([pt.x, pt.y]);
            }
            connectPaths.push(pathx);
          }
        }
        // y方向
        if (Math.abs(dir.y) > 1) {
          for (let i = 1; i < Math.abs(dir.y); i++) {
            const pathy: IPosition[] = [];
            // 在i行换列
            for (let step = 1; step < i; step++) {
              const pt = fromV2
                .clone()
                .add(new Vector2(0, Math.sign(dir.y) * step));
              pathy.push([pt.x, pt.y]);
            }
            // 换列行
            for (let step = 0; step <= Math.abs(dir.x); step++) {
              const pt = fromV2
                .clone()
                .add(new Vector2(0, Math.sign(dir.y) * i))
                .add(new Vector2(Math.sign(dir.x) * step, 0));
              pathy.push([pt.x, pt.y]);
            }

            for (let step = i + 1; step < Math.abs(dir.y); step++) {
              const newRowPt = fromV2.clone().add(new Vector2(dir.x, 0));
              const pt = newRowPt
                .clone()
                .add(new Vector2(0, Math.sign(dir.y) * step));
              pathy.push([pt.x, pt.y]);
            }
            connectPaths.push(pathy);
          }
        }
      }
    }

    // console.log(connectPaths, "connectPaths");
    const validPaths = connectPaths.filter((paths) => {
      let isAllValid = true;
      paths.forEach((pos) => {
        const node = this.getNodeByPosition(pos);
        isAllValid =
          isAllValid &&
          node &&
          (node.state.eliminated === true || node.state.isOnEdge);
      });
      return isAllValid;
    });

    return validPaths;
  }

  // find 过程就判定节点小于等于3
  findLinkPath(
    from: IPosition,
    to: IPosition,
    isValid: (
      from: IPosition,
      to: IPosition,
      nextPostition: IPosition
    ) => boolean
  ): LinkPath[] {
    if (IPositionEqual(from, to)) {
      return [];
    }
    const allLinkPaths: LinkPath[] = [];
    let pendingLinkPaths: LinkPath[] = [];
    const linkPath = new LinkPath();
    linkPath.insert(from);
    pendingLinkPaths.push(linkPath);

    // 寻找路径
    while (pendingLinkPaths.length) {
      const nextPendingLinkPaths: LinkPath[] = [];
      pendingLinkPaths.forEach((linkPath) => {
        const lineSegs = linkPath.lineSegments().length;
        // 已寻找路径
        if (lineSegs > 3) {
          return;
        }
        const directions = [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ];
        directions.forEach((dir) => {
          const frompos = linkPath.lastNode();
          const nextPostition: IPosition = [
            frompos[0] + dir[0],
            frompos[1] + dir[1],
          ];

          if (this.isPositionOutside(nextPostition)) {
            return;
          }
          if (IPositionEqual(nextPostition, to)) {
            const newLinkPath = linkPath.clone();
            newLinkPath.insert(nextPostition);
            allLinkPaths.push(newLinkPath);
          } else {
            const node = this.getNodeByPosition(nextPostition);
            if (node.state.eliminated === false && !node.state.isOnEdge) {
              return;
            }
            if (
              isValid(from, to, nextPostition) &&
              !IPositionEqual(from, nextPostition)
            ) {
              if (!linkPath.isVisited(nextPostition)) {
                const newLinkPath = linkPath.clone();
                newLinkPath.insert(nextPostition);
                nextPendingLinkPaths.push(newLinkPath);
              }
            }
          }
        });
      });
      pendingLinkPaths = nextPendingLinkPaths;
    }
    return allLinkPaths;
  }

  clone() {
    const gameMap = new GameMap(this.size);
    this.array = [...this.array];
    gameMap.eliminatedArray = [...this.eliminatedArray];
    return gameMap;
  }
}

class GameMapGenerator {
  public static generateGameMap(size: [number, number]) {
    if (!size[0] || !size[1]) {
      return;
    }
    if ((size[0] * size[1]) % 2 !== 0) {
      throw Error("NOT SUPPORT SIZE");
    }
    const gameMap = new GameMap(size);
    gameMap.traverse((node) => {
      if (!node.state.isOnEdge) {
        gameMap.eliminate(node.position);
      }
    });
    let valuePairNumber = 1;
    const findPathsAndfillPair = (pair1: IPosition, pair2: IPosition) => {
      console.groupCollapsed("findPathsAndfillPair start ");
      console.log(pair1, pair2, "start ");
      const allLinkPaths = gameMap.findLinkPath2(pair1, pair2);
      console.log(allLinkPaths.length, "end");
      console.groupEnd();
      if (allLinkPaths.length) {
        gameMap.fill(pair1, valuePairNumber, gameMap.getNodeByPosition(pair2));
        gameMap.fill(pair2, valuePairNumber, gameMap.getNodeByPosition(pair1));
        valuePairNumber++;
        return true;
      }
      return false;
    };

    let maxInValidCount = 0;
    while (gameMap.eliminatedArray.length) {
      const eliminatedArray = gameMap.eliminatedArray;
      console.log(eliminatedArray.length, "fill gamemap");
      const random = getRandomIntInclusive(0, eliminatedArray.length - 1);
      const pair1 = eliminatedArray[random];
      const random2 = getRandomIntInclusive(0, eliminatedArray.length - 1);
      const pair2 = eliminatedArray[random2];
      const valid = findPathsAndfillPair(pair1, pair2);
      // 没找到解就换棋盘
      if (!valid) {
        maxInValidCount++;
        if (maxInValidCount > 20) {
          break;
        }
      }
    }
    if (gameMap.eliminatedArray.length) {
      console.log("该地图不符合要求，重新获取");
      return this.generateGameMap(size);
    }
    return gameMap;
  }
  public static generateGameMap2(size: [number, number]) {
    if (!size[0] || !size[1]) {
      return;
    }
    if ((size[0] * size[1]) % 2 !== 0) {
      throw Error("NOT SUPPORT SIZE");
    }
    const gameMap = new GameMap(size);
    gameMap.traverse((node) => {
      if (!node.state.isOnEdge) {
        gameMap.eliminate(node.position);
      }
    });
    let valuePairNumber = 1;
    // const linkableCacheMap: Map<string, IPosition[]> = new Map();
    const randomFillMap = () => {
      if (gameMap.eliminatedArray.length === 2) {
        const pos1 = gameMap.eliminatedArray[0];
        const pos2 = gameMap.eliminatedArray[1];
        const canlink = gameMap.findLinkPath2(pos1, pos2);
        console.log(pos1, canlink.length, valuePairNumber, "randomFillMap 22");
        if (canlink.length) {
          gameMap.fill(pos1, valuePairNumber, gameMap.getNodeByPosition(pos2));
          gameMap.fill(pos2, valuePairNumber, gameMap.getNodeByPosition(pos1));
          valuePairNumber++;
          return true;
        }
      }
      const random = getRandomIntInclusive(
        0,
        gameMap.eliminatedArray.length - 1
      );
      const randomPos1 = gameMap.eliminatedArray[random];
      // const posKey = `${randomPos1[0]}-${randomPos1[1]}`;
      // const cacheValue = linkableCacheMap.get(posKey);
      const allLinkPos = gameMap.getLinkPositions(randomPos1);
      // if (!cacheValue && allLinkPos.length) {
      //   linkableCacheMap.set(posKey, allLinkPos);
      // }
      let isFillRemainSuccess = false;
      console.log(
        randomPos1,
        allLinkPos.length > 0,
        valuePairNumber,
        "randomFillMap"
      );
      allLinkPos.forEach((lpos) => {
        if (isFillRemainSuccess) {
          return;
        }
        gameMap.fill(
          randomPos1,
          valuePairNumber,
          gameMap.getNodeByPosition(lpos)
        );
        gameMap.fill(
          lpos,
          valuePairNumber,
          gameMap.getNodeByPosition(randomPos1)
        );
        valuePairNumber++;
        isFillRemainSuccess = randomFillMap();
        if (!isFillRemainSuccess) {
          gameMap.eliminate(randomPos1, gameMap.getNodeByPosition(lpos));
          gameMap.eliminate(lpos, gameMap.getNodeByPosition(randomPos1));
          valuePairNumber--;
        } else {
          console.log("填充了：", randomPos1, lpos);
        }
      });
      return isFillRemainSuccess;
    };

    const success = randomFillMap();

    if (!success) {
      console.log("该地图不符合要求，重新获取");
      return this.generateGameMap(size);
    }
    return gameMap;
  }
}

let R_COUNTER = 0;
class GameMapSolver {
  public static solve(gameMap: GameMap): LinkPath[][] {
    const allLinkPaths: LinkPath[][] = [];
    this.recursiveSolve(gameMap, allLinkPaths);
    return allLinkPaths;
  }

  public static recursiveSolve(gameMap: GameMap, allLinkPaths: LinkPath[][]) {
    R_COUNTER++;
    if (R_COUNTER > 10000) {
      console.log("R_COUNTERR_COUNTER");
      return allLinkPaths;
    }
    gameMap.traverse((node) => {
      if (node.state.eliminated) {
        return;
      }
      if (node.data.fillValue === undefined) {
        return;
      }
      gameMap.traverse((anoNode) => {
        if (anoNode.state.eliminated) {
          return;
        }
        if (anoNode.data.fillValue === undefined) {
          return;
        }
        if (node.id === anoNode.id) {
          return;
        }

        if (node.data.fillValue !== anoNode.data.fillValue) {
          return;
        }
        const findPaths = gameMap.findLinkPath2(
          node.position,
          anoNode.position
        );
        if (findPaths.length) {
          gameMap.eliminate(node.position);
          gameMap.eliminate(anoNode.position);
          const findLinkpaths: LinkPath[] = [];
          findPaths.forEach((paths) => {
            const linkpath = new LinkPath();
            paths.forEach((pos) => linkpath.insert(pos));
            findLinkpaths.push(linkpath);
          });
          allLinkPaths.push(findLinkpaths);
          const cloneGameMap = gameMap.clone();
          this.recursiveSolve(cloneGameMap, allLinkPaths);
        }
      });
    });
    return allLinkPaths;
  }
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export default function Home() {
  const [gameMap, setgameMap] = useState<GameMap>(undefined);

  const [row, setrow] = useState(0);
  const [column, setcolumn] = useState(0);
  console.log(gameMap, "gameMap2222");
  React.useEffect(() => {
    if (gameMap) {
      const allPaths = GameMapSolver.solve(gameMap);
      console.log(allPaths, "allPaths");
    }
  }, [gameMap]);

  // React.useEffect(() => {
  //   const gamemaps = new Array(2)
  //     .fill(null)
  //     .map((_) => {
  //       const gamemap = GameMapGenerator.generateGameMap([8, 8]);
  //       const solutionCounter = GameMapSolver.solve(gamemap).reduce(
  //         (p, c) => p + c.length,
  //         0
  //       );
  //       return {
  //         gamemap,
  //         solutionCounter,
  //       };
  //     })
  //     .sort((a, b) => a.solutionCounter - b.solutionCounter);
  //   console.log(gamemaps, "gamemaps");
  // }, []);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <input
          placeholder="row"
          onChange={(e) =>
            e.target.value ? setrow(parseInt(e.target.value)) : setrow(0)
          }
        />
        <input
          placeholder="column"
          onChange={(e) =>
            e.target.value ? setcolumn(parseInt(e.target.value)) : setcolumn(0)
          }
        />
        <button
          onClick={() => {
            setgameMap(GameMapGenerator.generateGameMap2([row, column]));
          }}
        >
          生产
        </button>
        <button
          onClick={() => {
            const gameMap = new GameMap([8, 8]);
            const testCases: [IPosition, IPosition][] = [
              [
                [1, 1],
                [1, 1],
              ],
              [
                [1, 1],
                [1, 2],
              ],
              [
                [1, 1],
                [1, 4],
              ],
              [
                [1, 1],
                [4, 1],
              ],
              [
                [4, 1],
                [1, 1],
              ],
              [
                [1, 1],
                [2, 2],
              ],
              [
                [1, 1],
                [2, 4],
              ],
              [
                [1, 1],
                [4, 2],
              ],
              [
                [1, 1],
                [4, 5],
              ],
              [
                [1, 1],
                [5, 4],
              ],
              [
                [5, 4],
                [1, 1],
              ],
              [
                [1, 4],
                [5, 1],
              ],
            ];

            testCases.forEach((tcase: [IPosition, IPosition]) => {
              console.groupCollapsed(`${tcase[0]}-${tcase[1]}`);
              const test = gameMap.findLinkPath2(tcase[0], tcase[1]);
              console.groupEnd();
            });
          }}
        >
          测试
        </button>
      </div>

      <div>{!gameMap ? null : <GameMapUI gameMap={gameMap} />}</div>
    </div>
  );
}

const GameMapUI = React.memo(function ({ gameMap }: { gameMap: GameMap }) {
  return (
    <>
      {gameMap.array.map((row, rowI) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={rowI}
          >
            {row.map((node, nodei) => {
              return (
                <div
                  key={nodei}
                  style={{
                    display: "inline-block",
                    border: "1px solid #ccc",
                    padding: 10,
                    width: 40,
                    height: 40,
                    lineHeight: "40px",
                    textAlign: "center",
                  }}
                >
                  {node.data.fillValue}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
});
