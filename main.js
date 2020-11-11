// 게임 시작과 종료와 관련된 메인 JavaScript

// 게임 판의 id가 board로 저장되어있어 element를 canvas에 저장하고, context를 ctx에 저장한다.
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");

time = { start: 0, elapsed: 0, level: 1000 };

// 보드를 새롭게 선언한다.
let board = new Board(ctx, ctxNext);

// play 버튼을 눌렀을 때 실행되는 함수이다.
function play() {

  // 지우고 다시 reset() 함수를 실행시켜 초기화한다.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  board.reset();

  let piece = new Piece(ctx);
  piece.draw();

  board.piece = piece;

  animate();
}

function animate(now = 0) {
  
  // 지난 시간 업데이트
  time.elapsed = now - time.start;

  // 지난 시간이 현재 레벨의 시간을 초과하는지 확인
  if (time.elapsed > time.level) {

    // 현재 시간 다시 측정
    time.start = now;

    // drop() 할 수 없다면 종료
    if (!board.drop()) {
      
      return;
    }
  }

  // 새로운 상태로 그리기 전에 보드를 지운다.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

// KEY를 입력하였을 때 좌표 변경을 담당한다.
moves = {
  [KEY.LEFT]:   p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]:  p => ({ ...p, x: p.x + 1 }),
  [KEY.UP]:     p => board.rotate(p),
  [KEY.DOWN]:   p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]:  p => ({ ...p, y: p.y + 1 })
};

document.addEventListener("keydown", event => {
  if (moves[event.keyCode]) {
    // 이벤트 버블링을 막기위하여 이벤트를 취소하는 함수
    event.preventDefault();

    // 조각의 새로운 상태를 저장한다.
    let p = moves[event.keyCode](board.piece);

    // space, 바로 떨어뜨리기인 경우
    if (event.keyCode === KEY.SPACE) {
      while (board.valid(p)) {
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();
    }

    else if (board.valid(p)) {
      // 조각이 이동한다.
      board.piece.move(p);

      p = moves[KEY.DOWN](board.piece);
    }
    // 조각을 새롭게 그리기 전에 좌표를 지운다.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 조각을 새롭게 그린다.
    board.piece.draw();
  }
});
