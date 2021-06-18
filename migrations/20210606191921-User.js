'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'loginStrategy',
         Sequelize.STRING
       ),
      queryInterface.addColumn(
        'Users',
        'loginStrategyId',
        Sequelize.STRING
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'Users',
        'loginStrategy'
       ),
      queryInterface.removeColumn(
        'Users',
        'loginStrategyId'
      )
    ]);
  }
};
