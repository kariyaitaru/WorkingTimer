/**
 * 全画面共通読み込み時処理
 */
$(function () {
  addEvents();

  loadStrage();
});

/**
 * イベント定義
 */
function addEvents() {

  $('#btnAddCard').on('click', function(){
    if ($('#txtProjectNm').val() == '') {
      exit;
    }

    let table = getData();

    const cardId = table.length;
    const projNm = $('#txtProjectNm').val();
    const workNm = $('#txtWorkNm').val();
    let data = {
      'id': cardId,
      'projNm': projNm,
      'workNm': workNm
    };

    insertData(data);
    addCard(data);

    clearInputArea();
  });

  $('#chkCard_').on('change', function() {
    const checked = $(this).prop('checked');
    const id = $(this).attr('id');
    if (checked) {
      $('input[id^="chkCard_"]').each(function(index, elm) {
        if ($(elm).attr('id') != id){
          $(elm).prop('checked', false);
        }
      });
    }
  });

  $('#btnTimer').on('click', function () {
    const now = Date.now();
    $('#txtProjectNm').val(now);
  });
}


function insertData(data) {
  let table = getData();
  table.push(data);
  setTable(table);
}


function addCard(data) {
  const id = data['id'];
  const projNm = data['projNm'];
  const workNm = data['workNm'];

  const card = $('#card_').clone(true);
  $(card).find('#chkCard_').attr('id', 'chkCard_' + (id + 1));
  $(card).find('h5').text(projNm);
  $(card).find('h6').text(workNm);

  $(card).attr('id', 'card_' + (id + 1));
  $(card).find('label').attr('for', 'chkCard_' + (id + 1));
  $(card).data('card_id', (id + 1));
  $(card).css('display', '');

  $(card).appendTo('#divCardContainer');
}


/**
 * ローカルストレージからテーブルを取得する
 */
function getData(){
  let table = [];
  let getjson = localStorage.getItem('card_m');

  if (getjson) {
    table = JSON.parse(getjson);
  }
  return table;
}

/**
 * ローカルストレージにテーブルを登録する
 *
 * @param {*} table
 */
function setTable(table){
  let setjson = JSON.stringify(table);
  localStorage.setItem('card_m', setjson);
}

function clearInputArea() {
  $('#txtProjectNm').val('');
  $('#txtWorkNm').val('');
}


function loadStrage() {
  let table = getData();

  if (table.length == 0) {
    return;
  }

  table.forEach(data => {
    addCard(data);
  });
}
