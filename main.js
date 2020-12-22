// 게임 시작과 종료와 관련된 메인 JavaScript

// 게임 판의 id가 board로 저장되어있어 element를 canvas에 저장하고, context를 ctx에 저장한다.
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

// 다음 나올 조각을 위한 변수 선언
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");

// 초기 값 설정
let accountValues = {score: 0, level: 0, lines: 0};

// key에 대한 value를 설정하는 update 함수
function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

// 타겟의 key에 value를 넣기 위한 부분
let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

// requestId, time 선언
let requestId = null;
let time = null;

// KEY를 입력하였을 때 좌표 변경을 담당한다.
const moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: (p) => board.rotate(p, ROTATION.RIGHT),
  [KEY.Q]: (p) => board.rotate(p, ROTATION.LEFT)
};

// 보드를 새롭게 선언한다.
let board = new Board(ctx, ctxNext);

initNext();
showHighScores();

// 상수로부터 canvas의 크기를 계산한다.
function initNext() {
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

// 이벤트 리스너를 지우고 다시 추가한다.
function addEventListener() {
  document.removeEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', handleKeyPress);
}

// 각 입력별 처리
function handleKeyPress(event) {

  // p는 일시중지
  if (event.keyCode === KEY.P) {
    pause();
  }

  // esc는 게임오버
  if (event.keyCode === KEY.ESC) {
    gameOver();
  }

  // 이동 키 입력되는 경우
  else if (moves[event.keyCode]) {
    event.preventDefault();

    // 새로운 상태를 얻는다.
    let p = moves[event.keyCode](board.piece);

    // space가 입력되는 경우
    if (event.keyCode === KEY.SPACE) {

      // Hard drop(바로 떨어지는 경우)
      if (document.querySelector('#pause-btn').style.display === 'block') {
          dropSound.play();
      } else {
        return;
      }

      // p가 타당한 경우 점수 추가 및 piece 이동/저장
      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();
    }

    // p가 타당한 경우
    else if (board.valid(p)) {

      // pause 상태가 아닌 경우
      if (document.querySelector('#pause-btn').style.display === 'block') {
        movesSound.play();
      }
      board.piece.move(p);

      // pause 상태가 아니면서, key down이 진행되고 있는 경우
      if (event.keyCode === KEY.DOWN && document.querySelector('#pause-btn').style.display === 'block') {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
}

// 점수와 각종 숫자들을 초기화하며 보드를 초기화한다.
function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = {start: performance.now(), elapsed: 0, level: LEVEL[account.level]};
}

// play 버튼을 눌렀을 때 실행되는 함수이다.
function play() {
  addEventListener();

  // play button이 안보이는 경우
  if (document.querySelector('#play-btn').style.display == '') {
    resetGame();
  }

  // 이전의 게임을 계속 가지고 있는 경우
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
  document.querySelector('#play-btn').style.display = 'none';
  document.querySelector('#pause-btn').style.display = 'block';
  backgroundSound.play();
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
      gameOver();
      return;
    }
  }

  // 새로운 상태로 그리기 전에 보드를 지운다.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

// 게임이 종료되면 실행되는 함수이다.
function gameOver() {
  // 게임종료 알림을 위한 판 생성
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);

  // 소리는 중지되며, 종료음악이 들리고, 점수를 체크한다.
  sound.pause();
  finishSound.play();
  checkHighScore(account.score);

  // 버튼의 활성 및 비활성화
  document.querySelector('#pause-btn').style.display = 'none';
  document.querySelector('#play-btn').style.display = '';
}

// 일시 중지 함수
function pause() {
  // requestId에 따라서 버튼을 활성화/비활성화 시키고, animate() 함수를 실행시키며 배경음악을 실행시킨다.
  // 일시중지를 푸는 상황
  if (! requestId) {
    document.querySelector('#play-btn').style.display = 'none';
    document.querySelector('#pause-btn').style.display = 'block';
    animate();
    backgroundSound.play();
    return;
  }

  // 일시중지를 하는 상황
  // animation을 멈추고 requestId를 null로 정의한다.
  cancelAnimationFrame(requestId);
  requestId = null;

  // 일시중지를 알리기위한 창을 만들어 보여주며, 소리를 중지시킨다.
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
  document.querySelector('#play-btn').style.display = 'block';
  document.querySelector('#pause-btn').style.display = 'none';
  sound.pause();
}

// high score를 보여주는 함수이다.
function showHighScores() {
  // 로컬 스토리지를 통해 high score를 가져온다.
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoreList = document.getElementById('highScores');

  // 가져온 리스트를 추가한다.
  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join('');
}

// high score를 확인하는 함수이다.
function checkHighScore(score) {
  // 가장 낮은 점수를 확인한다.
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  // 점수를 비교하여 점수가 더 높을 경우 이름을 입력받는다.
  if (score > lowestScore) {
    var name = prompt('You got a highscore! Enter name:');
    if (name == "") {
      name = "anonymous";
    }

    // 스코어와 이름을 저장하고 그 점수와 이름을 보여준다.
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

// high score를 저장하는 함수이다.
function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
}

// high score를 비우는 함수이다. 로컬 스토리지를 비우고, 새로고침을 한다.
function resetHighScore() {
  localStorage.clear();
  location.reload(true);
}

// 세팅 박스를 띄우는 함수이다. 게임중이라면 일시중지를 한다.
function setting() {
  var box = document.getElementById('setting-box');
  box.style.display = 'block';
  pause();
}

// 세팅 박스를 숨기는 함수이다.
function hide() {
  var box = document.getElementById('setting-box');
  box.style.display = 'none';
}
