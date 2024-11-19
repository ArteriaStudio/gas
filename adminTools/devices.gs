//　デバイス状態を変更する。
//　pAction（reenable、disable）
function switchDeviceStatus(pSerialNumber, pAction)
{
  if (pAction == "deprovision") {
    //　デプロヴィショニング命令は本関数では受け付けない。
    throw({message: "Illigal Action Request by Action"})
  }
  if ((pAction != "reenable") && (pAction != "disable")) {
    throw({message: "Illigal Action Request by Action"})
  }

  //　
  var pCustomerId = "my_customer";  //　my_customerは、事前定義済みのエイリアス
  var pQuery = "id:" + pSerialNumber;
  var pResults = listChromeOS(pCustomerId, pQuery)
  for (const pResource of pResults) {
    var pResourceId = pResource.deviceId;

    //　リクエスト本文を作成
    var pChromeOsDeviceAction = {
      action: pAction,
    }
    //　デバイスの状態を更新
    console.log("DeviceId: " + pResourceId)
    var pResult = AdminDirectory.Chromeosdevices.action(pChromeOsDeviceAction, pCustomerId, pResourceId)
    console.log("switchDeviceStatus() Action: " + pAction +  ", ResourceId:" + pResourceId)
  }
}

//　デバイス状態を変更する。
//　pNewStatus（same_model_replacement、upgrade_transfer、different_model_replacement、retiring_device）
function deprovisionDevice(pSerialNumber)
{
  //　
  var pCustomerId = "my_customer";  //　my_customerは、事前定義済みのエイリアス
  var pQuery = "id:" + pSerialNumber;
  var pResults = listChromeOS(pCustomerId, pQuery)
  for (const pResource of pResults) {
    var pResourceId = pResource.deviceId;

    //　リクエスト本文を作成
    var pChromeOsDeviceAction = {
      action: "deprovision",
      deprovisionReason: "same_model_replacement",
    }
    //　デバイスの状態を更新
    console.log("DeviceId: " + pResourceId)
    var pResult = AdminDirectory.Chromeosdevices.action(pChromeOsDeviceAction, pCustomerId, pResourceId)
    console.log("switchDeviceStatus() Action: " + pChromeOsDeviceAction.action +  ", ResourceId:" + pResourceId)
  }
}

//　デバイスを工場出荷状態に戻す。
function resetDevice(pSerialNumber)
{
  //　
  var pCustomerId = "my_customer";  //　my_customerは、事前定義済みのエイリアス
  var pQuery = "id:" + pSerialNumber;
  var pResults = listChromeOS(pCustomerId, pQuery)
  for (const pResource of pResults) {
    var pDeviceId = pResource.deviceId;
    var pDevice = { commandType: "", payload: "" };
    //　
    var pResult = AdminDirectory.Customer.Devices.Chromeos.issueCommand(pDevice, pCustomerId, pDeviceId);

  }
}

//　デバイスを再起動する。
//　pCommandType（WIPE_USERS, REBOOT, REMOTE_POWERWASH）
function issueDevice(pSerialNumber, pCommandType)
{
  //　
  var pCustomerId = "my_customer";  //　my_customerは、事前定義済みのエイリアス
  var pQuery = "id:" + pSerialNumber;
  var pResults = listChromeOS(pCustomerId, pQuery)
  for (const pResource of pResults) {
    var pDeviceId = pResource.deviceId;
    var pDevice = { commandType: pCommandType, payload: "" };

    //　デバイスにコマンドを投入
    var pResult = AdminDirectory.Customer.Devices.Chromeos.issueCommand(pDevice, pCustomerId, pDeviceId);
  }
}

//　デバイスの所属組織単位を移動する。
//　pDeviceId：
//　pOrgUnitPath：移動先の組織単位
function moveDeviceToOU(pSerialNumber, pOrgUnitPath)
{
  //　
  var pCustomerId = "my_customer";  //　my_customerは、事前定義済みのエイリアス
  var pQuery = "id:" + pSerialNumber;
  var pResults = listChromeOS(pCustomerId, pQuery)
  for (const pResource of pResults) {
    var pResourceId = pResource.deviceId;

    //　リクエスト本文を作成
    var pChromeOsDeviceAction = {
     deviceIds: pResourceId
    }

    //　デバイスにコマンドを投入
    var pResult = AdminDirectory.Chromeosdevices.moveDevicesToOu(pChromeOsDeviceAction, pCustomerId, pOrgUnitPath);
    console.log("moveDeviceToOU() ResourceId:" + pResourceId)
  }



















}