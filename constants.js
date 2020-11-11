// 게임 설정과 규칙을 정의하는 JavaScript

// col, row, block size, line clear per lever up, the number of high scores 정의
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 10;
const NO_OF_HIGH_SCORES = 10;

// 색 정의
const COLORS = [
  'none',
  'cyan',
  'blue',
  'orange',
  'yellow',
  'green',
  'purple',
  'red'
];

// 조각의 모양 배열화
const SHAPES = [
  [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];

// 방향키 설정, 키 코드값 매핑
const KEY = {
  SPACE:  32,
  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40
};

// KEY를 불변하게 하기 위해서 freeze() 함수를 사용한다.
[COLORS, SHAPES, KEY].forEach(item => Object.freeze(item));
