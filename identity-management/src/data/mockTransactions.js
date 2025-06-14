// mockTransactions.js
import { faker } from '@faker-js/faker';

const transactionTypes = ['Sent', 'Received'];
const methods = ['Credit Card', 'PayPal', 'Wire Transfer', 'Bank Transfer', 'Debit Card', 'Gpay'];

const createTransaction = (id) => {
  const type = faker.helpers.arrayElement(transactionTypes);
  const method = faker.helpers.arrayElement(methods);
  const amount = `${type === 'Received' ? '+' : '-'}${faker.finance.amount(10, 2000, 2)} USD`;
  const person = faker.person.fullName();
  const activity = `${type} money ${type === 'Received' ? 'from' : 'to'} ${person}`;
  const date = faker.date.recent({ days: 30 }).toISOString().split('T')[0];

  return {
    id,
    type,
    amount,
    method,
    status: 'Success', // Always start with success
    activity,
    person,
    date,
  };
};

const transactions = Array.from({ length: 30 }, (_, i) => createTransaction(i + 1));

export default transactions;
