function create_sheet() {
  //==============================
  // 定数
  //==============================
  const DIFF_OF_DAY = 1;
  const NEW_SHEET_INDEX = 0;

  //==============================
  // 日付処理
  //==============================
  const dateOfData = dayjs.dayjs().add(DIFF_OF_DAY, 'day');
  const sheetName = dateOfData.format('YYYYMM');

  //==============================
  // シートを取得
  //==============================
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName(sheetName);

  // シートがあれば処理を終了
  if (sheet) {
    return;
  }

  //==============================
  // シートを作成
  //==============================
  const newSheet = spreadSheet.insertSheet(NEW_SHEET_INDEX);
  newSheet.setName(sheetName);
}
