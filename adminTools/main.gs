//　Written by Rink(アルテリア工房)

//　定数宣言

//　サービスモジュール
//　AdminLicenseManager：Enterprise License Manager API

//　定期処理
function main()
{
  //　パラメータファイルからパラメータを入力
  var pParams = loadParams("1IY1-ZE8AtnxOF_CcCNiWIEsXac4oaAm9AiF8B7BzV4w")
  console.log(pParams)

  //　エイリアス変数に載せ替え
  const pDomainName = pParams["domainName"]
  const productId = pParams["productId"]
  const skuId = pParams["skuId"]

  //　停止中のアカウントからライセンスを剥奪する。
  revokeLicenseFromSuspendedUsers(pDomainName, productId, skuId)
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