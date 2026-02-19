document.addEventListener("DOMContentLoaded",()=>{

/* =========================
   샘플 점수
========================= */

const career=82;
const skill=78;
const attitude=85;

const total=Math.round(career*0.4+skill*0.3+attitude*0.3);


/* =========================
   UI 출력
========================= */

careerBar.style.width=career+"%";
skillBar.style.width=skill+"%";
attBar.style.width=attitude+"%";

careerLabel.textContent=career+"점";
skillLabel.textContent=skill+"점";
attLabel.textContent=attitude+"점";

totalScore.textContent=total;


/* =========================
   원형 게이지
========================= */

const circle=document.querySelector(".progress");
const circumference=502;
const offset=circumference-(total/100)*circumference;

setTimeout(()=>{
circle.style.strokeDashoffset=offset;
},200);


/* =========================
   등급
========================= */

function getGrade(s){
if(s>=90)return "S";
if(s>=80)return "A";
if(s>=70)return "B";
if(s>=60)return "C";
return "D";
}

const grade=getGrade(total);
gradeText.textContent=grade;
totalGrade.textContent=grade;


/* =========================
   강점 / 약점
========================= */

const strengths=[];
const weaks=[];

career>=80?strengths.push("경력 경쟁력 우수"):weaks.push("경력 강화 필요");
skill>=80?strengths.push("직무 역량 우수"):weaks.push("기술 역량 향상 필요");
attitude>=80?strengths.push("면접 태도 안정"):weaks.push("표현력 개선 필요");

strengths.forEach(t=>{
const li=document.createElement("li");
li.textContent=t;
strengthList.appendChild(li);
});

weaks.forEach(t=>{
const li=document.createElement("li");
li.textContent=t;
weakList.appendChild(li);
});


/* =========================
   종합 평가
========================= */

let summary="";

if(total>=85) summary="즉시 실무 투입 가능한 우수 인재입니다.";
else if(total>=70) summary="성장 가능성이 높은 지원자입니다.";
else summary="핵심 역량 보완이 필요합니다.";

summaryText.textContent=`총점 ${total}점. ${summary}`;


/* =========================
   기업 분석
========================= */

companyAnalysis.innerHTML=`
지원 기업 : 삼성전자 <br><br>
기업 적합도 : 86% <br>
합격 가능성 : 높음 <br>
성장 잠재력 : 82점 <br>
추천 직무 : 전문 기술 직무
`;


/* =========================
   AI 분석
========================= */

careerSummary.textContent="실무 경험과 직무 이해도가 높습니다.";
skillSummary.textContent="논리적 문제 해결 능력이 뛰어납니다.";
attitudeSummary.textContent="시선 안정성과 자세 유지가 우수합니다.";

strength.textContent="실무 전문성, 안정적인 면접 태도, 높은 업무 이해도";
weakness.textContent="음성 전달력과 표현 다양성 개선 필요";


});


/* =========================
   영상 다운로드
========================= */

function downloadVideo(){
const a=document.createElement("a");
a.href="/videos/interview.mp4";
a.download="interview.mp4";
a.click();
}
