/*функция, которая проверяет введенную дату рождения по следующим параметрам: дата и месяц 
сущетсвуют, год не больше текущего, и не меньше 1910. Также проверяется 
больше ли 18 лет, если нет, то в выдаче кредита будет отказано*/
function validateBirthDate(dateArray) {
    let birthDay = dateArray[0][0] == 0 ? dateArray[0][1] : dateArray[0];
    let birthMonth = dateArray[1][0] == 0 ? dateArray[1][1] : dateArray[1];
    let birthYear = dateArray[2];
    let nowYear = new Date().getFullYear();
    let nowMonth = new Date().getMonth() + 1;
    let nowDay = new Date().getDate();
    let age;

    if (birthDay < 1 || birthDay > 31 || birthMonth < 1 || birthMonth > 12 || birthYear > nowYear || birthYear < 1910) {
        return 'wrong date'
    } else if (birthMonth < nowMonth) {
        age = nowYear - birthYear;
    } else if (birthMonth > nowMonth) {
        age = nowYear - birthYear - 1;
    } else {
        if (birthDay > nowDay) {
            age = nowYear - birthYear - 1;
        } else {
            age = nowYear - birthYear;
        }
    }

    return age >= 18 ? 'right age' : 'wrong age'
}

module.exports = validateBirthDate
