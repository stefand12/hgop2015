/*
* Fékk mikla aðstoð við þetta frá einum úr áfanganum, en aðlagaði þetta að mínu eftir þörfum.
* Ég hafði ekki kunnáttuna í að útfæra þetta sjálfur
*/

function user () {

  return function user(userName) {
    var userApi;
    userApi = {
      'state': {
        'command': {},
        'gameID': ''
      },
      'createsGame': function (gameID) {
        userApi.state.gameID = gameID;
        userApi.state.command = {
          id: "1337",
          gameID: gameID,
          command: "createGame",
          userName: userName,
          gameName: gameID,
          timeStamp: "2017.12.02T10:29:44",
          whosTurn: 'X'
        };
        return userApi;
      },
      'gameNamed': function (gameName) {
        userApi.state.command.gameName = gameName;
        return userApi;
      },
      'getCommand': function () {
        return userApi.state.command;
      },
      'getGameId': function () {
        return userApi.state.gameID;
      },
      'getUserName': function () {
        return userName;
      },
      'joinsGame': function (gameID) {
        userApi.state.gameID = gameID;
        userApi.state.command = {
          id: "1337",
          gameID: gameID,
          command: "JoinGame",
          userName: userName,
          gameName: gameID,
          timeStamp: "2017.12.02T10:29:44",
          whosTurn: 'X'
        };
        return userApi;
      },
      'makesMove': function (place) {
        userApi.state.place = place;
        userApi.state.command = {
          id:"1337",
          command:"makeMove",
          place: place,
          symbol: 'X',
          userName : userName,
          gameID: userApi.state.gameID,
          timeStamp: "2017.12.02T10:29:44"
        };
        return userApi;

      }
    };
    return userApi;
  }
}

module.exports.user = user;
