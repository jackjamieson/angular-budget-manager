
var DB_URL = "http://127.0.0.1:5984/budgetdb";

/**
* Main AngularJS Web Application
*/
var app = angular.module('budgetApp', [
  'ngRoute'
]);

/**
* Configure the Routes
*/
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  // Home
  .when("/", {templateUrl: "partials/home.html", controller: "DefaultController"})
  // Pages
  .when("/income", {templateUrl: "partials/income.html", controller: "IncomeController"})
  .when("/expense", {templateUrl: "partials/expense.html", controller: "ExpenseController"})
  .when("/reports", {templateUrl: "partials/reports.html", controller: "ReportsController"})
  .when("/categories", {templateUrl: "partials/categories.html", controller: "CategoriesController"})

  /* etc… routes to other pages… */

  // else index
  .otherwise({redirectTo: "/"});
}]);
