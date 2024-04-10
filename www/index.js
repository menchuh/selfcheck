$(() => {
  //==============================
  // 定数
  //==============================
  const NORMAL_QUESTIONS = [
    '30分以内で入眠できる',
    '躊躇いなく入眠の体勢に入れる',
    '美味しいものを食べたい気持ちがある',
    '出かけたい気分になる',
    'ポジティブ思考',
    'げっぷは出ても気にならない程度',
    '頭痛を感じない',
    '休日に趣味の活動を入れられる（意欲あり）',
  ];

  const CRISIS_QUESTIONS = [
    '眠りまでに時間がかかる（1時間以上）',
    '行動が次第に夜型になってくる',
    '食べるものを選ぶのが億劫になる',
    '意欲の減衰、決断ができなくなる',
    'ネガティブ思考',
    '過剰にげっぷや屁が出る',
    '鼻詰まりや頭重感を覚えやすくなる',
    '趣味をするのが億劫（見る数が減る）',
  ];

  const MEDICATE_TIMINGS = [
    'medication_night',
    'medication_before_sleep',
    'medication_morning',
  ];

  const RADIO_BUTTON_CLASSES =
    'cursor-pointer text-center border rounded-2xl border-gray-400 p-2 w-20 hover:bg-teal-100 peer-checked:bg-teal-400';
  const TIME_INPUT_CLASSES =
    'bg-gray-50 border border-gray-300 rounded-lg hover:bg-teal-100 focus:ring-teal-200 p-2';

  const evaluationPoint = [...Array(11).keys()].map((i) => 100 - i * 10); // 10刻みに100まで

  const REQUEST_URL =
    'https://cs1ewzpkwa.execute-api.ap-northeast-1.amazonaws.com/v1/bridge';

  //==============================
  // 値の設定
  //==============================
  const requiredKeys = [];
  [...Array(8).keys()].forEach((i) => {
    requiredKeys.push(`normal_q${i + 1}`, `crisis_q${i + 1}`);
  });
  requiredKeys.push('evaluation_points', 'notice');

  //==============================
  // 描画
  //==============================
  NORMAL_QUESTIONS.forEach((q, i) => {
    let appendHtml = '';
    appendHtml += `<div class="flex p-8 font-bold">Q${i + 1}. ${q}</div>`;
    // ○
    appendHtml += `<div class="flex pl-10"><div class="flex"><input type="radio" id="normal_q${
      i + 1
    }_yes"  name="normal_q${i + 1}" value="yes" class="hidden peer"/>`;
    appendHtml += `<label for="normal_q${
      i + 1
    }_yes" class="${RADIO_BUTTON_CLASSES}">○</label></div>`;
    // △
    appendHtml += `<div class="flex pl-6"><div class="flex"><input type="radio" id="normal_q${
      i + 1
    }_neither"  name="normal_q${i + 1}" value="neither" class="hidden peer"/>`;
    appendHtml += `<label for="normal_q${
      i + 1
    }_neither" class="${RADIO_BUTTON_CLASSES}">△</label></div>`;
    // ×
    appendHtml += `<div class="flex pl-6"><div class="flex"><input type="radio" id="normal_q${
      i + 1
    }_no"  name="normal_q${i + 1}" value="no" class="hidden peer"/>`;
    appendHtml += `<label for="normal_q${
      i + 1
    }_no" class="${RADIO_BUTTON_CLASSES}">×</label></div>`;

    $('#normal_questions').append(appendHtml);
  });

  CRISIS_QUESTIONS.forEach((q, i) => {
    let appendHtml = '';
    appendHtml += `<div class="flex p-8 font-bold">Q${i + 1}. ${q}</div>`;
    // ○
    appendHtml += `<div class="flex pl-10"><div class="flex"><input type="radio" id="crisis_q${
      i + 1
    }_yes"  name="crisis_q${i + 1}" value="yes" class="hidden peer"/>`;
    appendHtml += `<label for="crisis_q${
      i + 1
    }_yes" class="${RADIO_BUTTON_CLASSES}">○</label></div>`;
    // △
    appendHtml += `<div class="flex pl-6"><div class="flex"><input type="radio" id="crisis_q${
      i + 1
    }_neither"  name="crisis_q${i + 1}" value="neither" class="hidden peer"/>`;
    appendHtml += `<label for="crisis_q${
      i + 1
    }_neither" class="${RADIO_BUTTON_CLASSES}">△</label></div>`;
    // ×
    appendHtml += `<div class="flex pl-6"><div class="flex"><input type="radio" id="crisis_q${
      i + 1
    }_no"  name="crisis_q${i + 1}" value="no" class="hidden peer"/>`;
    appendHtml += `<label for="crisis_q${
      i + 1
    }_no" class="${RADIO_BUTTON_CLASSES}">×</label></div>`;

    $('#crisis_questions').append(appendHtml);
  });

  evaluationPoint.forEach((p) => {
    const appendHtml = `<option value="${p}">${p}</option>`;
    $('#evaluation_points').append(appendHtml);
  });

  MEDICATE_TIMINGS.forEach((t) => {
    let appendHtml = '';
    appendHtml += '<div class="flex m-6 pl-10">';
    appendHtml += `<input type="time" id="${t}" name="${t}" class="${TIME_INPUT_CLASSES}" />`;
    appendHtml += '</div>';
    $(`#${t}`).append(appendHtml);
  });

  //==============================
  // submit処理
  //==============================
  $('form').on('submit', function (e) {
    e.preventDefault();
    const values = $(this).serializeArray();
    const data = {};
    values.forEach((elm) => {
      data[elm.name] = elm.value;
    });

    if (
      requiredKeys.every((k) => Object.keys(data).includes(k)) &&
      /\d+/.test(data['evaluation_points'])
    ) {
      // 送信中...
      $('label#btn_submit_label').text('送信中...');
      // リクエスト送信
      $.ajax({
        url: REQUEST_URL,
        type: 'post',
        dataType: 'json',
        scriptCharset: 'utf-8',
        data: JSON.stringify(data),
      }).then(
        (data) => {
          // 送信中...
          $('label#btn_submit_label').text('送信');
          swal('Success', 'データを送信しました', 'success');
        },
        (data) => {
          console.log(data);
          swal('Failed', 'データの送信に失敗 >_<', 'error');
        }
      );
    } else {
      swal('Failed', '必須の項目が未入力です', 'error');
    }
  });
});
