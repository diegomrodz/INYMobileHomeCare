appControllers.controller('dashboardCtrl', function ($scope, $timeout, $interval, $state, $http, $stateParams, $ionicHistory) {
    $scope.isAnimated =  $stateParams.isAnimated;
    $scope.isListening = false;

    var updateInterval;

    $scope.update = function () {

        if ($scope.isListening) {
            var len = $scope.patients.length;
            var i = 0;

            for (i = 0; i < len; i += 1) {
                var patient = $scope.patients[i];

                if ( ! patient.notifications) {
                    patient.notifications = new Array();
                }

                $scope.getNotificationsFor(patient);
            }
        }

    };

    $scope.getNotificationsFor = function (patient) {
        $http.get(globalVariable.appUrl + "/api/mobile/dashboard/notifications/" 
            + patient.id).then(

            function onSuccess (res) {

                console.log(res.data);

                if (res.data && typeof res.data === typeof []) {
                    var len = res.data.length;

                    if (len > 0) {
                        var i = 0;

                        for (i = 0; i < len; i += 1) {
                            patient.notifications.push(res.data[i]);
                        }
                    }
                }

            },

            function onError () {
                alert("Houve um erro ao obter notificações do paciente " + patient.name);
            }

        );
    };

    $scope.refresh = function () {
        $scope.isListening = false;

        $http.get(globalVariable.appUrl + "/api/mobile/dashboard/patients").then(
            function onSuccess (res) {
                $scope.patients = res.data;
                $scope.isListening = true;

                updateInterval = $interval($scope.update, 5000);
            },
            function onError () {
                alert("Houve um erro na obtenção dos dados da dashboard.");
            }
        );
    };

    $scope.refresh();

    $scope.fugullinScaleState = function(scale) {
        if (scale == 1) return "lowest";
        if (scale == 2) return "low";
        if (scale == 3) return "high";
        if (scale == 4) return "highest";
        return "";
    };

    $scope.navigateTo = function (stateName, params) {
        $timeout(function () {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
                $state.go(stateName, params);
            }
        }, ($scope.isAnimated  ? 300 : 0));
    };

});


