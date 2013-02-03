/* Shape Analysers */
var CircleAnalyser = function() {

  'use strict';

  return (function(data, ctx) {
    var x, y, centerx, centery;

    // Get a decent point on the boundary of the circle
    loop:
    for(x = 0; x < data.width; x++)
      for(y = 0; y < data.height; y++)
        if(isBlack(data, x, y)) break loop;

    // Get Y coordinate
    centery = midpoint(y, data.height, function(y) {
      return isBlack(data,x,y);
    });

    // Get X coordinate
    centerx = midpoint(x, data.width, function(x) {
      return isBlack(data,x,centery);
    });

    // Display
    ctx.fillStyle = "rgba(250,0,0,0.4)";
    ctx.fillRect(centerx, 0, 1, data.height);
    ctx.fillRect(0,centery, data.width, 1);

    // Return
    return {x:centerx, y:centery};

  });

  // UTILITY FUNCTIONS
  // Check if a pixel is black at a given coordinate
  function isBlack(data, x, y) {
    var offset, r, g, b;
    offset = (y * data.width + x) * 4;
    r = data.data[offset];
    g = data.data[offset + 1];
    b = data.data[offset + 2];
    return (r<10 && g<10 && b<10);
  }

  // Get the midpoint of range which satisfies the given predicate
  function midpoint(minx, maxx, f) {
    var x, mid;
    for(x = minx; x < maxx; x++) {
      if(!f(x)) {
        mid = minx + x;
        if(mid % 2) mid = (mid-1)/2;
        else mid = mid/2;
        return mid;
      }
    }
  }

};


