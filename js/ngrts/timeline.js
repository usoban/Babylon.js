// ======================================================================================
// The timeline.
// TODO: make timeline itself a fucking DLL. This will slightly reduce memory footprint
//      and probably quite nicely reduce the code size/complexity.
//      By implementing this we should also get rig of those `returnNode` args.
// ======================================================================================

class Timeline {

  constructor (object, name) {
    this.object = object;
    this.name = name;
    this.timeline = new DoubleLinkedList();
    this.maxLength = 50;
  }

  /**
   * Creates a value object at given time.
   */
  static createValue (t, value) {
    var tv = new TimeValue();

    tv.t = t;
    tv.value = value;

    return tv;
  }

  /**
   * Finds an element in the timeline with latest time before the given time.
   *
   * Returns null if there is no such element.
   *
   * TODO: support `sentToRemoteOnly`
   */
  valueBefore (t, sentToRemoteOnly, returnNode) {
    var latestValueBefore = this.timeline.findBackwards(function (node) {
      return node.value && node.value.t < t;
    });

    if (!latestValueBefore) {
      // TODO: either no values were sent before time t, or all values are after time t????
      return this.timeline.head.value;
    }

    if (returnNode) return latestValueBefore;

    return latestValueBefore.value;
  }

  /**
   * Returns the element with latest time before or at the given time.
   *
   * Returns null if there is no such element.
   */
  valueBeforeAt (t) {
    var latestValueBefore = this.timeline.find(function (node) {
      return node.value && node.value.t > t;
    });

    if (latestValueBefore === null) {
      // TODO: all values were before t
      return null;
    }

    return latestValueBefore.prev.value;
  }

  /**
   * Returns the element with earliest time after the given time.
   */
  valueAfter (t, returnNode) {
    var earliestValueAfter,
        returnNode = returnNode || false;

    var earliestValueAfter = this.timeline.findBackwards(function (node) {
      return node.value && node.value.t < t; // TODO: should it be <= ???
    });

    if (earliestValueAfter === null) {
      // TODO: all values were after t
      return null;
    }

    if (returnNode) return earliestValueAfter.next;

    return earliestValueAfter.next.value;
  }

  /**
   * Returns the value at time t if there is one; otherwise returns null.
   */
  valueAt(t) {
    var node = this.timeline.findBackwards(function (node) {
      return node.value && node.value.t <= t;
    });

    if (node === null) {
      // TODO: all values were after t
      return null;
    }

    if (node.value.t === t) {
      return node.value;
    }

    return null;
  }

  /**
   * Returns the next ground time after the given time.
   *
   * If there is no future ground time, returns t.
   */
  nextTime(t) {
    var nextTime, valueAfter;

    GlobalTime.freeze();

    valueAfter = this.valueAfter(t);
    if (valueAfter !== null) {
      nextTime = valueAfter.t;
    } else {
      nextTime = t;
    }

    GlobalTime.unfreeze();

    return nextTime;
  }

  /**
   * Returns the next ground time before the given time.
   * If there is no past ground time, returns t.
   */
  prevTime (t) {
    var prevTime, valueBefore;

    GlobalTime.freeze();

    valueBefore = this.valueBefore(t);
    if (valueBefore !== null) {
      prevTime = valueBefore.t;
    } else {
      prevTime = t;
    }

    GlobalTime.unfreeze();

    return prevTime;
  }

  /**
   * Returns true if the timeline is ready to be used (there is at least one value
   * in the timeline).
   *
   * Used to determine if the timeline contains any values. A timeline must
   * contain at least one value before the get() method can be used. It
   * returns true if there are values in the timeline, otherwise returns false.
   *
   * Its a good practice to call this method before using the get() method to
   * ensure that get() will not return an error.
   */
  ready () {
    return !this.timeline.isEmpty();
  }

  get (t) {
    var result, timelineNode;

    if (!this.ready()) {
      throw new Error('Timeline [' + this.name + '] not ready.');
    }

    GlobalTime.freeze();

    timelineNode = this.valueAt(t);

    if (timelineNode !== null) {
      result = timelineNode.value;
    }
    else {
      if (this.timeline.lastValue().t > t && this.timeline.firstValue().t < t) {
        if (this.interpolate !== null) {
          // TODO: implement interpolations!!
          result = this.interpolate(t);
        }
        else {
          // If no interpolation is specified, return the previous value on the timeline.
          // TODO: verify, but e.g. this may be when unit is not actually moving??
          result = this.valueBefore(t).value;
        }
      }
      else if (this.timeline.firstValue().t > t) {
        // All values in the timeline are after t.
        result = this.timeline.firstValue().value;
      }
      else {
        // All values in the timeline are before t.
        if (this.extrapolate !== null) {
          // TODO: implement extrapolations!!
          result = this.extrapolate(t, false); // TODO: wtf is the second arg?
        }
        else {
          // If no extrapolation is specified, return the last value in the timeline.
          result = this.timeline.lastValue().value;
        }
      }
    }

    GlobalTime.unfreeze();

    return result;
  }

  /**
   * Returns a list of values for the given time range.
   */
  getRange (tStart, tEnd) {
    var resultList = [],
        nodeAfter;

    GlobalTime.freeze();

    nodeAfter = this.valueAfter(tStart, true); // get timeline node instead of value.

    while (nodeAfter !== null && nodeAfter.value.t <= tEnd) {
      resultList.push(nodeAfter.value);

      nodeAfter = nodeAfter.next;
    }

    GlobalTime.unfreeze();

    return resultList;
  }

  /**
   * Sets the value of the timeline at time t. Any previously set values later
   * than t are removed.
   *
   * @TODO: support sendToRemote!
   */
  set (t, value, sendToRemote) {
    var newTimeValue = Timeline.createValue(t, value),
        previousNodeOnTimeline;

    GlobalTime.freeze();

    // Find value whose time precedes t.

    // First, assume its most likely the last value in the list.
    if (this.timeline.isEmpty()) {
      this.timeline.append(newTimeValue);
    }
    else {
      previousNodeOnTimeline = this.timeline.tail;

      if (previousNodeOnTimeline.value.t > t) {
        previousNodeOnTimeline = this.valueBefore(t, null, true);
      }

      this.timeline.insertAfterAndDisposeTail(previousNodeOnTimeline, newTimeValue);
    }

    if (this.timeline.length() > this.maxLength) {
      this.timeline.shortenFront();
    }

    // TODO: send to remote client through networking facility.
    if (sendToRemote) {
      this.net.send({
        timeline: this.name,
        real_time: newTimeValue.realT,
        value: newTimeValue.value
      });
    }

    GlobalTime.unfreeze();
  }

  setFromRemote (realTime, value) {
    var timeValue = new TimeValue();

    timeValue.value = value;
    timeValue.realT = realTime;

    var prev = this.timeline.tail;

    if (prev === null) {
      // No values before this one.
      this.timeline.insertAfterAndDisposeTail(this.timeline.head, timeValue);
    }
    else {
      if (prev.realT > realTime) {
        prev = this.valueBefore(timeValue.t, null, true);
      }

      this.timeline.insertAfterAndDisposeTail(prev, timeValue);
    }
  }
}
