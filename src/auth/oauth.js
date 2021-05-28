'use strict';

require('dotenv').config();
const { response } = require('express');
const superagent = require('superagent');
const User = require('./models/users');

const tokenServerUrl = 'https://graph.facebook.com/v10.0/oauth/access_token?'
const remoteAPI = 'https://graph.facebook.com/me';;

const CLIENT_ID = process.env.CLIENT_FB_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET_FB;
const REDIRECT_URI = process.env.REDIRECT_URI;

async function exchangeCodeForToken(code){
    try {
        const tokenRes = await superagent.get(tokenServerUrl).query({
            client_id:CLIENT_ID,
            redirect_uri:REDIRECT_URI,
            client_secret:CLIENT_SECRET,
            code:code
        }) 
        console.log(tokenRes.body)
        const accessToken = tokenRes.body.access_token;
        return accessToken;

    } catch (error) {
        console.error(error)
    }
}

async function getRemoteUserInfo(token){
    try {

        const userRes = await superagent.get(remoteAPI)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
        const user = userRes.body
        console.log('user info', user)
        return user
    } catch (error) {
        console.error(error)
    }
}

async function getUser(remoteUser){
    const user = {
        username: remoteUser.name,
        password: 'nothing'
    }
    
    const userObj = new User(user)
     const userDoc = await userObj.save()
    const token = userDoc.token
    return [userDoc, token];
    
    
}
module.exports = async (req,res,next) =>{
        console.log('we are here')
    try {
        const code = req.query.code;
        console.log(code)
        const remoteToken = await exchangeCodeForToken(code);
        console.log('after token')
        const remoteUser = await getRemoteUserInfo(remoteToken)
        const [user,token] = await getUser(remoteUser)
        console.log('after save', user ,token)
        req.user = user;
        req.token = token
        next()
    } catch (error) {
        next(error.message)
    }
    }



// function checkLoginState() {
//     FB.getLoginStatus(function(response) {
//         console.log(response)
//       statusChangeCallback(response);
//     });
//   }
  
// //   require('dotenv').config();
  
//       window.fbAsyncInit = function() {
//         FB.init({
//           appId      : '948670909282442',
//           cookie     : true,
//           xfbml      : true,
//           version    : v1
//         });
          
//         FB.AppEvents.logPageView();   
          
//       };
    
//       (function(d, s, id){
//          var js, fjs = d.getElementsByTagName(s)[0];
//          if (d.getElementById(id)) {return;}
//          js = d.createElement(s); js.id = id;
//          js.src = "https://connect.facebook.net/en_US/sdk.js";
//          fjs.parentNode.insertBefore(js, fjs);
//        }(document, 'script', 'facebook-jssdk'));
  
  
//        function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
//       console.log('statusChangeCallback');
//       console.log(response);                   // The current login status of the person.
//       if (response.status === 'connected') {   // Logged into your webpage and Facebook.
//         testAPI();  
//       } else {                                 // Not logged into your webpage or we are unable to tell.
//         document.getElementById('status').innerHTML = 'Please log ' +
//           'into this webpage.';
//       }
//     }
  
  
//     function checkLoginState() {               // Called when a person is finished with the Login Button.
//       FB.getLoginStatus(function(response) {   // See the onlogin handler
//         statusChangeCallback(response);
//       });
//     }
  
  
//     window.fbAsyncInit = function() {
//       FB.init({
//         appId      : '{app-id}',
//         cookie     : true,                     // Enable cookies to allow the server to access the session.
//         xfbml      : true,                     // Parse social plugins on this webpage.
//         version    : '{api-version}'           // Use this Graph API version for this call.
//       });
  
  
//       FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
//         statusChangeCallback(response);        // Returns the login status.
//       });
//     };
   
//     function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
//       console.log('Welcome!  Fetching your information.... ');
//       FB.api('/me', function(response) {
//         console.log(response)
//         console.log('Successful login for: ' + response.name);
//         document.getElementById('status').innerHTML =
//           'Thanks for logging in, ' + response.name + '!';
//       });
//       return response;
//     }



//  <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0&appId=948670909282442&autoLogAppEvents=1" nonce="AmnDr38D"></script>
