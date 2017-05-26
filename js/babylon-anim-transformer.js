class AnimationTransformer {
    // https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch02.html
    // save each bone matrix for each frame for each animation linearly into a texture

    static recordAnimationBoneMatrices(skeleton, scene) {
        const N_FRAMES = 33,
              PAD_TEX_WIDTH = 128,
              PAD_TEX_SIZE = PAD_TEX_WIDTH * N_FRAMES,
              BUFFER_LENGTH = PAD_TEX_SIZE * 4;

        let animatable = scene.beginAnimation(skeleton, 0, N_FRAMES, false),
            buffer = new Float32Array(BUFFER_LENGTH);

        for (let i = 0; i < N_FRAMES; i++) {        
            animatable.goToFrame(i+1);

            skeleton._transformMatrices = null;
            skeleton._isDirty = true;

            let matrices = skeleton.getTransformMatrices();
            
            console.log('len for frame [' + i + '] is ' + matrices.length + '(writing @' + i*PAD_TEX_WIDTH*4 + ')');

            buffer.set(matrices, i*PAD_TEX_WIDTH*4);
        }

        console.log(buffer, Math.max(...buffer), Math.min(...buffer))

        return new BABYLON.RawTexture(buffer, PAD_TEX_WIDTH, N_FRAMES, BABYLON.Engine.TEXTUREFORMAT_RGBA, scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE, BABYLON.Engine.TEXTURETYPE_FLOAT);
    }
}