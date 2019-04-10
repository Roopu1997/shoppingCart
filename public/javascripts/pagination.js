let totalPage = parseInt(document.getElementById('totalPage').value);
let curPage = parseInt(document.getElementById('curPage').value);

if(curPage === 1) {
    let prev = document.getElementById('prev-link');
    prev.classList.add('disabled');
}

if(curPage === totalPage) {
    let prev = document.getElementById('next-link');
    prev.classList.add('disabled');
}

let pageNo = 'pg-' + curPage;
document.getElementById(pageNo).classList.add('active');

let prevAnchor = '/?page=' + (curPage - 1);
document.getElementById('prev-anchor').setAttribute('href', prevAnchor);

let nextAnchor = '/?page=' + (curPage + 1);
document.getElementById('next-anchor').setAttribute('href', nextAnchor);