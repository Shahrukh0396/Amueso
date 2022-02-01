import { google } from 'googleapis';

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: 'http://182262981073-uga3b3m0aef91no72ap00ung2oupc557.apps.googleusercontent.com/', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: "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", // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'https://your-website.com/google-auth' // this must match your google api settings
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/
/*************/


/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
 function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */

function urlGoogle() {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
 function getGoogleAccountFromCode(code) {
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  const auth = createConnection();
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({ userId: 'me' });
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens,
  };
}