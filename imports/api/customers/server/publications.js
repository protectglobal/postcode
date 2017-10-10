/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
// import { check } from 'meteor/check';
// import _ from 'underscore';
import Constants from '../../constants.js';
import CustomersCollection from '../collection.js';
import Users from '../../users/namespace.js';

//------------------------------------------------------------------------------
Meteor.publish('Customers.publications.getCustomersWithInstallers', function () {
  // Get current user.
  const curUserId = this.userId;

  // Make sure the user is logged in!
  if (!curUserId) {
    console.log('User is not logged in at Customers.publications.getCustomersWithInstallers');
    return this.ready();
  }

  // Is the account verified?
  if (!Users.apiBoth.isAccountVerified(curUserId)) {
    console.log('User account is not verified at Customers.publications.getCustomersWithInstallers');
    return this.ready();
  }

  // Check user role.
  if (!Roles.userIsInRole(curUserId, Constants.CUSTOMERS_PAGE_ROLES)) {
    console.log('Wrong user role at Customers.publications.getCustomersWithInstallers');
    return this.ready();
  }

  const MAX_LIMIT = 400;

  // Build aggregation pipeline
  const pipeline = [
    {
      $sort: { addTime: -1 }, // newest first
    },
    {
      $lookup: {
        from: 'installers',
        localField: 'installerId',
        foreignField: '_id',
        as: 'agInstallers',
      },
    },
    {
      $addFields: {
        installer: {
          _id: {
            $arrayElemAt: ['$agInstallers._id', 0],
          },
          companyName: {
            $arrayElemAt: ['$agInstallers.companyName', 0],
          },
        },
      },
    },
    {
      $project: {
        agInstallers: false,
      },
    },
    {
      $limit: MAX_LIMIT,
    },
  ];

  // console.log('\n\npipeline', EJSON.stringify(pipeline, { indent: true }));
  // console.log('\n\nRESULTS', CustomersCollection.aggregate(pipeline));
  ReactiveAggregate(this, CustomersCollection, pipeline, { clientCollection: 'customersWithInstallers' });
});
//------------------------------------------------------------------------------
