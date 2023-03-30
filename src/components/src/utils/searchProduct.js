const searchProduct = (filterInput, filterUL) => {
  let input, filter, ul, li, a, i;
  input = document.getElementById(filterInput);
  filter = input.value.toUpperCase();
  ul = document.getElementById(filterUL);
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
  
};
