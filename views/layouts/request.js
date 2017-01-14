console.log('sanity');

function requestHelper(url, listener) {
  let newReq = new XMLHttpRequest();
  newReq.open('GET', url);
  newReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  newReq.send();
}

let testing = document.createElement('p');
testing.innerHTML = 'yes';
yes.appendChild(testing);