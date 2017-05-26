class StressTest {

  constructor () {
    var tl;

    this.metrics = [];
    this.timelines = [];

    for (var i = 0; i < 200; i++) {
      tl = new PositionTimeline('obj_' + i);

      // if (i % 3 === 0) {
        tl.set(-1000, {x: Math.random() * 1000, y: Math.random() * 1000});
      // }

      tl.set(0, {x: Math.random() * 1000, y: Math.random() * 1000})

      this.timelines.push(tl);
    }
  }

  begin () {
    requestAnimationFrame(this.render.bind(this));
  }

  render (timestamp) {
    var s, r;

    s = performance.now();
    this.timelines.forEach(function (tl) {
      r = Math.random();

      if (r > 0.95) {
        tl.set(-2000, {x: Math.random() * 1000, y: Math.random() * 1000});
      }
      else if (r > 0.5) {
        tl.set(-19, {x: Math.random() * 1000, y: Math.random() * 1000});
      }

      tl.get(0);
    });

    this.metrics.push(performance.now() - s);

    if (this.metrics.length > 1000) {
      console.log(this.metrics.reduce((a, b) => a + b, 0) / this.metrics.length);
      this.metrics = [];
    }

    requestAnimationFrame(this.render.bind(this));
  }
}

function stress () {
  var test = new StressTest();

  test.begin();
}

// function stressTest () {
//   // Create timelines.
//   var timelines = [];
//
//   for (var i = 0; i < 100; i++) {
//     timelines.push(new PositionTimeline('obj_' + i));
//   }
//
//   window.timelines = timelines;
// }
