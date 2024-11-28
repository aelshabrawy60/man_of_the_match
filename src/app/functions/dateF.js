// timestampFunctions.js

export function getDay(firebaseTimestamp) {
    const date = firebaseTimestamp.toDate();  // Convert Firebase Timestamp to JavaScript Date
    
    // Extracting various components from the Date object
    const d = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // Months are 0-indexed, so we add 1
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds()
    };
    return `${d.month}-${d.day}`;
}
  
export function getTime(firebaseTimestamp) {
    const date = firebaseTimestamp.toDate();
    const d = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // Months are 0-indexed, so we add 1
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds()
    };
    const formattedMinute = String(d.minute).padStart(2, '0');
    return `${d.hour}:${formattedMinute}`;  // Convert Firebase Timestamp to JavaScript Date
}
  
export function getFullDate(firebaseTimestamp) {
    const date = firebaseTimestamp.toDate();  // Convert Firebase Timestamp to JavaScript Date
    
    // Extracting various components from the Date object
    const d = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // Months are 0-indexed, so we add 1
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds()
    };
    return `${d.year}-${d.month}-${d.day}`;
}