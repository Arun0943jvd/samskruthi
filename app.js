var app = angular.module('CustomerApp',['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('lists');
});


app.service('CustomerService' ,['$http', '$q','localStorageService',function($http ,$q, localStorageService){

  var cache;

return {
   getCustomersFromJSON: function() {
     var deferred = $q.defer();
     $http.get('http://localhost:8080/example.json')
       .then(function(res) { 
          deferred.resolve(res.data.lists);
       },function(error) {
          deferred.reject(error);
          $log.error(error);
       });
     return deferred.promise;
   },

   saveCustomer : function (data){
   localStorageService.set('lists',data);
  }


  }

}]);




app.controller('CustomerController', function($http, $scope,CustomerService,localStorageService){

$scope.buttonText = 'Desc';
$scope.isReverse = false;
$scope.customersList = [];
$scope.selectedCustomer = {first_name:'Please select customer from left side to view detail',location:'Not Selected', email:'Not Selected'};
$scope.newCustomer = {};
$scope.customersList = localStorageService.get('lists');
$scope.errorMsg = null;

if (!$scope.customersList){

 CustomerService.getCustomersFromJSON().then(function(data){
      CustomerService.saveCustomer(data);
      $scope.customersList = localStorageService.get('lists');
   });
}


$scope.reArrangeList = function(buttonText){
     if(buttonText === 'Desc'){
      $scope.buttonText = 'Asce';
      $scope.isReverse = true;
      
    }else{
      $scope.isReverse = false;
      $scope.buttonText = 'Desc';
    }

};

$scope.addCustomer = function (){
    $scope.errorMsg = null;// resetting the errormsg to null.
    if($scope.newCustomer.first_name && $scope.newCustomer.location && $scope.newCustomer.email){
       if($scope.checkFormValidations()) {
        $scope.customersList.push($scope.newCustomer);
        $scope.newCustomer = {}; // emptying the new customer object.
        localStorage.removeItem('lists');
        localStorageService.set('lists',$scope.customersList);
      }else{

        $scope.errorMsg = 'Please enter valid Email Address format.';

      }
    }else{
          $scope.errorMsg = 'Please enter input fields.';
    }
};


$scope.checkFormValidations = function (){

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.newCustomer.email))
    {
      return (true)
    }
     
      return (false)
};

  $scope.deleteCustomer = function (){
    $scope.customersList.splice($scope.customersList.findIndex(e => e.first_name === $scope.selectedCustomer.first_name),1);
    localStorage.removeItem('lists');
    localStorageService.set('lists',JSON.stringify($scope.customersList));
    $scope.selectedCustomer = {first_name:'Please select customer from left side to view detail',location:'Not Selected', email:'Not Selected'};
  };

  $scope.selectCustomer = function(customer){
    $scope.selectedCustomer = customer;
  };

  $scope.assignDeleteCustomer = function(customer){
    $scope.selectedCustomer = customer;
  };

});