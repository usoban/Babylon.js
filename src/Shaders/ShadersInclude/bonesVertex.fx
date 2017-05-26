#if NUM_BONE_INFLUENCERS > 0

	// mat4 loadBoneMatrix(float animationFrameOffset, float bone) {
	// 	uint baseIndex = animationFrameOffset*128;

	// 	// baseIndex += 4*bone;

	// 	uint baseU = 4*int(bone);
	// 	uint baseV = int(animationFrameOffset);

	// 	vec4 a = texture(emissiveSampler, vec2(baseU, baseV));
	// 	vec4 b = texture(emissiveSampler, vec2(baseU+1, baseV));
	// 	vec4 c = texture(emissiveSampler, vec2(baseU+2, baseV));
	// 	vec4 d = texture(emissiveSampler, vec2(baseU+3, baseV));

	// 	return mat4(vec4(0, 0, 0, 0), vec4(0, 0, 0, 0), vec4(0, 0, 0, 0), vec4(0, 0, 0, 0));

	// 	// return mat4(a, b, c, d);
	// }

	// mat4 influence;
	// influence = mBones[int(matricesIndices[0])] * matricesWeights[0];

	// #if NUM_BONE_INFLUENCERS > 1
	// 	influence += mBones[int(matricesIndices[1])] * matricesWeights[1];
	// #endif	
	// #if NUM_BONE_INFLUENCERS > 2
	// 	influence += mBones[int(matricesIndices[2])] * matricesWeights[2];
	// #endif	
	// #if NUM_BONE_INFLUENCERS > 3
	// 	influence += mBones[int(matricesIndices[3])] * matricesWeights[3];
	// #endif	

	// #if NUM_BONE_INFLUENCERS > 4
	// 	influence += mBones[int(matricesIndicesExtra[0])] * matricesWeightsExtra[0];
	// #endif	
	// #if NUM_BONE_INFLUENCERS > 5
	// 	influence += mBones[int(matricesIndicesExtra[1])] * matricesWeightsExtra[1];
	// #endif	
	// #if NUM_BONE_INFLUENCERS > 6
	// 	influence += mBones[int(matricesIndicesExtra[2])] * matricesWeightsExtra[2];
	// #endif	
	// #if NUM_BONE_INFLUENCERS > 7
	// 	influence += mBones[int(matricesIndicesExtra[3])] * matricesWeightsExtra[3];
	// #endif	

	// finalWorld = finalWorld * influence;
#endif