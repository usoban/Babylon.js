


// Timeline.prototype.valueBefore = function (t, sentToRemoteOnly, returnNode) {
//   var latestValueBefore = this.timeline.findBackwards(function (node) {
//     return node.value && node.value.t < t;
//   });
//
//   if (!latestValueBefore) {
//     // TODO: either no values were sent before time t, or all values are after time t????
//     return null;
//   }
//
//   if (returnNode) return latestValueBefore;
//
//   return latestValueBefore.value;
// };

// /**
//  * Returns the element with latest time before or at the given time.
//  *
//  * Returns null if there is no such element.
//  */
// Timeline.prototype.valueBeforeAt = function (t) {
//   var latestValueBefore = this.timeline.find(function (node) {
//     return node.value && node.value.t > t;
//   });
//
//   if (latestValueBefore === null) {
//     // TODO: all values were before t
//     return null;
//   }
//
//   return latestValueBefore.prev.value;
// };

// /**
//  * Returns the element with earliest time after the given time.
//  */
// Timeline.prototype.valueAfter = function (t, returnNode) {
//   var earliestValueAfter,
//       returnNode = returnNode || false;
//
//   var earliestValueAfter = this.timeline.findBackwards(function (node) {
//     return node.value && node.value.t < t; // TODO: should it be <= ???
//   });
//
//   if (earliestTimeAfter === null) {
//     // TODO: all values were after t
//     return null;
//   }
//
//   if (returnNode) return earliestTimeAfter.next;
//
//   return earliestTimeAfter.next.value;
// };

// /**
//  * Returns the value at time t if there is one; otherwise returns null.
//  */
// Timeline.prototype.valueAt = function (t) {
//   var node = this.timeline.findBackwards(function (node) {
//     return node.value && node.value.t <= t;
//   });
//
//   if (val === null) {
//     // TODO: all values were after t
//     return null;
//   }
//
//   if (node.value.t === t) {
//     return node.value;
//   }
//
//   return null;
// };

// /**
//  * Returns the next ground time after the given time.
//  *
//  * If there is no future ground time, returns t.
//  */
// Timeline.prototype.nextTime = function (t) {
//   var nextTime, valueAfter;
//
//   GlobalTime.freeze();
//
//   valueAfter = this.valueAfter(t);
//   if (valueAfter !== null) {
//     nextTime = valueAfter.t;
//   } else {
//     nextTime = t;
//   }
//
//   GlobalTime.unfreeze();
//
//   return nextTime;
// };

// /**
//  * Returns the next ground time before the given time.
//  * If there is no past ground time, returns t.
//  */
// Timeline.prototype.prevTime = function (t) {
//   var prevTime, valueBefore;
//
//   GlobalTime.freeze();
//
//   valueBefore = this.valueBefore(t);
//   if (valueBefore !== null) {
//     prevTime = valueBefore.t;
//   } else {
//     prevTime = t;
//   }
//
//   GlobalTime.unfreeze();
//
//   return prevTime;
// };

// /**
//  * Returns true if the timeline is ready to be used (there is at least one value
//  * in the timeline).
//  *
//  * Used to determine if the timeline contains any values. A timeline must
//  * contain at least one value before the get() method can be used. It
//  * returns true if there are values in the timeline, otherwise returns false.
//  *
//  * Its a good practice to call this method before using the get() method to
//  * ensure that get() will not return an error.
//  */
// Timeline.prototype.ready = function () {
//   return !this.timeline.isEmpty();
// };

/**
 * Returns a value for the given time. Producing this value may require
 * interpolation or extrapolation.
 *
 * Its a good practice to call ready() method before using the get() method
 * to ensure that get() will not return an error.
 */
// Timeline.prototype.get = function (t) {
//   var result, timelineNode;
//
//   if (!this.ready()) {
//     throw new Error('Timeline [' + this.name + '] not ready.');
//   }
//
//   GlobalTime.freeze();
//
//   timelineNode = this.valueAt(t);
//
//   if (timelineNode !== null) {
//     result = timelineNode.value;
//   }
//   else {
//     if (this.timeline.lastValue().t > t && this.timeline.firstValue().t < t) {
//       if (this.interpolate !== null) {
//         // TODO: implement interpolations!!
//         result = this.interpolate(t);
//       }
//       else {
//         // If no interpolation is specified, return the previous value on the timeline.
//         // TODO: verify, but e.g. this may be when unit is not actually moving??
//         result = this.valueBefore(t).value;
//       }
//     }
//     else if (this.timeline.firstValue().t > t) {
//       // All values in the timeline are after t.
//       result = this.timeline.firstValue().value;
//     }
//     else {
//       // All values in the timeline are before t.
//       if (this.extrapolate !== null) {
//         // TODO: implement extrapolations!!
//         result = this.extrapolate(t, false); // TODO: wtf is the second arg?
//       }
//       else {
//         // If no extrapolation is specified, return the last value in the timeline.
//         result = this.timeline.lastValue().value;
//       }
//     }
//   }
//
//   GlobalTime.unfreeze();
//
//   return result;
// };
//
// /**
//  * Returns a list of values for the given time range.
//  */
// Timeline.prototype.getRange = function (tStart, tEnd) {
//   var resultList = [],
//       nodeAfter;
//
//   GlobalTime.freeze();
//
//   nodeAfter = this.valueAfter(tStart, true); // get timeline node instead of value.
//
//   while (nodeAfter !== null && nodeAfter.value.t <= tEnd) {
//     resultList.push(nodeAfter.value);
//
//     nodeAfter = nodeAfter.next;
//   }
//
//   GlobalTime.unfreeze();
//
//   return resultList;
// };
//
// /**
//  * Sets the value of the timeline at time t. Any previously set values later
//  * than t are removed.
//  *
//  * @TODO: support sendToRemote!
//  */
// Timeline.prototype.set = function (t, value, sendToRemote) {
//   var newTimeValue = TimeLine.createValue(t, value),
//       previousNodeOnTimeline;
//
//   GameTime.freeze();
//
//   // Find value whose time precedes t.
//
//   // First, assume its most likely the last value in the list.
//   if (this.timeline.isEmpty()) {
//     this.timeline.append(newTimeValue);
//   }
//   else {
//     previousNodeOnTimeline = this.timeline.tail;
//
//     if (previousNodeOnTimeline.value.t > t) {
//       previousNodeOnTimeline = this.valueBefore(t, true);
//     }
//
//     previousNodeOnTimeline.insertAfterAndDisposeTail(previousNodeOnTimeline, newTimeValue);
//   }
//
//   // TODO: implement head-shortening of timeline DLL.
//   // e.g.
//   // if (this.Length > _maximumLength)
//   // {
//   //     _values = _values.Next;
//   //     _values.Prev = null;
//   // }
//
//   // TODO: send to remote client through networking facility.
//
//   GameTime.unfreeze();
// };

// /**
//  * Creates a value object at given time.
//  */
// Timeline.createValue = function (t, value) {
//   return {
//     t: t,
//     value: value
//   };
// };


// function PositionTimeline () {
//
// };
//
// PositionTimeline.prototype = Timeline;
//
// PositionTimeline.prototype.interpolation = function () {
//   var prev = this.valueBefore(t),
//       next = this.valueAfter(t),
//       elapsedTime = next.t - prev.t,
//       resultX,
//       resultY;
//
//   resultX = (
//       1.0 * (t - prev.t) / elapsedTime * next.value.x
//     + 1.0 * (next.t - t) / elapsedTime * prev.value.x
//   );
//
//   resultY  = (
//       1.0 * (t - prev.t) / elapsedTime * next.value.y
//     + 1.0 * (next.t - t) / elapsedTime * prev.value.y
//   );
//
//   return {x: resultX, y: resultY};
// };

// function GTime () {
//   this._frozenTime    = null;   // TODO?!
//   this._frozenCounter = 0;
//
//   this._serverTimeOffset = 100; // TODO: THIS RIGHT NOW SIMULATES 100ms delay only for testing purposes!!!
// }

// /**
//  * Computes current time in ms adjusted to the offset from the server.
//  *
//  * This means this method does not give current local time, but an adjustment
//  * to be as close as possible to the server's local time.
//  */
// GTime.prototype.getCurrentTime = function () {
//   return Date.now() + this._serverTimeOffset;
// };
//
// /**
//  * Returns the frozen value of the clock; if clock is currently not frozen, it
//  * returns the current time.
//  *
//  * All times are adjusted for the offset from the server.
//  */
// GTime.prototype.getCurrentFrozenTime = function () {
//   if (this._frozenCounter > 0) {
//     return this._frozenTime;
//   }
//
//   return this.getCurrentTime();
// };
//
// /**
//  * Freezes the clock so that relative time does not change.
//  *
//  * This method is used at the start of Draw/Render method of the engine to freeze
//  * the time used by ngRTS clock and ensure that all values retrieved from a timeline
//  * using the get() method are relative to the same time point.
//  *
//  * This method must always be used in conjunction with unfreeze() method.
//  */
// GTime.prototype.freeze = function () {
//   if (this._frozenCounter === 0) {
//     this._frozenTime = this.getCurrentTime();
//   }
//
//   this._frozenCounter++;
// };
//
// /**
//  * Unfreezes the clock so that relative time updates.
//  *
//  * This method is used at the end of the draw/render method in the engine
//  * to unfreeze the time used by the ngRTS clock.
//  *
//  * This method must always be used in conjunction with the freeze() method.
//  */
// GTime.prototype.unfreeze = function () {
//   this._frozenCounter--;
// };
