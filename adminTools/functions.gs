//　型式検査：メールアドレス
function isMailAddress(primaryEmail)
{
  const regex = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

  return(regex.test(primaryEmail));
}

//　型式検査：日付
function isDateFormat(dateFormat)
{
  try {
    console.log(typeof(pExpireDate))
    var result = Utilities.parseDate(dateFormat)
    console.log("isDateFormat: " + result)
  } catch(e) {
    return(false);
  }

  return(true);
}
