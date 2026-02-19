
/* ===== 점수 ===== */
const score = 87;

/* ===== 게이지 ===== */
const circle = document.querySelector(".progress");
const radius = 70;
const circumference = 2*Math.PI*radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

setTimeout(()=>{
  circle.style.strokeDashoffset =
    circumference - (score/100)*circumference;
},200);

/* 숫자 애니메이션 */
let n=0;
const scoreEl=document.getElementById("score");
const counter=setInterval(()=>{
  if(n>=score) clearInterval(counter);
  else scoreEl.textContent=++n;
},15);

/* ===== 등급 계산 ===== */
function getGrade(s){
  if(s>=90) return ["S","합격 가능성 매우 높음 (90%+)"];
  if(s>=80) return ["A","합격 가능성 높음 (75%+)"];
  if(s>=70) return ["B","합격 가능성 보통"];
  return ["C","추가 보완 필요"];
}

const [grade,pass]=getGrade(score);
document.getElementById("grade").textContent="등급 "+grade;
document.getElementById("passRate").textContent=pass;

/* ===== 막대 그래프 ===== */
document.querySelectorAll(".fill").forEach(b=>{
  setTimeout(()=>{
    b.style.width=b.dataset.score+"%";
  },300);
});
