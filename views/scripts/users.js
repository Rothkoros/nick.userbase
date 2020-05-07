function searchName() {
  let name = document.getElementById("Name").value;
  window.location.href = `/users/?Name=${name}`;
}
