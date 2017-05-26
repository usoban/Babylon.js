class TimelineEntityManager {
  constructor (net) {
    this.timelines = {};
    this.objects = {};
    this.net = net;

    this.net.addDataCallback(this.onTimelineUpdate.bind(this));
  }

  onTimelineUpdate (data) {
    var timeline,
        meshObject;

    if (this.timelines[data.timeline]) {
      timeline = this.timelines[data.timeline];
    }
    else {
      meshObject = this.scene.getMeshByName(data.timeline);
      timeline = this.attachObjectProperty(meshObject, 'position');
    }

    timeline.setFromRemote(data.real_time, data.value);
  }

  attachObjectProperty (object, property) {
    var propertyTimeline;

    this._addObject(object);

    // if (!this.timelines[object.name]) }{
    //   this.timelines[object.name] = {};
    // }

    switch (property) {
      case 'position':
        propertyTimeline = new PositionTimeline(object, object.name);
        break;

      // case 'rotation':
      //   propertyTimeline = new RotationTimeline(object, object.name);
      //   break;
    }

    // TODO ... -.-
    propertyTimeline.net = this.net;

    // this.timelines[object.name][property] = propertyTimeline;
    this.timelines[object.name] = propertyTimeline;

    return propertyTimeline;
   }

   loopScene (scene) {
     GlobalTime.freeze();

     this.scene = scene;

     Object.values(this.timelines).forEach(timeline => {
       timeline.set(0, timeline.object.position);
     });

     GlobalTime.unfreeze();

     scene.registerBeforeRender(this._whoop.bind(this));
   }

   _whoop () {
     GlobalTime.freeze();

     // Update position of all objects.
     Object.values(this.timelines).forEach(timeline => {
       var positionInTime = timeline.get(0);

       timeline.object.position.x = positionInTime.x;
       timeline.object.position.y = positionInTime.y;
       timeline.object.position.z = positionInTime.z;
     })

     GlobalTime.unfreeze();
   }

  _addObject (object) {
    if (!this.objects[object.name]) {
      this.objects[object.name] = object;
    }
  }
}
