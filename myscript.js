var mainApp = {};
let userName = null,
  receiver = null;
(function () {
  var firebase = app_fireBase;
  var uid = null;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log("logged in as " + user.displayName);
      userName = user.displayName;
      // console.log(userName);

      uid = user.uid;
    } else {
      uid = null;
      //redirect to login page
      window.location.replace("login.html");
    }
    getContacts();
  });
  //----logount funtion---------//
  function logOut() {
    firebase.auth().signOut();
  }
  mainApp.logOut = logOut;
})();

//---------------------set the receiver--------------------//
function selectUser(user) {
  receiver = user;
  document.getElementById("messages-received").innerHTML = "";

  getData();
}

var db = firebase.database();
db.ref("Messages/" + userName).set({
  message: "logged in as " + userName,
});

//--------------------send a message---------------------//

function saveMessage() {
  var message = document.getElementById("message-sent").value;
  db.ref("Messages/" + receiver + "/" + userName).set({
    sender: userName,
    message: message,
  });
  getSentData();
  return false;
}

//-------------get message received-------------------//

function getData() {
  console.log(userName);

  var user_ref = db.ref("Messages/" + userName + "/" + receiver);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    console.log(data);

    var html = "";
    html += "<li>";
    html += data.sender + " : " + data.message;
    html += "</li>";
    document.getElementById("messages-received").innerHTML += html;
  });
}

//---------------to get sent meessage ------------------------//
function getSentData() {
  console.log(userName);
  var html;
  var user_ref = db.ref("Messages/" + receiver + "/" + userName);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    console.log(data);

    html = "";
    html += "<li>";
    html += "You" + " : " + data.message;
    html += "</li>";
    document.getElementById("messages-received").innerHTML += html;
  });
}

//--------------------getting the available contacts to send messsage-------------------//

function getContacts() {
  var temp = "";
  var user_ref = db.ref("Messages");
  user_ref.on("value", function (snapshot) {
    var users = Object.getOwnPropertyNames(snapshot.val());
    // console.log("users are: " + users);
    for (let j = 0; j < users.length; j++) {
      if (users[j] === userName) {
        temp = users[0];
        users[0] = users[j];
        users[j] = temp;
      }
    }
    var html = "";

    for (let i = 0; i < users.length; i++) {
      html += `<li><button onclick="selectUser('${users[i]}')">`;
      if (users[i] === userName) {
        html += users[i] + "(You)";
      } else {
        html += users[i];
      }
      html += "</button></li>";
    }
    document.getElementById("contact-list").innerHTML = html;
  });
}
