// 게임 설정과 규칙을 정의하는 JavaScript

// col, row, block size 정의
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// 방향키 설정, 키 코드값 매핑
const KEY = {
  SPACE:  32,
  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40
}

// KEY를 불변하게 하기 위해서 freeze() 함수를 사용한다.
Object.freeze(KEY);
