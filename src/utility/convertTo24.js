function convertTo12HourFormat(time24) {
    // Split the input time string into hours and minutes
    let [hours, minutes] = time24.split(':').map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? 'م' : 'ص';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Return formatted time
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default convertTo12HourFormat