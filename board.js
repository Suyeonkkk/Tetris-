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
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  // 테트리스 판을 초기화하는 함수이며, 0으로 채워진 행렬을 얻는다.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }

  // 새로운 조각을 얻는 함수
  getNewPiece() {
    const { width, height } = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }
  
  // piece를 그리는 함수
  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  // x와 y의 값에 맞게 맞는 색과 함께 그린다.
  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  // piece를 떨어뜨리는 함수
  drop() {

    // piece의 key down이 올바르면 move
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } 
    
    // 올바르지 않으면 freeze, clear할수있는지 check
    else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // 게임 오버
        return false;
      }

      // 다음 piece를 준비
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  // piece가 있는 자리에 value를 저장하며 값을 고정시킨다.
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }
  
  // 행의 모든 값이 0이 아닌 경우 clear하는 함수.
  clearLines() {
    let lines = 0;

    this.grid.forEach((row, y) => {
      // 행의 모든 값이 0이 아닌 경우에는 line ++
      if (row.every((value) => value > 0)) {
        lines++;

        // 그 행을 삭제
        this.grid.splice(y, 1);

        // shift와 함께 0으로 채운다. 위쪽을 비게 만든다.
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      // 클리어 된 line이 1개 이상인 경우 

    }
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

  // 값이 비어있는지 확인하는 함수, 0 은 아무 조각도 없기 때문에
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
