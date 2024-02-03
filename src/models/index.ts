import { Person } from './Person';
import { Installment } from './Installment';
import { Transaction } from './Transaction';

Person.hasMany(Transaction);
Transaction.belongsTo(Person);

Transaction.hasMany(Installment);
Installment.belongsTo(Transaction);

export { Person, Installment, Transaction };
