export function getHours(seconds) {
    return Math.floor(seconds / 3600);
}
export function getMinutes(seconds) {
    return Math.floor((seconds % 3600) / 60);
}
export function getSeconds(seconds) {
    return seconds % 60;
}


// Format the time as hh:mm:ss - hh.XX
export function formatTime(seconds, elapsedTime = null) {
    if(elapsedTime !== null) {
        seconds = seconds + elapsedTime;
    }
    // Calculate hours, minutes, and seconds
    const hours = getHours(seconds);
    const minutes = getMinutes(seconds);
    const remainingSeconds = getSeconds(seconds);

    // Format time as hh:mm:ss
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    // Calculate hours rounded up to the closest quarter-hour
    const roundedHours = Math.ceil((seconds / 3600) * 4) / 4;
    const formattedRoundedHours = roundedHours.toFixed(2);

    // Combine formatted time and rounded hours
    return `${formattedTime} - ${formattedRoundedHours}`;
}
