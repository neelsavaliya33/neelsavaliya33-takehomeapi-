'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
