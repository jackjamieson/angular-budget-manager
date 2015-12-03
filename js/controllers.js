/**
* Controls all other Pages
*/

// the default controller if no other specified
app.controller('DefaultController', function(){
});

app.controller('CategoriesController', function($scope, $http){

  $scope.sources = {};
  $scope.expenses = {};
  $scope.nsource = {};
  $scope.ncategory = {};

  $scope.theItem = {};
  $scope.theExpenseItem = {};

  $scope.updateList = function() {
    $scope.theItem = $scope.selectedSource;
  };

  // perform a delete from the list
  $scope.deleteIncomeSource = function(){

    var resp = confirm("Are you sure you want to delete this source?");
    if(resp == true){

      //TODO we could make it so that this doesn't refresh the page
      //$scope.sources.rows.splice( index, 1 );// update the client side so it appears instant

      $http({
        url : 'http://127.0.0.1:5984/budgetdb/' + $scope.theItem.value._id + '?rev=' + $scope.theItem.value._rev,
        method : 'DELETE'
      })
      .success(function(message) {
        location.reload();
      });

    }

  };

  // pull in the existing sources
  $scope.getIncomeSources = function() {
    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/categories/_view/income_sources',
      type : 'GET'
    })
    .success(function(data) {
      $scope.sources = data;
      $scope.selectedSource = $scope.sources.rows[0];

    });
  };

  // pull in the existing sources
  $scope.getExpenseCategories = function() {
    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/categories/_view/expenses',
      type : 'GET'
    })
    .success(function(data) {
      $scope.expenses = data;
      $scope.selectedCategoryExpense = $scope.expenses.rows[0];

    });
  };


  // process the form to post income data
  $scope.addIncomeSource = function() {

    $http({
      url : DB_URL,
      method : 'POST',
      contentType : "application/json",
      crossDomain : true,
      data: $scope.nsource
    })
    .success(function(data) {
      $scope.getIncomeSources();
      $scope.nsource = "";
      $scope.addedSource = true;
      $scope.addedCategory = false;
    });
  };

  // process the form to post income data
  $scope.addExpenseCategory = function() {

    $http({
      url : DB_URL,
      method : 'POST',
      contentType : "application/json",
      crossDomain : true,
      data: $scope.ncategory
    })
    .success(function(data) {
      $scope.getExpenseCategories();
      $scope.ncategory = "";
      $scope.addedCategory = true;
      $scope.addedSource = false;
    });
  };

  // perform a delete from the list
  $scope.deleteExpenseCategory = function(){

    var resp = confirm("Are you sure you want to delete this category?");
    if(resp == true){

      //TODO we could make it so that this doesn't refresh the page
      //$scope.sources.rows.splice( index, 1 );// update the client side so it appears instant

      $http({
        url : 'http://127.0.0.1:5984/budgetdb/' + $scope.theExpenseItem.value._id + '?rev=' + $scope.theExpenseItem.value._rev,
        method : 'DELETE'
      })
      .success(function(message) {
        location.reload();
      });

    }

  };

  $scope.updateListExpense = function() {
    $scope.theExpenseItem = $scope.selectedCategoryExpense;
  };

  $scope.getIncomeSources();
  $scope.getExpenseCategories();

});

app.controller('IncomeController', function( $scope, $http) {

  $scope.income = {};
  $scope.income.type = "income"; // this field will always be income coming from this controller

  // load income sources
  $scope.sources = {};

  // pull in the existing sources
  $scope.getIncomeSources = function() {
    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/categories/_view/income_sources',
      type : 'GET'
    })
    .success(function(data) {
      $scope.sources = data;
      $scope.selectedSource = $scope.sources.rows[0];
      $scope.income.source = $scope.sources.rows[0].value.income_source;
    });
  };

  $scope.updateList = function() {

    $scope.income.source = $scope.selectedSource.value.income_source;

  };



  $scope.getIncomeSources();

  // assign the dates to now
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  $scope.income.year = String(1900 + today.getYear());
  $scope.income.month = monthNames[today.getMonth()];

  // process the form to post income data
  $scope.processForm = function() {

    $http({
      url : DB_URL,
      method : 'POST',
      contentType : "application/json",
      crossDomain : true,
      data: $scope.income,
    })
    .success(function(data) {
      $scope.addedIncome = true;

    });
  };
});

app.controller('ExpenseController', function( $scope, $http) {

  $scope.expense = {};
  $scope.expense.type = "expense"; // this field will always be expense coming from this controller

  // categories
  $scope.expenses = {};


  // pull in the existing sources
  $scope.getExpenseCategories = function() {
    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/categories/_view/expenses',
      type : 'GET'
    })
    .success(function(data) {
      $scope.expenses = data;
      $scope.selectedCategoryExpenses = $scope.expenses.rows[0];
      $scope.expense.expense_category = $scope.expenses.rows[0].value.expense_category;
    });
  };

  $scope.updateList = function() {

    $scope.expense.expense_category = $scope.selectedCategoryExpenses.value.expense_category;

  };

  $scope.getExpenseCategories();

  // assign the dates to now
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  $scope.expense.year = String(1900 + today.getYear());
  $scope.expense.month = monthNames[today.getMonth()];

  // process the form to post income data
  $scope.processForm = function() {

    $http({
      url : DB_URL,
      method : 'POST',
      contentType : "application/json",
      crossDomain : true,
      data: $scope.expense,
    })
    .success(function(data) {
      $scope.addedExpense = true;

    });
  };
});

app.controller('ReportsController', function($scope, $http) {

  $scope.report = {}; // the initial report object
  $scope.reportui = {};

  $scope.monthlyIncome = 0;
  $scope.monthlyExpense = 0;

  // perform a delete from the table
  $scope.delete2 = function(index, id, rev){

    var resp = confirm("Are you sure you want to delete this row?");
    if(resp == true){

      $scope.report.rows.splice( index, 1 );// update the client side so it appears instant

      $http({
        url : 'http://127.0.0.1:5984/budgetdb/' + id + '?rev=' + rev,
        method : 'DELETE'
      })
      .success(function(message) {

      });

    }

  };


  // perform a pull on current incomes
  $scope.update = function(){
    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/bincome/_view/current_month_incomes',
      type : 'GET'
    })
    .success(function(data) {
      $scope.report = data;
      for(var i = 0; i < data.rows.length; i++){
        $scope.monthlyIncome += data.rows[i].value.amount;
      }
    });

    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/bexpense/_view/current_month_expenses',
      type : 'GET'
    })
    .success(function(data) {
      for(var i = 0; i < data.rows.length; i++){
        $scope.monthlyExpense += data.rows[i].value.amount;
      }
    });
  };

  $scope.update();

  $scope.updateOptions = function(type, year, month) {
    $scope.monthlyIncome = 0;
    $scope.monthlyExpense = 0;

    // TODO: make the monthly values update when something is deleted

    // calculate the monthly values
    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/bincome/_view/incomes_' + year + '?key="' + month + '"',
      type : 'GET'
    })
    .success(function(data) {

      for(var i = 0; i < data.rows.length; i++){
        $scope.monthlyIncome += data.rows[i].value.amount;

      }
    });

    $http({
      url : 'http://127.0.0.1:5984/budgetdb/_design/bexpense/_view/expenses_' + year + '?key="' + month + '"',
      type : 'GET'
    })
    .success(function(data) {

      for(var i = 0; i < data.rows.length; i++){
        $scope.monthlyExpense += data.rows[i].value.amount;

      }
    });


    // calculate the details
    if(type === 'income' && year === '2015'){
      $http({
        url : 'http://127.0.0.1:5984/budgetdb/_design/bincome/_view/incomes_2015?key="' + month + '"',
        type : 'GET'
      })
      .success(function(data) {
        $scope.report = data;
      });
    }
    else if(type === 'income' && year === '2016'){
      $http({
        url : 'http://127.0.0.1:5984/budgetdb/_design/bincome/_view/incomes_2016?key="' + month + '"',
        type : 'GET'
      })
      .success(function(data) {
        $scope.report = data;
      });
    }
    else if(type === 'expense' && year === '2015'){
      $http({
        url : 'http://127.0.0.1:5984/budgetdb/_design/bexpense/_view/expenses_2015?key="' + month + '"',
        type : 'GET'
      })
      .success(function(data) {
        $scope.report = data;
      });
    }
    else if(type === 'expense' && year === '2016'){
      $http({
        url : 'http://127.0.0.1:5984/budgetdb/_design/bexpense/_view/expenses_2016?key="' + month + '"',
        type : 'GET'
      })
      .success(function(data) {
        $scope.report = data;
      });
    }
    else if(type === 'both' && year === '2015'){
      $http({
        url : 'http://127.0.0.1:5984/budgetdb/_design/both/_view/types_2015?key="' + month + '"',
        type : 'GET'
      })
      .success(function(data) {
        $scope.report = data;
      });
    }
    else $scope.report = {};

  };

  // assign the dates to now
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  $scope.reportui.year = String(1900 + today.getYear());
  $scope.reportui.month = monthNames[today.getMonth()];
  $scope.reportui.type = "income";
});
