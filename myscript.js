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
  var selected_user = document.getElementById("user-contact");
  document.getElementById("'" + receiver + "'").style.display = "none";
  selected_user.innerHTML += `<li><button id="'${receiver}'" >${receiver}</li>`;
  getData();
  document.getElementById("messages-received").innerHTML = "";
}

var db = firebase.database();
db.ref("Messages/" + userName).set({
  message: "logged in as " + userName,
});

//--------------------send a message---------------------//

function saveMessage() {
  var message = document.getElementById("message-sent").value;
  db.ref("Messages/" + receiver + "/" + userName).update({
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
var p = 0;
//---------------to get sent meessage ------------------------//
function getSentData() {
  console.log(userName);
  var html;
  var user_ref = db.ref("Messages/" + receiver + "/" + userName);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    console.log(p);
    p++;
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

    var contactHtml = "",
      userHtml = "";

    for (let i = 0; i < users.length; i++) {
      if (users[i] === userName) {
        userHtml += `<li>`;

        userHtml += users[i] + "(You)";
      } else {
        contactHtml += `<li><button id="'${users[i]}'" onclick="selectUser('${users[i]}')">`;

        contactHtml += users[i];
      }
      contactHtml += "</button></li>";
      userHtml += "</li>";
    }
    document.getElementById("contact-list").innerHTML = contactHtml;
    document.getElementById("user-contact").innerHTML = userHtml;
  });
}
