export const formatNumber = (number) => {
    const formattedNumber = number ? parseInt(number).toLocaleString(undefined) : 0
    return formattedNumber
}

export const isDecimal = (number) => {
    return number % 1 !== 0
}