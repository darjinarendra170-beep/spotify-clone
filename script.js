
let playaudio = document.querySelector(".playaudio");
let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0];
let currentSong = new Audio();
let play = document.querySelector("#play");

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  for (let song of songs) {
    let finalsong1 = song.split("/").pop();
    let finalsong2 = finalsong1.replaceAll("%20", " ");
    let finalsong3 = finalsong2.replaceAll(".mp3", "");
    
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img src="music.svg" alt="" class="invert">
                <div class="info">
                  <div>${song.split("/").pop().replaceAll("%20", "").replaceAll(".mp3", "")}</div>
                  
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
              </li>`;
    
    currentSong.src = songs[0];
    document.querySelector(".songinfo").innerHTML = songs[0].split("/").pop().replaceAll("%20", "").replaceAll(".mp3", "");
  }
  return songs;
}

// let playmusic = (track) => {
//   let audio = new Audio(songs[0]);
//   audio.play();
// };

function getFirstThreeAlpha(str) {
  let onlyAlpha = str.replace(/[^a-zA-Z]/g, ""); // sirf letters rakho, baaki sab hatao
  return onlyAlpha.substring(0, 3); // pehle 3 characters lo
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}




async function main() {
  let songs = await getsongs();
  

  function findSongLink(word) {
    let matchedLink = songs.find((link) =>
      decodeURIComponent(link).toLowerCase().includes(word.toLowerCase()),
    );
    
    return matchedLink;
  }

  Array.from(
    document.querySelector(".songslist").getElementsByTagName("li"),
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      
      let find = e.querySelector(".info").firstElementChild.innerHTML;

      let firstThree = getFirstThreeAlpha(find);
      findSongLink(firstThree);

      // let audio = new Audio(findSongLink(firstThree));
      currentSong.src = findSongLink(firstThree);
      currentSong.play();
      play.src = "pause.svg";
      document.querySelector(".songinfo").innerHTML = find;
      document.querySelector(".songtime").innerHTML = "00:00 / 00:00";




      
    });
  });
  play.addEventListener("click",()=>{
    if(currentSong.paused){
      
      play.src = "pause.svg";
      currentSong.play();
    }
    else{
      currentSong.pause();
      play.src = "play.svg";
    }
  })

  // now song time updatation
  currentSong.addEventListener("timeupdate",()=>{
    
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    
  })
  document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
    document.querySelector(".circle").style.left = (percent) + "%";
    currentSong.currentTime = (currentSong.duration * percent)/100;
  })

}
main();
