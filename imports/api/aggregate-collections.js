import { Mongo } from 'meteor/mongo';

const CustomersWithInstallers = {};

CustomersWithInstallers.collection = new Mongo.Collection('customersWithInstallers');

export { CustomersWithInstallers }; // eslint-disable-line
