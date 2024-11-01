﻿//　Written by Rink(アルテリア工房)

//　サービスモジュール
//　AdminLicenseManager：Enterprise License Manager API

//　指定ユーザーから指定した製品、SKUのライセンスを削除する。
function removeLicenseAssignment(productId, skuId, userId) {
  try {
    const results = AdminLicenseManager.LicenseAssignments.remove(productId, skuId, userId)
  } catch (e) {
    // TODO (developer) - Handle exception.
    console.log('Failed with an error %s ', e.message);
  }
}

//　指定ユーザーから指定した製品、SKUのライセンスを削除する。
function grantLicenseAssignment(productId, skuId, userId) {
  try {
    const results = AdminLicenseManager.LicenseAssignments.insert({userId: userId}, productId, skuId)
  } catch (e) {
    // TODO (developer) - Handle exception.
    console.log('Failed with an error %s ', e.message);
  }
}

//　指定ユーザーが指定した製品、SKUのライセンスを所持しているか確認する。
function getLicenseAssignment(productId, skuId, userId) {
  try {
    const results = AdminLicenseManager.LicenseAssignments.get(productId, skuId, userId)
  } catch (e) {
    // TODO (developer) - Handle exception.
    //console.log('Failed with an error %s ', e.message);
    return(false)
  }
  return(true)
}

//　組織単位を変更する。
function moveOrgUnit(primaryEmail, newOrgUnit)
{
  try {
    //　リクエスト本文を作成
    var pUser = {
      orgUnitPath: newOrgUnit
    }
    var pResult = AdminDirectory.Users.update(pUser, primaryEmail)
    console.log("email:" + pResult.primaryEmail + ", id: " + pResult.id)
  } catch(e) {
    console.log('Failed with an error %s ', e.message);
  }
}
