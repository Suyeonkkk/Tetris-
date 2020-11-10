// 테트리스 조각과 관련된 JavaScript

class Piece {

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  // 보드의 위치를 변경하기 위하여 x, y의 속성 값을 변경할 수 있어야 한다.
  move(p) {
    if (! this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  spawn() {
    // 색상
    this.color = "red";

    // 모양
    this.shape = [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]
    ];

    // 시작점
    this.x = 3;
    this.y = 0;

    // 하드 드롭
    this.hardDropped = false;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {

          // this.x this.y는 shape의 좌측 상단 좌표이다.
          // shape 안에 있는 블록 좌표에 x, y를 더하여
          // 보드에서 블록의 좌표는 this.x+x, this.y+y가 된다.
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  hardDrop() {
    this.hardDropped = true;
  }
}
