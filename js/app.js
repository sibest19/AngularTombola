(function() {
	var app = angular.module('Tombola', []);

	app.controller('GameController', ['$scope', '$timeout', '$log', function($scope, $timeout, $log) {
	
		this.table = null;
		this.history = [];
		this.title = "Scegli un titolo";
		this.started = false;
		this.finished = false;
		this.lastDrawn = null;

		$scope.hoverIsVisible = false;
		$scope.hoverPromise = null;

		this.initializeTable = function() {
			this.table = [];
			for (var i = 1; i <= 90; i++) {
				this.table.push({
					val: i,
					drawn: false,
					description: "",
					image: null
				});
			};
		};

		this.initializeTable();

		this.changeTitle = function() {

			if (newTitle = prompt("Nuovo titolo:")) {
				this.title = newTitle;
			}
		};

		this.toggleNumber = function(number) {

			if (this.canToggleNumber()) {
				var objIndex = number.val - this.table[0].val;
				this.table[objIndex].drawn = !number.drawn;
				$log.log(JSON.stringify(this.table[objIndex]));
				this.history.push(number.val);
			}			
		};

		this.canToggleNumber = function() {
			return !this.started && !this.finished;
		};

		this.start = function() {
			this.started = true;
			$log.log('Game started!');

		};

		$scope.showHover = function() {
			$scope.hoverIsVisible = true;
		};

		$scope.hideHover = function() {
			$scope.hoverIsVisible = false;
		};

		this.drawNumber = function() {
			
			if (!this.started || this.finished) return;

			var drawn = null;
			var objIndex = null;
			var tries = 0;

			do {
				tries++;
				drawn = this.getRandomIntInRange(this.table[0].val, this.table[this.table.length-1].val);
				objIndex = drawn - this.table[0].val;
			}
			while (this.table[objIndex].drawn == true);
			
			$log.log('Tries: '+tries);
			
			this.table[objIndex].drawn = true;
			this.history.push(drawn);
			
			if($scope.hoverPromise != null) {
				$log.debug($timeout.cancel($scope.hoverPromise));
				$scope.hoverPromise = null;
			}
			
			this.lastDrawn = drawn;
			$scope.showHover();
			$scope.hoverPromise = $timeout(function(){$scope.hideHover()}, 5000);
			this.checkStatus();

		};

		this.getRandomIntInRange = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		this.getDrawnCount = function() {

			var counter = 0;
			for (var i = this.table.length - 1; i >= 0; i--) {
				if (this.table[i].drawn == true) counter++;
			};
			return counter;
		};

		this.checkStatus = function() {
			$log.log('Estratti: '+this.getDrawnCount());
			if (this.getDrawnCount() == this.table.length) {
				this.finished = true;
				$log.log('Game finished!');
			}
		};

	}]);
})();