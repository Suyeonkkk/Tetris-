// 소리를 담당하는 js

class Sound {

  // 생성자
  constructor(parent){
    this.parent = parent;
    this.sounds = [];
    this.muted = true;
  }

  // 인자로 들어온 src, id를 이용하여 audio 태그를 생성한다.
  create(src, id, loop = false){
    let audio = document.createElement("audio");
    audio.src = src;
    audio.id = id;
    audio.muted = true;
    this.sounds.push(audio);
    this.parent.append(audio);

    if (loop) {
      audio.setAttribute("loop", "")
    }

    return audio;
  }
}

// sound items들의 mute toggle 연결
Sound.prototype.soundSetting = function(){
    let soundItems = document.querySelectorAll(".sound-item");
    for (let soundItem of soundItems) {
        soundItem.addEventListener("click", (e)=>{
            this.muteToggle();
        });
    }
};

// muted 상태에 따라 음소거를 하고, 안하는 기능 추가
Sound.prototype.muteToggle = function(){
    if (! this.muted) {
        for (let sound of this.sounds) {
            sound.muted = true;
        }
        document.querySelector("#sound-speaker").innerHTML = "\u{1F507}";
        document.querySelector("#sound-description").innerHTML = "off";
        this.muted = true;
    } else {
      for (let sound of this.sounds) {
          sound.muted = false;
      }
      document.querySelector("#sound-speaker").innerHTML = "\u{1F509}";
      document.querySelector("#sound-description").innerHTML = "on";
      this.muted = false;
    }
};

// pause 연결
Sound.prototype.pause = function(){
    for (let sound of this.sounds) {
        sound.pause();
    }
}

// play 연결
Sound.prototype.play = function(){
    for (let sound of this.sounds) {
        sound.play();
    }
}

// 각 사운드 연결
let sound = new Sound(document.querySelector("#sound-div")),
    backgroundSound =  sound.create("sounds/background.mp3", "background_sound", true),
    movesSound = sound.create("sounds/moves.mp3", "moves_sound"),
    dropSound = sound.create("sounds/drop.mp3", "drop_sound"),
    pointsSound = sound.create("sounds/clear.mp3", "points_sound"),
    finishSound = sound.create("sounds/finish.mp3", "finish_sound");;
sound.muteToggle();
sound.soundSetting();

// setting 창에서 apply 버튼을 누른 경우
function apply() {
  // sound 가져오기
  var newBackgroundSound = document.getElementById('background-sound');
  var newDropSound = document.getElementById('drop-sound');
  var newClearSound = document.getElementById('clear-sound');
  var newFinishSound = document.getElementById('finish-sound');

  // sound null check
  if (newBackgroundSound.value.length === 0) {
    newBackgroundSound = "background.mp3";
  } else {
    newBackgroundSound = newBackgroundSound.files[0].name;
  }
  if (newDropSound.value.length === 0) {
    newDropSound = "drop.mp3";
  } else {
    newDropSound = newDropSound.files[0].name;
  }
  if (newClearSound.value.length === 0) {
    newClearSound = "clear.mp3";
  } else {
    newClearSound = newClearSound.files[0].name;
  }
  if (newFinishSound.value.length === 0) {
    newFinishSound = "finish.mp3";
  } else {
    newFinishSound = newFinishSound.files[0].name;
  }

  // sound update
  sound = new Sound(document.querySelector("#sound-div")),
      backgroundSound =  sound.create("sounds/" + newBackgroundSound, "background_sound", true),
      movesSound = sound.create("sounds/moves.mp3", "moves_sound"),
      dropSound = sound.create("sounds/" + newDropSound, "drop_sound"),
      pointsSound = sound.create("sounds/" + newClearSound, "points_sound"),
      finishSound = sound.create("sounds/" + newFinishSound, "finish_sound");;
  sound.muteToggle();
  sound.soundSetting();

  // color update
  var color = document.getElementsByName('color');
  for (var i = 0; i < 6; i++) {
    if (color[i].checked) {
      document.getElementById('play-btn').style.background = color[i].value;
      document.getElementById('pause-btn').style.background = color[i].value;
      document.getElementById('reset-btn').style.background = color[i].value;
      document.getElementById('setting-btn').style.background = color[i].value;
      document.getElementById('setting-box').style.background = color[i].value;
      break;
    }
  }

  hide();
}
