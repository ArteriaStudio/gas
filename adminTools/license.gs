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
