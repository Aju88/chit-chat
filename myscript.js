var mainApp={};
let userName = null,
  receiver = null,
  previous_contact = null;
var message = "";
var users = "";
var selectedArray = [],
  contactArray = [];
var contactHtml = "",
  userHtml = "";
(function() {
  var firebase = app_fireBase;
  var uid = null;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
      // User is signed in.
      console.log("logged in as " + user.displayName);
      userName = user.displayName;
      if (userName != null) {
        db.ref("Messages/" + userName).set({
          message: "logged in as " + userName,
        });
      }
      uid = user.uid;
    } else {
      uid = null;
      //redirect to login page
      window.location.replace("index.html");
    }
    getContacts();
  });
  //------------------logount funtion--------------------//
  function logOut() {
    firebase.auth().signOut();
  }
  mainApp.logOut = logOut;
})();

//---------------------set the receiver--------------------//
function selectUser(user) {
  console.log(users);
  var position = users.indexOf(user);
  console.log(position);
  var selected;
  for (i = 0; i < users.length; i++) {
    if (user === users[i]) {
      selected = users[i];
      users.splice(i, 1);
      i--;
      if (previous_contact != null) {
        users.unshift(previous_contact);
      }
    }
  }
  var selected_user = document.getElementById("selected-contact"); //in messaging list
  selected_user.innerHTML = `<li id="selected">${selected}</li>`;
  showContacts(users);
  previous_contact = user;
  receiver = user;
  document.getElementById("messages-received").innerHTML = ""; //to clear the messages
  getData(); //getting messages received from the selected contact
}

var db = firebase.database();

//--------------------send a message---------------------//

var input = document.getElementById("message-sent");
//enter key to send
input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    saveMessage();
    input.value = "";
  }
});
function saveMessage() {
  message = input.value;
  db.ref("Messages/" + receiver + "/" + userName).update({
    sender: userName,
    message: message,
  });
  console.log("repeat");
  getSentData();
  input.value = "";
}

//------------------get message received-------------------//

function getData() {
  console.log(userName);

  var user_ref = db.ref("Messages/" + userName + "/" + receiver);
  user_ref.on("value", (snapshot) => {
    var data = snapshot.val();
    if (data) {
      var html = "";
      html += "<li>";
      html += data.message;
      html += "</li>";
      document.getElementById("messages-received").innerHTML += html;
    }
  });
}
var p = 0;

//---------------to get sent meessage ------------------------//
function getSentData() {
  var html;
  var user_ref = db.ref("Messages/" + receiver + "/" + userName);
  user_ref.once("value", (snapshot) => {
    var data = snapshot.val();
    p++;
    html = "";
    html += `<li class="sent">`;
    html += data.message;
    html += "</li>";
    document.getElementById("messages-received").innerHTML += html;
  });
}

//--------------------getting the available contacts to send messsage-------------------//

function getContacts() {
  var user_ref = db.ref("Messages");
  user_ref.once("value", function (snapshot) {
    users = Object.getOwnPropertyNames(snapshot.val());
    showContacts(users);
  });
}

function showContacts(userList) {
  contactHtml = "";
  for (let i = 0; i < userList.length; i++) {
    if (userList[i] === userName) {
      userHtml += `<li id="logged-user">`;
      console.log("its here");

      userHtml += userList[i] + "(You)";
      userList.splice(i, 1);
      i--;
    } else {
      contactHtml += `<li id="'${userList[i]}'"><button  onclick="selectUser('${userList[i]}')">`;

      contactHtml += userList[i];
    }
    contactHtml += "</button></li>";
    userHtml += "</li>";
  }
  document.getElementById("contact-list").innerHTML = contactHtml;
  document.getElementById("user-contact").innerHTML = userHtml;
}
