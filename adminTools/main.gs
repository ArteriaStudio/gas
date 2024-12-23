﻿//　Written by Rink(アルテリア工房)
//　＜使用上の留意事項＞
//　　・リモートからのコマンドはキューされる。
//　　・管理対象外のデバイスを後日にデバイス登録すると、登録時点で待機されたコマンドが実行される。

//　定数宣言

//　サービスモジュール
//　AdminLicenseManager：Enterprise License Manager API

var g_pDomainName = ""
var g_productId = ""
var g_skuId = ""

//　定期処理
function main()
{
  //　停止中のアカウントからライセンスを剥奪する。
  //revokeLicenseFromSuspendedUsers(g_pDomainName, g_productId, g_skuId)

  //　アカウントの組織単位を変更する。
  //moveOrgUnit("element@arteria-s.net", "/客員")

  //　定期処理を実行
  loadEntities("1IY1-ZE8AtnxOF_CcCNiWIEsXac4oaAm9AiF8B7BzV4w")
}

//　初期処理
function initialize()
{
  //　パラメータファイルからパラメータを入力
  var pParams = loadParams("1IY1-ZE8AtnxOF_CcCNiWIEsXac4oaAm9AiF8B7BzV4w")
  console.log(pParams)

  //　エイリアス変数に載せ替え
  g_pDomainName = pParams["domainName"]
  g_productId = pParams["productId"]
  g_skuId = pParams["skuId"]
}


//　停止中のアカウントからライセンスを剥奪する。
function revokeLicenseFromSuspendedUsers(domainName, productId, skuId)
{
  var pQuery = "isSuspended=true";
  var pUsers = listAllUsers(domainName, pQuery);
  console.info(pUsers);
  for (const pUser of pUsers) {
    var pResult = getLicenseAssignment(productId, skuId, pUser)
    if (pResult) {
      console.log("have License: " + pUser)
    } else {
      console.log("no have License: " + pUser)
    }
  }
}

//　パラメータファイルからパラメータを入力して連想配列に格納する。
function loadParams(fileId)
{
  var pArray = {}

  try {
    var pSpread = SpreadsheetApp.openById(fileId)
    console.log("SpreadName: " + pSpread.getName())
    var pSheet = pSpread.getSheetByName("Params")
    console.log("SheetName: " + pSheet.getName())
    var nRows = pSheet.getLastRow();
    for (var iRow = 2; iRow <= nRows; iRow ++) {
      var pRange = pSheet.getRange(iRow, 1, 1, 2)
      var pValues = pRange.getValues()
      var pKey = pValues[0][0]
      var pVal = pValues[0][1]
      console.log(pValues)
      console.log("Name: " + pKey + ", Value: " + pVal)
      //　連想配列に積み替え
      pArray[pKey] = pVal
    }
  } catch (e) {
    console.log(e.message)
  }
  return(pArray)
}

//　パラメータファイルから条件データを入力してエントリ処理関数に渡す。
function loadEntities(fileId)
{
  try {
    var pSpread = SpreadsheetApp.openById(fileId)
    console.log("SpreadName: " + pSpread.getName())
    var pSheet = pSpread.getSheetByName("ExpireEntities")
    console.log("SheetName: " + pSheet.getName())
    var nRows = pSheet.getLastRow();
    for (var iRow = 2; iRow <= nRows; iRow ++) {
      //　セルから範囲を取得
      var pRange = pSheet.getRange(iRow, 1, 1, 6)
      var pValues = pRange.getValues()

      //　エイリアスとする変数に複写
      var pUser = pValues[0][0]
      var pSerialNumber = pValues[0][1]
      var pOrgUnit = pValues[0][2]
      var pCommand = pValues[0][3]
      var pExpireDate = pValues[0][4]
      var pDone = pValues[0][5]
      
      //　処理済み行はスキップする。
      if (pDone != "") {
        continue;
      }

      //　処理関数を起動
      var pDone = false;
      var pError = "";
      try {
        var result = ProcessEntry(pUser, pSerialNumber, pOrgUnit, pCommand, pExpireDate)
        if (result == false) {
          //　処理対象外（スキップ）
          continue;
        }
        pDone = true;
      } catch (e) {
        pDone = false;
        pError = e.message;
      }

      //　処理結果を記録
      pSheet.getRange(iRow, 6).setValue(pDone);
      pSheet.getRange(iRow, 7).setValue(new Date);
      pSheet.getRange(iRow, 8).setValue(pError);
    }
  } catch (e) {
    console.log(e.message)
  }
}

//　エントリ処理関数
function ProcessEntry(pUser, pSerialNumber, pOrgUnit, pCommand, pExpireDate)
{
  //　入力データ検査
  if (isMailAddress(pUser) == false) {
    //　ユーザー名がメールアドレスの形式でなければ、処理対象外とする。
    return(false);
  }
  if ((pExpireDate == null) || (pExpireDate == "")) {
    //　期限が指定されていない。処理対象外とする。
    return(false);
  }
  var pNow = new Date
  if (pExpireDate >= pNow) {
    //　処理対象とする期限を迎えていない。（処理対象外）
    return(false);
  }

  //　処理関数を起動
  switch (pCommand) {
  case  "SuspendAccount":
    //　アカウントを停止
    switchAccountStatus(pUser, true)
    break;
  case  "SuspendDevice":
    switchDeviceStatus(pSerialNumber, "disable");
    break;
  case  "RenableDevice":
    switchDeviceStatus(pSerialNumber, "reenable");
    break;
  case  "DeprovisoningDevice":
    deprovisionDevice(pSerialNumber);
    break;
  case  "RebootDevice":
    issueDevice(pSerialNumber, "REBOOT");
    break;
  case  "WipeUsers":
    issueDevice(pSerialNumber, "WIPE_USERS");
    break;
  case  "RemotePowerWash":
    issueDevice(pSerialNumber, "REMOTE_POWERWASH");
    break;
  case  "MoveDeviceToOU":
    moveDeviceToOU(pSerialNumber, pOrgUnit)
    break;
  default:
    //　コマンドが定義にない。（処理対象外）
    return(false);
  }

  console.log("Command: " + pCommand + ", Date: " + pExpireDate + ", User: " + pUser + ", SerialNumber: " + pSerialNumber)

  return(true);
}