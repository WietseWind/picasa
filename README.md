# Fork - for the browser (using Fetch api)

Optional: to use [your own CORS proxy](https://github.com/Rob--W/cors-anywhere): add before `new Picasa()`:

```
window.CORSPROXY = 'https://my-proxy.com'
```

Fork from: [https://github.com/esteban-uo/picasa](https://github.com/esteban-uo/picasa)

## Use using a token from the Google Javascript API:

```
window.CORSPROXY = 'https://cors-ams.upload-pictures.net'

const Picasa = require('picasa')
const picasa = new Picasa()

window.gapi.load('auth2', () => {
    window.gapi.auth2.init(this.gSignInParams).then((gauth) => {
        if (gauth.isSignedIn.get()) {
            console.log('Logged In')

            picasa.getAlbums(window.gapi.client.getToken().access_token, null, (error, albums) => {
                if (error) return
                console.log(albums)
            })
        } else {
            console.log('Not logged in')
        }
    })
})
```

---

A simple **Google Photos**, formally **Picasa** Web Albums client (2.0) for nodejs (>= 4.8.7). Includes Auth helpers.

<img src="https://www.wptribe.net/wp-content/uploads/2013/01/Picasa_Logo.jpg" />

### Install
```
$ yarn add  picasa
```
or
```
$ npm install --save picasa
```

### Usage
```js
const Picasa = require('picasa')

const picasa = new Picasa()
```

### Docs
API for Photos, Albums and Auth can be found [here](./docs). Please check out also the examples dir for more detailed examples. Rename `config.example.json` to `config.json` and add your own config data.

### Auth

To get an access token follow the next flow:

1.Get the Auth URL and redirect the user to it.

```js
// Get config here API Manager > Credentials https://console.developers.google.com/home/dashboard
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
}

const authURL = picasa.getAuthURL(config)
```

2.Google displays a consent screen to the user, asking them to authorize your application to request some of their data.

3.Google redirects a code to your redirectURI.

4.Use the code given as GET param in order to get an access token:

```js
// Get config here API Manager > Credentials https://console.developers.google.com/home/dashboard
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
  clientSecret : 'yourClientSecret'
}

picasa.getTokens(config, code).then(tokens => {
  /* use tokens.accessToken or tokens.refreshToken */
})
```

5.If you need to renew an expired `accessToken`, use the `refreshToken` with `picasa.renewAccessToken`:

```js
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
  clientSecret : 'yourClientSecret'
}

picasa.renewAccessToken(config, refreshToken).then(renewedAccessToken => {
  /* do something with renewedAccessToken */
})
```

Change Log
-------
***1.0.7*** Functions return a Promise if callback is not provided. Use `getTokens` if you want to use Promises instead `getAccessToken`.

***1.0.6*** Get album, Create Album, Renew access token added. Get Photos can get all photos from an album id or all.

Contributors
-------
Thanks to
[z1c0](https://github.com/z1c0), [hbakhtiyor](https://github.com/hbakhtiyor), [pauarge](https://github.com/pauarge), [wreuven](https://github.com/wreuven), [imrvelj](https://github.com/imrvelj), [jlengrand](https://github.com/jlengrand)

License
-------

MIT ©

---

Play around https://developers.google.com/oauthplayground/?code=4/usq8QmuezR3Au_0UKyj9-UXmf6Bw_ij8KFWgIziYbpM#

Picasa Docs https://developers.google.com/picasa-web/docs/2.0/developers_guide_protocol
