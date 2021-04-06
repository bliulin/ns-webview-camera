/**
 * Calculates the Equated Monthly Installment
 * @param amount Total amount
 * @param interestRate The interest rate between 0 and 1
 * @param period Number of months
 */
export function equatedMonthlyInstallment(amount:number, interestRate:number, period:number)
{
    interestRate = interestRate / 12; // one month
    const number = Math.pow(1 + interestRate, period);
    var emi = (amount * interestRate * number)  / (number - 1);

    return Math.round(emi*100)/100;
}

/**
 * Calculate the 'scadentar' for a credit
 * @param amount Total amount
 * @param interestRate The interest rate between 0 and 1
 * @param period Number of months
 */
export function installments(amount, interestRate, period){
    let schedule = new Array(period);
    const monthlyRate=equatedMonthlyInstallment(amount, interestRate, period)
    const coefDobanda = interestRate/100/12

    for(let i = 0; i < period; i++){
        if (i === 0){
            schedule[i] = {
                luna:i+1,
                sold:amount,
                dobanda: Math.round(coefDobanda * amount * 100)/100
            }
            schedule[i].principal = monthlyRate - schedule[i].dobanda
            schedule[i].rata = monthlyRate
        } else if (i < period -1){
            schedule[i] = {
                luna:i+1,
                sold: Math.round((schedule[i-1].sold - schedule[i-1].principal)*100)/100
            }
            schedule[i].dobanda = Math.round(coefDobanda * schedule[i].sold * 100) / 100
            schedule[i].principal = Math.round((monthlyRate - schedule[i].dobanda) * 100) / 100
            schedule[i].rata = monthlyRate
        } else {
            schedule[i] = {
                luna:i+1,
                sold: Math.round((schedule[i-1].sold - schedule[i-1].principal)*100)/100
            }
            schedule[i].dobanda = Math.round(coefDobanda * schedule[i].sold * 100) / 100
            schedule[i].principal = schedule[i].sold
            schedule[i].rata = monthlyRate
        }
    }
    return schedule
}
