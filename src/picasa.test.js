'use strict'

const chai   = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const expect = chai.expect
chai.use(sinonChai)

const Picasa = require('./picasa')

describe('Picasa', () => {
  let picasa, stub

  const config = {
    clientId     : 'apps.google.com',
    redirectURI  : 'http://localhost',
    clientSecret : 'client_secretABC'
  }

  beforeEach(() => picasa = new Picasa())

  describe('getPhotos', () => {
    describe('on success', () => {
      const fakeSuccessBody = {
        "feed":{
          "entry":[
            {
              "id":{
                "$t":"https://picasaweb.google.com/data/entry/user/11111/albumid/1111/photoid/11111"
              },
              "published":{
                "$t":"2015-11-28T07:13:31.000Z"
              },
              "updated":{
                "$t":"2015-11-28T07:22:35.478Z"
              },
              "app$edited":{
                "$t":"2015-11-28T07:22:35.478Z"
              },
              "title":{
                "$t":"IMG_0327.JPG"
              },
              "summary":{
                "$t":""
              },
              "content":{
                "type":"image/jpeg",
                "src":"https://lh3.googleusercontent.com/-1111111/1111/11111/1111/IMG_0327.JPG"
              }
            }
          ]
        }
      }

      let photos

      beforeEach((done) => {
        stub = sinon.stub(picasa, 'executeRequest')
        stub.callsArgWithAsync(2, null, fakeSuccessBody)

        const accessToken = 'ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw'

        picasa.getPhotos(accessToken, { maxResults : 1 }, (error, photosResponse) => {
          expect(error).to.be.equals(null)
          photos = photosResponse

          done()
        })
      })

      afterEach(() => stub.restore())

      it('returns an array of photos', () => {
        expect(photos).to.be.an('Array')
      })

      it('returns a photo with its props', () => {
        expect(photos[0].title).to.be.equals('IMG_0327.JPG')
        expect(photos[0].content.src).to.contain('IMG_0327.JPG')
        expect(photos[0].content.type).to.be.equals('image/jpeg')
      })

      it('should make get request', () => {
        const firstArgument = stub.args[0][0]

        expect(firstArgument).to.be.eql('get')
      })

      it('should add header and prepared URL to request', () => {
        const secondArgument = stub.args[0][1]

        expect(secondArgument).to.be.eql({
          headers : { 'GData-Version': "2" },
          url     : "https://picasaweb.google.com/data/feed/api/user/default?alt=json&kind=photo&access_token=ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw&max-results=1"
        })
      })
    })
  })

  describe('getAuthURL', () => {
    it('returns valid URI', () => {
      expect(picasa.getAuthURL(config))
        .to.be.equals('https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2F&response_type=code&client_id=apps.google.com&redirect_uri=http%3A%2F%2Flocalhost')
    })
  })

  describe('getAccessToken', () => {
    beforeEach(() => {
      const fakeBody = {
        access_token : 'ya29.KwLDeXsw1jNAavZ8jEMFgikhDg_CnUX1oMr5RQUyeqTBf229YV4HzhhXvRgBBvFGqTqxdw',
        token_type   : 'Bearer',
        expires_in   : 3580
      }

      stub = sinon.stub(picasa, 'executeRequest')

      stub.callsArgWithAsync(2, null, fakeBody)
    })

    afterEach(() => stub.restore())

    it('returns access token response', (done) => {
      picasa.getAccessToken(config, '4/DxoCTw8Rf3tQAAW94h6lK7ioEjnu6K8kEqVZ0d-cRA8', (error, accessToken) => {
        expect(stub).to.have.been.calledWith('post', { url : 'https://www.googleapis.com/oauth2/v3/token?grant_type=authorization_code&code=4%2FDxoCTw8Rf3tQAAW94h6lK7ioEjnu6K8kEqVZ0d-cRA8&redirect_uri=http%3A%2F%2Flocalhost&client_id=apps.google.com&client_secret=client_secretABC' })

        expect(error).to.be.equal(null)
        expect(accessToken).to.be.equals('ya29.KwLDeXsw1jNAavZ8jEMFgikhDg_CnUX1oMr5RQUyeqTBf229YV4HzhhXvRgBBvFGqTqxdw')

        done()
      })
    })
  })
})
