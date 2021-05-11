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
}

var db = firebase.database();

//--------------------send a message---------------------//
function saveMessage() {
  var message = document.getElementById("message-sent").value;
  db.ref("Messages/" + receiver + "/" + userName)
  .set({
    sender: userName,
    message: message,
  });

  getData();
  return false;
}

//-------------get message from database---------------//
function getData() {
  console.log(userName);

  var user_ref = db.ref("Messages/" + receiver + "/" + userName);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    console.log(data);

    var html = "";
    html += "<li>";
    html += userName + " : " + data.message;
    html += "</li>";
    document.getElementById("messages-received").innerHTML += html;
  });
}

//--------------------getting the availabel contacts to send messsage-------------------//

function getContacts() {
  var user_ref = db.ref("Messages");
  user_ref.on("value", function (snapshot) {
    var users = Object.getOwnPropertyNames(snapshot.val());
    console.log("users are: " + users);
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
