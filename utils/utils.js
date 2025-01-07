import { Dimensions } from "react-native";

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
//export default blurhash;
export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getRoomId = (user1, user2) => {
  const sortIds = [user1, user2].sort();
  return sortIds.join("-");
};

export const formatDate = (date) => {
  //console.log(date);
  if (!date) return;
  const today = new Date();
  const d = new Date(date);
  const month = date.toLocaleString("default", { month: "short" }); //d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  if (today.getDate() === day && today.getMonth() === d.getMonth()) {
    return `Today ${formatAMPM(d)}`;
  }
  if (
    today.getDate() - 1 === day &&
    today.getMonth() === d.getMonth() &&
    today.getFullYear() === d.getFullYear()
  ) {
    return `Yesterday ${formatAMPM(d)}`;
  }
  if (today.getFullYear() === d.getFullYear()) {
    return ` ${day} ${month}, ${formatAMPM(d)}`;
  }

  if (today.getFullYear() !== d.getFullYear()) {
    return ` ${day} ${month} ${year}, ${formatAMPM(d)}`;
  }
  return ` ${day} ${month} ${year}, ${formatAMPM(d)}`;
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const { width: deviceWith, height: deviceHeight } = Dimensions.get("window");
export const hp = (percent) => {
  return (percent * deviceHeight) / 100;
};
export const wp = (percent) => {
  return (percent * deviceWith) / 100;
};

export const getInitials = (name) => {
  const [firstName, lastName] = name.split(" ");
  return firstName.charAt(0) + lastName.charAt(0);
};
