const M_CARD = 'card_m';
const T_TIMER = 'timer_t';

/**
 * 全画面共通読み込み時処理
 */
$(function () {

  loadSW();

  addEvents();

  loadCards();
  loadTimer();
  showResult();
});

function loadSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('ServiceWorker registration successful.');
    }).catch(err => {
      console.log('ServiceWorker registration failed.');
    });
  }
}

/**
 * イベント定義
 */
function addEvents() {

  $('#btnAddCard').on('click', function(){
    if ($('#txtProjectNm').val() == '') {
      return;
    }

    let table = getData(M_CARD);

    const cardId = table.length + 1;
    const projNm = $('#txtProjectNm').val();
    const workNm = $('#txtWorkNm').val();
    let data = {
      'id': cardId,
      'projNm': projNm,
      'workNm': workNm
    };

    insertData(data, M_CARD);
    addCard(data);

    clearInputArea();
  });

  $('#chkCard_').on('change', function() {
    const checked = $(this).prop('checked');
    const id = $(this).attr('id');
    const cardId = id.replace('chkCard_','');
    if (checked) {
      timerStart(cardId);
      $('input[id^="chkCard_"]').each(function(index, elm) {
        if ($(elm).attr('id') != id){
          if ($(elm).prop('checked') == true) {
            timerEnd($(elm).attr('id').replace('chkCard_',''));
            $(elm).prop('checked', false);
          }
        }
      });
    } else {
      timerEnd(cardId);
    }
  });

  $('#btnResult').on('click', function () {
    showResult();
  });
  $('#btnClear').on('click', function () {
    if (confirm('結果をクリアします。よろしいですか？')) {
      clearStorage(T_TIMER);
      showResult();
      $('input[id^="chkCard_"]').each(function(index, elm) {
        $(elm).prop('checked', false);
      });
    }
  });
  $('#btnDelCards').on('click', function () {
    if (confirm('すべてのカードと作業記録をクリアします。よろしいですか？')) {
      clearStorage(M_CARD);
      clearStorage(T_TIMER);
      location.reload();
    }
  });

  setInterval("showResult()", 60 * 1000);
}

function showResult() {
  $('#conTable').empty()
  const now = Date.now();
  let elTable = $('<table>');
  let tr = $('<tr>')
  $(elTable).addClass('table table-striped');
  $(tr).append('<th>プロジェクト</th>');
  $(tr).append('<th>作業</th>');
  $(tr).append('<th>日付</th>');
  $(tr).append('<th>作業時間</th>');
  $(elTable).append(tr);
  let cards = getData(M_CARD);

  let table = getData(T_TIMER);
  table.forEach(data => {
    let workMin = data['work_minute'];
    let workHour = 0;
    let strWorkTimer = '';
    let projNm = '';
    let workNm = '';
    if (data['start_dt'] != '') {
      workMin = data['work_minute'] + Math.floor((now - data['start_dt']) / 60000);
    }
    workHour = Math.floor(workMin / 60);
    workMin = workMin - workHour * 60;
    if (workHour > 0) {
      strWorkTimer += workHour + '時間';
    }
    strWorkTimer += workMin + '分';

    tr = $('<tr>')

    cards.forEach(card => {
      if (card['id'] == data['id']) {
        projNm = card['projNm'];
        workNm = card['workNm'];
      }
    });

    $(tr).append('<td>' + projNm + '</td>');
    $(tr).append('<td>' + workNm + '</td>');
    $(tr).append('<td>' + data['date'] + '</td>');
    $(tr).append('<td>' + strWorkTimer + '</td>');
    $(elTable).append(tr);
  });

  $('#conTable').append(elTable);

}

function timerStart(id){
  const objDate = new Date();
  const today = objDate.getFullYear() + "/" + (objDate.getMonth() * 1 + 1) + "/"+ objDate.getDate();
  const now = Date.now();

  let table = getData(T_TIMER);
  let isExists = false;
  table.forEach(data => {
    if (data['id'] == id && data['date'] == today) {
      isExists = true
      data['start_dt'] = now;
    }
  });

  if (!isExists) {
    let data = {
      'id': id,
      'date': today,
      'start_dt': now,
      'work_minute': 0
    };
    insertData(data, T_TIMER);
  } else {
    setTable(table, T_TIMER);
  }
}

function timerEnd(id){
  const objDate = new Date();
  const today = objDate.getFullYear() + "/" + (objDate.getMonth() * 1 + 1) + "/"+ objDate.getDate();
  const now = Date.now();

  let table = getData(T_TIMER);
  table.forEach(data => {
    if (data['id'] == id && data['date'] <= today && data['start_dt'] != '') {
      const startDt = data['start_dt'];
      let workMin = data['work_minute'] + Math.floor((now - startDt) / 60000);
      data['start_dt'] = '';
      data['work_minute'] = workMin;
    }
  });

  setTable(table, T_TIMER);

}

function insertData(data, tableNm) {
  let table = getData(tableNm);
  table.push(data);
  setTable(table, tableNm);
}


function addCard(data) {
  const id = data['id'];
  const projNm = data['projNm'];
  const workNm = data['workNm'];

  const card = $('#card_').clone(true);
  $(card).find('#chkCard_').attr('id', 'chkCard_' + (id));
  $(card).find('h5').text(projNm);
  $(card).find('h6').text(workNm);

  $(card).attr('id', 'card_' + (id));
  $(card).find('label').attr('for', 'chkCard_' + (id));
  $(card).data('card_id', (id));
  $(card).css('display', '');

  $(card).appendTo('#divCardContainer');
}

function clearStorage(key) {
  localStorage.removeItem(key);
}

/**
 * ローカルストレージからテーブルを取得する
 */
function getData(tableNm){
  let table = [];
  let getjson = localStorage.getItem(tableNm);

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
function setTable(table, tableNm){
  let setjson = JSON.stringify(table);
  localStorage.setItem(tableNm, setjson);
}

function clearInputArea() {
  $('#txtProjectNm').val('');
  $('#txtWorkNm').val('');
}


function loadCards() {
  let table = getData(M_CARD);

  if (table.length == 0) {
    return;
  }

  table.forEach(data => {
    addCard(data);
  });
}


function loadTimer() {
  let table = getData(T_TIMER);

  if (table.length == 0) {
    return;
  }

  table.forEach(data => {
    if (data['start_dt'] != '') {
      $('#chkCard_' + data['id']).prop('checked', true);
    }
  });
}
