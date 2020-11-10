// 보드와 관련된 JavaScript

class Board {
  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }

  init() {
    // 게임 판의 높이와 너비를 지정하여 준다.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    ctx.canvas.height = ROWS * BLOCK_SIZE;

    // 블록의 크기를 변경한다.
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 새로운 게임이 시작되면 getEmptyBoard() 함수를 이용하여 초기화를 진행한다.
  reset() {
    this.grid = this.getEmptyBoard();
  }

  // 테트리스 판을 초기화하는 함수이며, 0으로 채워진 행렬을 얻는다.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  // 입력이 타당한지 안한지 판단하는 함수
  valid(p) {
    // every() 함수를 통하여 배열의 모든 요소가 조건에 만족하는지 확인할 수 있다.
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return this.isEmpty(value) || this.insideWalls(x, y);
      });
    });
  }

  // 값이 비어있는지 확인하는 함수
  isEmpty(value) {
    return value === 0;
  }

  // x, y의 범위가 맞는지 확인하는 함수
  insideWalls(x, y) {
    return (x >= 0) && (x < COLS) && (y <= ROWS) && ((this.grid[y] && this.grid[y][x]) === 0);
  }

  rotate(piece) {
    // 불변성을 위해 JSON으로 복사
    // stringify() 함수는 행렬을 json 문자열로 변환한다.
    // parse() 함수는 json 문자열을 파싱하고, 복하단 다음 다시 행렬로 만든다.
    let p = JSON.parse(JSON.stringify(piece));

    // 행렬을 변환한다.
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] =
        [p.shape[y][x], p.shape[x][y]];
      }
    }

    // 열 순서대로 뒤집는다.
    p.shape.forEach(row => row.reverse());
    return p;
  }
}
