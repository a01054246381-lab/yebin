function getInput(e) {
  e.preventDefault();

  const id = document.myform.userId.value.trim();
  const pw = document.myform.passwd.value.trim();

  if (!id) {
    alert("아이디를 입력하세요");
    return;
  }

  if (!pw) {
    alert("비밀번호를 입력하세요");
    return;
  }

  alert(`${id}님 환영합니다 😊`);
  location.href = "/interview001/mainpage/in_main.html";
}
