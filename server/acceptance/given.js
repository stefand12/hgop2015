/*
 * Fékk mikla aðstoð við þetta frá einum úr áfanganum, en aðlagaði þetta að mínu eftir þörfum.
 * Ég hafði ekki kunnáttuna í að útfæra þetta sjálfur
 */

function given () {

  var acceptanceUrl;
  var should = require('should');
  var request = require('supertest');
  var q = require('q');

  //var acceptanceUrl = process.env.ACCEPTANCE_URL;
  acceptanceUrl = require('../app');

  // Wrap a single command in a promise and execute it
  function executeCommand(command) {
    var req;
    var deferred = q.defer();
    req = request(acceptanceUrl);
    //noinspection JSUnresolvedFunction
    req.post('/api/' + command.command)
      .type('json')
      .send(command)
      .end(function(err, res)  {
        if (err) {
          console.error('Error posting commmand "' + command.command + '": ', err);
          deferred.reject(err);
        }
        deferred.resolve(res);
      });
    return deferred.promise;
  }

  // Takes a list of commands and executes them sequentially
  function executeCommands(commands) {
    return commands.reduce(function(promise, command) {
      return promise.then(function(result) {
        return executeCommand(command, result);
      });
    }, q());
  }

  return function given(user) {
    var givenAPI;
    givenAPI = {
      'condition': {
        'event': '',
        'gameID': user.getCommand().gameID,
        'gameName': user.getCommand().gameName,
        'winnerName': ''
      },
      'commands': [user.getCommand()],
      'state': {
        'gameID': user.getCommand().gameID,
        'ownerName': user.getUserName(),
        'gameName': user.getCommand().gameName,
        'currentUser': user,
        'nextPlayer': 'X'
      },
      'expect': function (event) {
        givenAPI.condition.event = event;
        return givenAPI;
      },
      'withName': function (gameName) {
        givenAPI.condition.gameName = gameName;
        return givenAPI;
      },
      'isOk': function (done) {
        var expectedEvent = {
          "id": "1337",
          "gameID": givenAPI.state.gameID,
          "event": givenAPI.condition.event,
          "userName": givenAPI.state.currentUser.getUserName(),
          "gameName": givenAPI.condition.gameName,
          "timeStamp": "2017.12.02T10:29:44",
          "whosTurn": givenAPI.state.nextPlayer
        };

        executeCommands(givenAPI.commands)
          .then(function () {
            //noinspection JSUnresolvedFunction
            request(acceptanceUrl)
              .get('/api/gameHistory/' + givenAPI.state.gameID)
              .expect(200)
              .expect('Content-Type', /json/)
              .end(function (err, res) {
                if (err) return done(err);
                //noinspection JSUnresolvedFunction
                res.body.should.be.instanceof(Array);
                //noinspection JSUnresolvedFunction
                should(res.body.pop()).eql(expectedEvent);
                done();
              });
          });
      }
    };

    return givenAPI;
  }
}

module.exports.given = given;