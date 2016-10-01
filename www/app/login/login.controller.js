appControllers.controller('loginCtrl', function ($scope, $state, $http, AuthUser) {

	$scope.user = {};

	$scope.login = function () {
		var form = JSON.stringify($scope.user);

		$http.post(globalVariable.appUrl + "/auth/api_login", form).then(
			function onSuccess (data) {

				AuthUser.set(data.data);

				$http.defaults.headers.common.Authorization = 'Bearer ' + data.data.token;

				$state.go("app.dashboard");
			},
			function onError (res) {
				alert("Houve um erro na comunicação com o servidor.");
			}
		);

	};

});