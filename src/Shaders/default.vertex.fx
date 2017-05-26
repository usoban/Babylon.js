#include<__decl__defaultVertex>

// Attributes
attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef TANGENT
attribute vec4 tangent;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif

#include<bonesDeclaration>

// Uniforms
#include<instancesDeclaration>

#ifdef DIFFUSE
varying vec2 vDiffuseUV;
#endif

#ifdef AMBIENT
varying vec2 vAmbientUV;
#endif

#ifdef OPACITY
varying vec2 vOpacityUV;
#endif

#ifdef EMISSIVE
varying vec2 vEmissiveUV;
#endif

#ifdef LIGHTMAP
varying vec2 vLightmapUV;
#endif

#if defined(SPECULAR) && defined(SPECULARTERM)
varying vec2 vSpecularUV;
#endif

#ifdef BUMP
varying vec2 vBumpUV;
#endif

// Output
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif

#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

#include<bumpVertexDeclaration>

#include<clipPlaneVertexDeclaration>

#include<fogVertexDeclaration>
#include<shadowsVertexDeclaration>[0..maxSimultaneousLights]

#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]

#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif

#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif

#include<logDepthDeclaration>

// highp float rand(vec2 co)
// {
//     highp float a = 12.9898;
//     highp float b = 78.233;
//     highp float c = 43758.5453;
//     highp float dt= dot(co.xy ,vec2(a,b));
//     highp float sn= mod(dt,3.14);
//     return fract(sin(sn) * c);
// }

void main(void) {
	vec3 positionUpdated = position;
#ifdef NORMAL	
	vec3 normalUpdated = normal;
#endif
#ifdef TANGENT
	vec4 tangentUpdated = tangent;
#endif

#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]

#ifdef REFLECTIONMAP_SKYBOX
	vPositionUVW = positionUpdated;
#endif 

#include<instancesVertex>
#include<bonesVertex>
	gl_Position = viewProjection * finalWorld * vec4(positionUpdated, 1.0);

	vec4 worldPos = finalWorld * vec4(positionUpdated, 1.0);
	vPositionW = vec3(worldPos);

#ifdef NORMAL
	vNormalW = normalize(vec3(finalWorld * vec4(normalUpdated, 0.0)));
#endif

#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
	vDirectionW = normalize(vec3(finalWorld * vec4(positionUpdated, 0.0)));
#endif

	// Texture coordinates
#ifndef UV1
	vec2 uv = vec2(0., 0.);
#endif
#ifndef UV2
	vec2 uv2 = vec2(0., 0.);
#endif

#ifdef DIFFUSE
	if (vDiffuseInfos.x == 0.)
	{
		vDiffuseUV = vec2(diffuseMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vDiffuseUV = vec2(diffuseMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#ifdef AMBIENT
	if (vAmbientInfos.x == 0.)
	{
		vAmbientUV = vec2(ambientMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vAmbientUV = vec2(ambientMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#ifdef OPACITY
	if (vOpacityInfos.x == 0.)
	{
		vOpacityUV = vec2(opacityMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vOpacityUV = vec2(opacityMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#ifdef EMISSIVE
	if (vEmissiveInfos.x == 0.)
	{
		vEmissiveUV = vec2(emissiveMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vEmissiveUV = vec2(emissiveMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#ifdef LIGHTMAP
	if (vLightmapInfos.x == 0.)
	{
		vLightmapUV = vec2(lightmapMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vLightmapUV = vec2(lightmapMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#if defined(SPECULAR) && defined(SPECULARTERM)
	if (vSpecularInfos.x == 0.)
	{
		vSpecularUV = vec2(specularMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vSpecularUV = vec2(specularMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#ifdef BUMP
	if (vBumpInfos.x == 0.)
	{
		vBumpUV = vec2(bumpMatrix * vec4(uv, 1.0, 0.0));
	}
	else
	{
		vBumpUV = vec2(bumpMatrix * vec4(uv2, 1.0, 0.0));
	}
#endif

#include<bumpVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]

#ifdef VERTEXCOLOR
	// Vertex color
	vColor = color;

	// vec3 dColors[24];

	// dColors[0] = vec3(2.0/255.0, 64.0/255.0, 165.0/255.0);
	// dColors[1] = vec3(125.0/255.0, 135.0/255.0, 185.0/255.0);
	// dColors[2] = vec3(190.0/255.0,193.0/255.0,212.0/255.0);
	// dColors[3] = vec3(214.0/255.0,188.0/255.0,192.0/255.0);
	// dColors[4] = vec3(187.0/255.0,119.0/255.0,132.0/255.0);
	// dColors[5] = vec3(142.0/255.0,6.0/255.0,59.0/255.0);
	// dColors[6] = vec3(74.0/255.0,111.0/255.0,227.0/255.0);
	// dColors[7] = vec3(133.0/255.0,149.0/255.0,225.0/255.0);
	// dColors[8] = vec3(181.0/255.0,187.0/255.0,227.0/255.0);
	// dColors[9] = vec3(230.0/255.0,175.0/255.0,185.0/255.0);
	// dColors[10] = vec3(224.0/255.0,123.0/255.0,145.0/255.0);
	// dColors[11] = vec3(211.0/255.0,63.0/255.0,106.0/255.0);
	// dColors[12] = vec3(17.0/255.0,198.0/255.0,56.0/255.0);
	// dColors[13] = vec3(141.0/255.0,213.0/255.0,147.0/255.0);
	// dColors[14] = vec3(198.0/255.0,222.0/255.0,199.0/255.0);
	// dColors[15] = vec3(234.0/255.0,211.0/255.0,198.0/255.0);
	// dColors[16] = vec3(240.0/255.0,185.0/255.0,141.0/255.0);
	// dColors[17] = vec3(239.0/255.0,151.0/255.0,8.0/255.0);
	// dColors[18] = vec3(15.0/255.0,207.0/255.0,192.0/255.0);
	// dColors[19] = vec3(156.0/255.0,222.0/255.0,214.0/255.0);
	// dColors[20] = vec3(213.0/255.0,234.0/255.0,231.0/255.0);

#endif

#include<pointCloudVertex>
#include<logDepthVertex>

}