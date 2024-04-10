function doPost(e) {
  //==============================
  // 定数
  //==============================
  const DIFF_OF_DAY = 1;
  const YES_SIGNATURE = '○';
  const NEITHER_SIGNATURE = '△';
  const NO_SIGNATURE = '×';
  const DATE_CELL_COLOR = '#D9D9D9';

  //==============================
  // パラメータ取得
  //==============================
  const params = e;

  Object.keys(params).forEach((k) => {
    if (/(normal|crisis)_q\d+/.test(k)) {
      if (params[k] === 'yes') params[k] = YES_SIGNATURE;
      else if (params[k] === 'neither') params[k] = NEITHER_SIGNATURE;
      else if (params[k] === 'no') params[k] = NO_SIGNATURE;
    }
  });

  //==============================
  // 日付処理
  //==============================
  const dateOfData = dayjs.dayjs().subtract(DIFF_OF_DAY, 'day');
  const sheetName = dateOfData.format('YYYYMM');
  const dateString = dateOfData.format('M月D日');

  //==============================
  // シートの取得
  //==============================
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName(sheetName);

  if (!sheet) {
    const errorMessage = `Sheet ${sheetName} is not found.`;
    console.error(errorMessage);
    return {
      error_message: errorMessage,
    };
  }

  //==============================
  // 書き込み
  //==============================
  // 最終行の取得
  const COLUMN = sheet.getLastColumn() + 1;

  // 書き込み
  sheet.getRange(1, COLUMN).setValue(dateString);
  sheet.getRange(2, COLUMN).setValue(params.normal_q1);
  sheet.getRange(3, COLUMN).setValue(params.normal_q2);
  sheet.getRange(4, COLUMN).setValue(params.normal_q3);
  sheet.getRange(5, COLUMN).setValue(params.normal_q4);
  sheet.getRange(6, COLUMN).setValue(params.normal_q5);
  sheet.getRange(7, COLUMN).setValue(params.normal_q6);
  sheet.getRange(8, COLUMN).setValue(params.normal_q7);
  sheet.getRange(9, COLUMN).setValue(params.normal_q8);
  sheet.getRange(10, COLUMN).setValue(params.crisis_q1);
  sheet.getRange(11, COLUMN).setValue(params.crisis_q2);
  sheet.getRange(12, COLUMN).setValue(params.crisis_q3);
  sheet.getRange(13, COLUMN).setValue(params.crisis_q4);
  sheet.getRange(14, COLUMN).setValue(params.crisis_q5);
  sheet.getRange(15, COLUMN).setValue(params.crisis_q6);
  sheet.getRange(16, COLUMN).setValue(params.crisis_q7);
  sheet.getRange(17, COLUMN).setValue(params.crisis_q8);
  sheet.getRange(18, COLUMN).setValue(params.medication_night);
  sheet.getRange(19, COLUMN).setValue(params.medication_before_sleep);
  sheet.getRange(20, COLUMN).setValue(params.medication_morning);
  sheet.getRange(21, COLUMN).setValue(params.evaluation_points);
  sheet.getRange(22, COLUMN).setValue(params.notice);

  //==============================
  // シートの装飾
  //==============================
  // 背景色
  sheet.getRange(1, COLUMN).setBackground(DATE_CELL_COLOR);
  // 枠線
  sheet.getRange(1, COLUMN, 19).setBorder(true, true, true, true, true, false);
  sheet.getRange(1, COLUMN).setBorder(false, true, true, true, false, false);
  sheet.getRange(9, COLUMN).setBorder(false, true, true, true, false, false);
  sheet.getRange(17, COLUMN).setBorder(false, true, true, true, false, false);
  sheet.getRange(18, COLUMN).setBorder(true, true, true, true, false, false);
  sheet.getRange(19, COLUMN).setBorder(true, true, true, true, false, false);
  sheet.getRange(20, COLUMN).setBorder(true, true, true, true, false, false);
  sheet.getRange(21, COLUMN).setBorder(true, true, true, true, false, false);
  sheet.getRange(22, COLUMN).setBorder(true, true, true, true, false, false);

  //==============================
  // レスポンス
  //==============================
  const response = JSON.stringify({ result: 'OK' });
  return response;
}
