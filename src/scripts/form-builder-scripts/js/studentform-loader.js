import angular from 'angular';

const _$timeout = angular.injector(['ng']).invoke(['$timeout', function($timeout) {
	return $timeout;
}]);

function scopeCallback(scope) {
	scope.$watch(
		() => {
			if (scope.formContent.title) return scope.formContent.title;
		},
		(title) => {
			if (title) {
				if (title === 'IEP: SpEd 6a1') {
					require(["fb/form6a1"], function(form6a1) {
						form6a1.default();
					});
				}

				if (title === 'IEP: SpEd 51') {
					require(["fb/form51"], function(form51) {
						form51.default();
					});
				}

				if (title.indexOf('IEP:') > -1) {
					require(["fb/iep", "fetch"], function(iep) {
						iep.default();
					});
				}
			}
		}
	);
}


export default function deferScopeWatch() {
  angular.element(document).ready(function() {
    _$timeout(function() {
      var scope = angular.element(document).scope();
      if (scope) {
        scopeCallback(scope);
      }
      else {
        var scopeWatcher = setInterval(() => {
          var scope = angular.element(document).scope();
          if (scope) {
            clearInterval(scopeWatcher);
            scopeCallback(scope);
          }
        }, 500);
      }
    })
  });
}
