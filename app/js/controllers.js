'use strict';

/* Controllers */

function SaController($scope, analysers) {

  // Vars
  var imgtag = new Image();
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var onloadFunc;

  $scope.analysers = [
    {name: 'Circle Midpoint', proc: analysers.get('Circle')}
  ];

  // Try to allow cross origin data (if the remote server supports it)
  imgtag.crossOrigin = '';

  // Scope variables
  $scope.imgurl   = 'http://localhost:8000/app/img/black_circle.png';
  $scope.analysis = $scope.analysers[0];
  $scope.ret      = null;

  // Scope methods
  $scope.isValidFile = function() {
    return $scope.imgurl && !($scope.myForm.$invalid);
  };
  $scope.submit = function() {
    imgtag.src = $scope.imgurl;
  };

  // Onload handler that does most of the work
  onloadFunc = function() {
    var data;

    /* Draw image */
    canvas.width = imgtag.width;
    canvas.height = imgtag.height;
    ctx.drawImage(imgtag, 0, 0);

    /* Get Image Data */
    data = ctx.getImageData(0, 0, imgtag.width,imgtag.height);

    /* Analyse the data */
    $scope.ret = $scope.analysis.proc(data, ctx);

    /* Propagate changes */
    $scope.$apply();
  };
  imgtag.onload = onloadFunc;

  // Tester
  $scope.performanceTest = function() {
    var startTime = new Date().getTime();
    var x,y,w,h,r,cx,cy;
    for(var i=0;i<100;i++) {
      canvas.width = 400;
      canvas.height = 400;
      /* Clear canvas */
      ctx.fillStyle="white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      /* Draw a random *complete* circle */
      ctx.fillStyle="black";
      x = Math.floor(Math.random()*(canvas.width-2)) + 1;
      y = Math.floor(Math.random()*(canvas.height-2)) + 1;
      r = Math.floor(Math.random()*(Math.min(canvas.width-x, x, canvas.height-y, y)));
      if(r<2) r = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();

      var data = ctx.getImageData(0, 0, canvas.width,canvas.height);
      var err = false;
      /* Find the midpoint */
      $scope.ret = $scope.analysis.proc(data, ctx);
      if(Math.abs($scope.ret.x - x) < 2 && Math.abs($scope.ret.y - y) < 2) {
        console.log("OK "+i);
      } else {
        err = true;
        console.log("radius: (" + r + "). error: expected (" + [x,y] + "), found (" + [$scope.ret.x, $scope.ret.y] + ")");
        break;
      }
    }
    var endTime = new Date().getTime();
    if(!err) console.log('All OK. Execution time: ' + (endTime - startTime));
  };

}
SaController.$inject = ['$scope', 'analysers'];

