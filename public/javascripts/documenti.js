(function(){
var app = angular.module( 'codlicious-documenti', [] );

/*
	funzione chiamata da ng-keypress: se digito ";" devo aggiungere ad un repeater un badge con la parola che viene prima, e aggiornare il padding-left del textfield.
	come top i px si basano sull'altezza dell'input. il margin-left prende la somma delle lunghezze dei precedenti + un offset.
	ng-keypress non rileva il backspace. meglio ng-keydown
*/

app.directive('tagField', function(){
	return {
		scope: {
			tags: '=ngModel'
		},
		template: '<input type="text" class="form-control" ng-model="tagText" ng-keydown="processaInputTag(tagText,$event)"></input><span class="label-tag label label-primary" ng-repeat="tag in tags">{{tag}}</span>',
		link: function(scope,element,attrs){
			
			var setCss = function(){
				var tagList = angular.element(document)[0].getElementsByClassName("label-tag");
				var lastInsertedTag = tagList[tagList.length-1];
				angular.element(lastInsertedTag).css({"visibility":"hidden"});
			
				angular.element(document).ready(function() {
					var tags = angular.element(document)[0].getElementsByClassName("label-tag");
					var marginLeft = 12;
					for(i = 0; i < tags.length; i++){
						var tag = angular.element(tags[i]);
						tag.css({"top":"10px","margin-left":marginLeft+"px"});
						marginLeft += (tags[i].offsetWidth + 2);
						tag.css({"visibility":"visible"});
					}
					var inputField = element.find("input")[0];
					inputField = angular.element(inputField);
					inputField.css({"padding-left":marginLeft+"px"});
			});
			};
			
			scope.processaInputTag = function(tagText,event){
				if(event.which == 188){
						event.preventDefault()
						var newTag = tagText;
						scope.tagText = "";
				
						scope.tags.push(newTag);
			
					} else if(event.which == 8){
						// se c'è del testo devo rimuovere il testo normalmente, altrimenti faccio quello scritto qua sotto
						if(tagText == null || tagText == ""){
							scope.tags.pop();
						}
					}
			};
					
			scope.$watchCollection('tags', function(oldVal,newVal){
					if(newVal){
						setCss();
					}
			});
		}
	}
});

app.directive('ratingField', function(){
	return {
		scope: {
				rating: '=ngModel',
				max: '=?'
		},
		restrict: 'E',
		template: '<div class="form-group"><label class="control-label col-sm-2">Voto</label><div class="col-sm-6">'+
			'<ul><li class="glyphicon" ng-repeat="star in stars" ng-click="toggle($index)" ng-class="{\'glyphicon-heart\': star.selected, \'glyphicon-heart-empty\': !star.selected}"></li></ul>'+
			'</div></div><div class="form-group"><label class="control-label col-sm-2">Commento</label><div class="col-sm-6"><textarea class="form-control" rows="5" id="commento" ng-model="rating.commento" required></textarea></div></div>',
		link: function(scope, element, attributes) {
		
			var updateRating = function(){
				scope.stars = [];
				for(var i = 0; i < scope.max; i++){
					scope.stars.push({"index":i,"selected":i<scope.rating.voto});
				}
			};
			
			scope.toggle = function(index){
				scope.rating.voto = index + 1;	
			};
			
			scope.$watch('rating.voto', function(oldVal,newVal){
				if(newVal){
					updateRating();
				}
			});

		}
	};
});

app.directive('ratingView', function(){
	return {
		scope: {
			ratings: '=ngModel'
		},
		template: '<a ng-click="updateActive(active - 1)" ng-hide="active == 0"><p class="glyphicon glyphicon-chevron-left"></p></a><div style="display:inline-block;" ng-repeat="rating in ratings" ng-hide="$index != active"><ul class="list-inline">' +
			'<li class="glyphicon" ng-repeat="rate in [1,2,3,4,5]" ng-class="{\'glyphicon-heart\': rating.voto > $index, \'glyphicon-heart-empty\': rating.voto <= $index}"></li>' +
			'</ul><p>{{rating.commento}}</p></div><a ng-click="updateActive(active + 1)" ng-hide="active == ratings.length - 1"><p class="glyphicon glyphicon-chevron-right"></p></a>',
		restrict: 'E',
			
		controller: function($scope){
			$scope.active = 0;
			
			$scope.updateActive = function(index){
				$scope.active = index;
			};
		
		}
	}
});

})();