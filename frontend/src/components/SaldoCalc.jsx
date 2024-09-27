import React from 'react'

const SaldoCalc = ({ name, spendings }) => {
    const calculateSaldo = (() => {
        let result = 0
        spendings.forEach(spending => {
            if (spending.to.includes(name)) {
                result -= spending.amount / spending.to.length
            }
            if (spending.from === name) {
                result += spending.amount
            }
        });

        return result.toFixed(2)
    })

    return (
        <div>{calculateSaldo()} €</div>
    )
}

export default SaldoCalc