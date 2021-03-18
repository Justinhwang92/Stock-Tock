import Parse from "parse/react-native.js";
Parse.initialize("jiM3dxKMrJoyJ3OFSOvKjkNVlWCfJ3GsNknSuqsf","cuRUV83XrqhpyKKMzc5UnHTWxQLmcQSA7lDjSx6N");
Parse.serverURL = 'https://parseapi.back4app.com/';


const createAccount = async (username, password) => {

const Account = Parse.Object.extend("Account");
const account  = new Account()
  account.set("username", username);
  account.set("password", password);

  try{
    let result = await account.save()
    alert('New object created with objectId: ' + result.id);
  }catch(error){
      alert('Failed to create new object, with error code: ' + error.message);
  }
}

const confirmAccount = async (username, password) => {
  const Account = Parse.Object.extend("Account");
  const query = new Parse.Query(Account);
  try 
  {
    query.equalTo("username", username)
    await query.first().then(function(response)
    {
      const name = response.get("username");
      const pass = response.get("password");
      if((username === name) && (password === pass))
      {
        let followed = response.get("followed");
        alert(`Username: ${name} Password: ${pass} Followed: ${followed}`);
        return followed;
      }
      else
        return false;
    })
  } catch (error) {
      alert(`User does not exist`);
      return false;
  }
}

module.exports = {createAccount, confirmAccount}