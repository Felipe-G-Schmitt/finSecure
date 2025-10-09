import React from 'react';

import '../styles/Balance.css';

const Balance = ({ transactions }) => {
    const { total, receita, despesa } = transactions.reduce(
        (acc, { transaction }) => {
            const value = parseFloat(transaction.value);
            if (transaction.type === 'receita') {
                acc.receita += value;
            } else {
                acc.despesa += value;
            }
            acc.total = acc.receita - acc.despesa;
            return acc;
        },
        { total: 0, receita: 0, despesa: 0 }
    );

    return (
        <div className="balance-container">
            <div className="balance-card card">
                <h4>Saldo Total</h4>
                <p className={total >= 0 ? 'receita' : 'despesa'}>
                    R$ {total.toFixed(2)}
                </p>
            </div>
            <div className="balance-card card">
                <h4>Receitas</h4>
                <p className="receita">R$ {receita.toFixed(2)}</p>
            </div>
            <div className="balance-card card">
                <h4>Despesas</h4>
                <p className="despesa">R$ {despesa.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default Balance;