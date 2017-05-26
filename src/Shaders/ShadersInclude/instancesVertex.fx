#ifdef INSTANCES
	mat4 finalWorld = mat4(vec4(world0[0], world0[1], world0[2], 0), vec4(world1[0], world1[1], world1[2], 0), world2, world3);

	float animationIndex = world0[3];
	float animationFrameOffset = world1[3];
#else
	mat4 finalWorld = world;
#endif