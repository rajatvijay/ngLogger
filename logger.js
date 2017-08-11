/*
 * @configuration sample = {
 *  notAllowedHosts = ['acadview.com']
 * }
 *
 */
(function (angular) {
  angular.module('ngLogger.core', [])
    .provider('ngLogger', ['$windowProvider', function ($windowProvider) {
      var self = this;
      var nlWindow = $windowProvider.$get();
      var console = nlWindow.console;

      // Private vars only for holding configuration
      var productionNames = [];
      var warningsAllowed = true;
      var stagingNames = [];

      // Attributes
      this.controllerName = null;

      this.configure = function (configuration) {
        productionNames = configuration.notAllowedHosts || productionNames;
        stagingNames = configuration.allowedHosts || stagingNames;
      };

      this.exitWarningMode = function () {
        warningsAllowed = false;
      };

      function isValidLocation() {
        return productionNames.indexOf(nlWindow.location.hostname) === -1 ||
          stagingNames.indexOf(nlWindow.location.hostname) !== -1
      }

      this.$get = function () {
        return {
          log: function () {
            // Warn is controller name is not set
            if (!self.controllerName && warningsAllowed) {
              console.warn("Controller name not set");
            }

            if (isValidLocation()) {
              console.groupCollapsed(self.controllerName);
              var _arguments = [].slice.call(arguments);

              // log every argument
              angular.forEach(_arguments, function (arg) {
                console.log(arg);
              });
              console.groupEnd();
            }
          },
          setController: function (controllerName) {
            self.controllerName = controllerName;
          }
        }
      }
    }]);
})(window.angular);