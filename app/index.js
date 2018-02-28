import document from "document";

//STEPS - ELEVATION
import userActivity from "user-activity";

let stepGoalField = document.getElementById('stepGoal');
let currentStepsField = document.getElementById('currentSteps');
let levelText = document.getElementById("level");
let xpBar = document.getElementById("xp_bar");

function updateSteps() {
  currentStepsField.text = (userActivity.today.local.steps || 0)  + " /";
  levelText.text = "Lv" + userActivity.today.local.elevationGain;

  if  (userActivity.goals.steps != 0) {
    let currentSteps = (userActivity.today.local.steps || 0);
    let stepPercentage = currentSteps / userActivity.goals.steps;
    xpBar.width = (currentSteps < userActivity.goals.steps)
      ? stepPercentage * 340
      : 340;    
  }
}

stepGoalField.text = userActivity.goals.steps || 0;

//BATTERY
import { battery } from "power";
let batteryField = document.getElementById('battery');
let batteryFieldSh = document.getElementById('batteryShadow');
let batteryBar = document.getElementById('shield_bar');

batteryField.text = Math.floor(battery.chargeLevel);

function updateBattery() {
  let batteryPercentage = Math.floor(battery.chargeLevel);
  
  batteryField.text = batteryPercentage;
  batteryFieldSh.text = batteryPercentage;
  
  if (batteryPercentage != 0) {
    // batteryBar.width = (batteryPercentage / 100) * 171;
    batteryBar.x = 39 - (171 - ((batteryPercentage / 100) * 171));
  }
}

updateBattery();
battery.onchange = () => updateBattery();

//DATE
let date = document.getElementById('date');
let dayOfWeek = document.getElementById('dayOfWeek');

let monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

let dayNames = [
    "Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

function updateDate() {
  let dayInfo = new Date();
  let day = dayInfo.getDay();
  let month = dayInfo.getMonth();
  let dayOfMonth = dayInfo.getDate();
  
  date.text = `${monthNames[month]} ${dayOfMonth}`;
  dayOfWeek.text = `${dayNames[day]}`; 
}

//CLOCK
import clock from "clock";
import * as util from "../common/utils";

clock.granularity = "minutes";

let time = document.getElementById("time");
let timeSh = document.getElementById("timeShadow");

function updateClock() {
  let today = new Date();
  let hours = today.getHours();
  hours = hours % 12;
  hours = hours ? util.zeroPad(hours) : 12;
  let mins = util.zeroPad(today.getMinutes());

  time.text = `${hours}:${mins}`;
  timeSh.text = `${hours}:${mins}`;
  
  updateDate();
}

clock.ontick = () => updateClock();

//HEART RATE MONITOR
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

var hrm = new HeartRateSensor();
let hrLabel = document.getElementById("hrm");
let hrLabelSh = document.getElementById("hrmShadow");
let hrLevel = document.getElementById("hrLevel");
let hrBar = document.getElementById("health_bar");
let hrmLastTimeStamp = 0;

hrLabel.text = "??";
let hrCustomZoneNames = {
  'out-of-range': 'Relaxed',
  'fat-burn': 'Fat Burn',
  'cardio': 'Cardio',
  'peak': 'Peak'
};

hrm.onreading = function(read) {
  let heartRate = hrm.heartRate;
  let hrZone = user.heartRateZone(heartRate);
  
  hrLabel.text = heartRate;
  hrLabelSh.text = heartRate;
  hrLevel.text = hrCustomZoneNames[`${hrZone}`];
  hrBar.x = 39; //207
  
  hrm.stop();
}

hrm.onerror = function() {
  hrLabel.text = '??';
}

hrm.start();

//INTERVAL
import { display } from "display";
setInterval(intervalFunction, 2500);

function intervalFunction() {
  if (display.on) {
    hrm.start();
    updateSteps();

    if (hrmLastTimeStamp == hrm.timestamp) {
        hrLevel.text = "Couch Potato";
        hrBar.x = -168;
    } else {
        hrmLastTimeStamp = hrm.timestamp; 
    }
  }
}

display.onchange = function(event) {
  if (display.on) {
    hrm.start();
  } else {
    hrm.stop();
  }
};
