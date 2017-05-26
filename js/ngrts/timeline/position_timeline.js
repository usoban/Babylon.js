// ====================================
// 3D positional timeline (X, Y, Z).
// ====================================
class PositionTimeline extends Timeline {
  /**
   * Linear interpolation.
   */
  interpolate (t) {
    var prev = this.valueBefore(t),
        next = this.valueAfter(t),
        elapsedTime = next.t - prev.t,
        resultX,
        resultY,
        resultZ;

    resultX = (
        1.0 * (t - prev.t) / elapsedTime * next.value.x
      + 1.0 * (next.t - t) / elapsedTime * prev.value.x
    );

    resultY  = (
        1.0 * (t - prev.t) / elapsedTime * next.value.y
      + 1.0 * (next.t - t) / elapsedTime * prev.value.y
    );

    resultZ = (
        1.0 * (t - prev.t) / elapsedTime * next.value.z
      + 1.0 * (next.t - t) / elapsedTime * prev.value.z
    );

    return new BABYLON.Vector3(resultX, resultY, resultZ);
  }

  /**
   * Linear extrapolation.
   */
  extrapolate (t, sentToRemoteOnly) {
    var prev = this.valueBefore(t, sentToRemoteOnly),
        prevPrev = this.valueBefore(prev.t, sentToRemoteOnly),
        prevPosition = prev.value,
        prevPrevPosition,
        extrapolatedX,
        extrapolatedY,
        extrapolatedZ,
        velocityX,
        velocityY,
        velocityZ;

    if (prevPrev === null || prev.t === prevPrev.t) {
      extrapolatedX = prevPosition.x;
      extrapolatedY = prevPosition.y;
      extrapolatedZ = prevPosition.z;
    }
    else {
      prevPrevPosition = prevPrev.value;

      velocityX = (
        (1.0 * (prevPosition.x - prevPrevPosition.x)) /
        (1.0 * (prev.t - prevPrev.t))
      );
      velocityY = (
        (1.0 * (prevPosition.y - prevPrevPosition.y)) /
        (1.0 * (prev.t - prevPrev.t))
      );
      velocityZ = (
        (1.0 * (prevPosition.z - prevPrevPosition.z)) /
        (1.0 * (prev.t - prevPrev.t))
      );

      extrapolatedX = prevPosition.x + 1.0 * (velocityX * (t - prev.t));
      extrapolatedY = prevPosition.y + 1.0 * (velocityY * (t - prev.t));
      extrapolatedZ = prevPosition.z + 1.0 * (velocityZ * (t - prev.t));
    }

    // TODO
    return prevPosition;
    // return {x: extrapolatedX, y: extrapolatedY, z: extrapolatedZ};
  }
}
