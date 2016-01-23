var app = angular.module('codlicious', ['codlicious-documenti','ngRoute']);
app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
	$routeProvider
		.when('/insert', {
			templateUrl: 'component/inserisciDocumento.html'
		})
		.when('/search', {
			templateUrl: 'component/listaDocumenti.html'
		})
		.otherwise({
			redirectTo: '/index.html'
 });

 $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

}]);

app.controller('LoginController', ['$http','$scope', function($http,$scope){
	$scope.login = function(){

	};
}]);

app.controller('InserimentoDocumentoController', ['$http', '$scope', function($http,$scope){
	$scope.documento = {
		url: '',
		descrizione : '',
		tags: [],
		ratings: [{"voto":1,"commento":""}]
	};

	$scope.bookmarkSaved = false;

	$scope.inserisci = function(){
		$http.post('/api/insertdoc', $scope.documento);
		$scope.documento =  {
			url: '',
			descrizione : '',
			tags: [],
			ratings: [{"voto":1,"commento":""}]
		};
		$scope.insertForm.$setPristine();
		$scope.bookmarkSaved = true;
	};

}]);

app.controller('RicercaDocumentiController', ['$http', '$scope', function($http,$scope){
	$scope.modelloRicerca = {
		descrizione: '',
		tags: []
	};
	$scope.listaDocumenti = {};

	$scope.lista = function(){
		$http.get('http://localhost:3000/api/search?descrizione=' + $scope.modelloRicerca.descrizione + '&tags=' + angular.toJson($scope.modelloRicerca.tags)).then(
			function(response){
				$scope.listaDocumenti = response.data;
			},
			function(response){}
		);
	};

	// con il flag a true dico ad angular di watchare il cambiamento del modelloRicerca come contenuti e non come references
	$scope.$watch('modelloRicerca', function(newValue,oldValue){
		if(newValue.descrizione.length >= 3 || newValue.tags.length > 0){
			if(newValue.descrizione != oldValue.descrizione || newValue.tags.length != oldValue.tags.length){
				$scope.lista();
			}
		} else {
			$scope.listaDocumenti = {};
		}
	}, true);
}]);

 app.controller("MenuController", function ($scope,$http,$window) {
		$scope.hide=true;

		$scope.logout = function() {
      $http.post('logout', {}).success(function() {
          $window.location.assign('/login?logout');
      }).error(function(data) {

      });
    }
 });

	app.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
										'position': 'absolute',
										'z-index': '50',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
});

app.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target, content;

            attrs.expanded = false;

            element.bind('click', function() {
                if (!target) target = document.querySelector(attrs.slideToggle);
                if (!content) content = target.querySelector('.slideable_content');

                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});
