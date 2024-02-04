import Person from './person';
import Installment from './installment';
import Transaction from './transaction';

Person.hasMany(Transaction);
Transaction.belongsTo(Person);

Transaction.hasMany(Installment);
Installment.belongsTo(Transaction);

export { Person, Installment, Transaction };
