//　Written by Rink(アルテリア工房)

//　サービスモジュール
//　AdminDirectory：Admin SDK API

//　ディレクトリからユーザーを一覧する。
function listAllUsers(domainName, pQuery) {
  var pResults = new Array;
  let pageToken;
  let page;
  do {
    page = AdminDirectory.Users.list({
      domain: domainName,
      orderBy: 'givenName',
      maxResults: 100,
      pageToken: pageToken,
      query: pQuery,
    });
    const users = page.users;
    if (!users) {
      console.log('No users found.');
      return;
    }
    // Print the user's full name and email.
    for (const user of users) {
      pResults.push(user.primaryEmail);
      console.log('%s (%s)', user.name.fullName, user.primaryEmail);
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return(pResults);
}

//　組織単位を変更する。
function moveOrgUnit(primaryEmail, newOrgUnit)
{
  try {
    //　ディレクトリから指定のユーザーを取得する。
    //var pUser = AdminDirectory.Users.get(primaryEmail)
    //console.log(pUser)
    
    //　リクエスト本文を作成
    var pUser = {
      orgUnitPath: newOrgUnit
    }
    var pResult = AdminDirectory.Users.update(pUser, primaryEmail)
    console.log("email:" + pResult.primaryEmail + ", id: " + pResult.id)
  } catch(e) {
    console.log('Failed with an error %s ', e.message);
    return(false);
  }

  return(true);
}

//　アカウント状態を変更する。
//　newStatus（!null：サスペンド）
function switchAccountStatus(primaryEmail, newStatus)
{
  //　リクエスト本文を作成
  var pUser = {
    suspended: false
  }
  if (newStatus != "") {
    pUser.suspended = true;
  } else {
    pUser.suspended = false;
  }

  var pResult = AdminDirectory.Users.update(pUser, primaryEmail)
  console.log("email:" + pResult.primaryEmail + ", id: " + pResult.id)
}

//　ディレクトリからChromeOSデバイスを一覧する。
//（戻り値）デバイス識別子の配列
function listChromeOS(pCustomerId, pQuery) {
  var pResults = new Array;
  let pageToken;
  let pPage;

  do {
    pPage = AdminDirectory.Chromeosdevices.list(pCustomerId,{
      maxResults: 10,
      pageToken: pageToken,
      query: pQuery,
    });
    const pChromeOsDevices = pPage.chromeosdevices;
    if (!pChromeOsDevices) {
      console.log('No devices found.');
      return;
    }
    // Print the user's full name and email.
    for (const pChromeOsDevice of pChromeOsDevices) {
      pResults.push(pChromeOsDevice);
    }
    pageToken = pPage.nextPageToken;
  } while (pageToken);
  return(pResults);
}
