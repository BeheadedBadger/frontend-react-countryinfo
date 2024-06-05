export function convertToMillions (number) {
    let result;
    result = number.replace(/,/g, "");
    result = result / 1000000
    return result.toFixed();
}