#if NUM_BONE_INFLUENCERS > 0
	uniform mat4 mBones[BonesPerMesh];

	attribute vec4 matricesIndices;
	attribute vec4 matricesWeights;

	#if NUM_BONE_INFLUENCERS > 4
		attribute vec4 matricesIndicesExtra;
		attribute vec4 matricesWeightsExtra;
	#endif

	#ifdef INSTANCED_SKINNING
	uniform sampler2D instancedSkinningSampler;

	mat4 loadBoneMatrix(float frame, float bone) 
	{
		frame = max(frame, 1.0);
		frame = min(frame, 33.0);
		int baseU = 4*int(bone);
		int baseV = int(frame)-1;

		vec4 a = texelFetch(instancedSkinningSampler, ivec2(baseU, baseV), 0);
		vec4 b = texelFetch(instancedSkinningSampler, ivec2(baseU+1, baseV), 0);
		vec4 c = texelFetch(instancedSkinningSampler, ivec2(baseU+2, baseV), 0);
		vec4 d = texelFetch(instancedSkinningSampler, ivec2(baseU+3, baseV), 0);

		return mat4(a, b, c, d);
	}
	#endif
#endif