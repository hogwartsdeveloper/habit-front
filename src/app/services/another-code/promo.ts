export const skyVertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`;

export const skyFragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize( vWorldPosition + offset ).y;
      gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    }`;

export const groundSharedPrefix = `
      uniform sampler2D noiseTexture;
      float getYPosition(vec2 p){
          return 8.0*(2.0*texture2D(noiseTexture, p/800.0).r - 1.0);
      }
    `;

export const groundVertex =
  groundSharedPrefix +
  ` 
      attribute vec3 basePosition;
      uniform float delta;
      uniform float posX;
      uniform float posZ;
      uniform float radius;
      uniform float width;
      
      float placeOnSphere(vec3 v){
        float theta = acos(v.z/radius);
        float phi = acos(v.x/(radius * sin(theta)));
        float sV = radius * sin(theta) * sin(phi);
        //If undefined, set to default value
        if(sV != sV){
          sV = v.y;
        }
        return sV;
      }
      
      //Get the position of the ground from the [x,z] coordinates, the sphere and the noise height field
      vec3 getPosition(vec3 pos, float epsX, float epsZ){
        vec3 temp;
        temp.x = pos.x + epsX;
        temp.z = pos.z + epsZ;
        temp.y = max(0.0, placeOnSphere(temp)) - radius;
        temp.y += getYPosition(vec2(basePosition.x+epsX+delta*floor(posX), basePosition.z+epsZ+delta*floor(posZ)));
        return temp;
      }
      
      //Find the normal at pos as the cross product of the central-differences in x and z directions
      vec3 getNormal(vec3 pos){
        float eps = 1e-1;
      
        vec3 tempP = getPosition(pos, eps, 0.0);
        vec3 tempN = getPosition(pos, -eps, 0.0);
        
        vec3 slopeX = tempP - tempN;
      
        tempP = getPosition(pos, 0.0, eps);
        tempN = getPosition(pos, 0.0, -eps);
      
        vec3 slopeZ = tempP - tempN;
      
        vec3 norm = normalize(cross(slopeZ, slopeX));
        return norm;
      }
      `;

export const groundVertexShaderReplace = `//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
			vec3 pos = vec3(0);
      pos.x = basePosition.x - mod(mod((delta*posX),delta) + delta, delta);
      pos.z = basePosition.z - mod(mod((delta*posZ),delta) + delta, delta);
      pos.y = max(0.0, placeOnSphere(pos)) - radius;
      pos.y += getYPosition(vec2(basePosition.x+delta*floor(posX), basePosition.z+delta*floor(posZ)));
      vec3 objectNormal = getNormal(pos);
#ifdef USE_TANGENT
      vec3 objectTangent = vec3( tangent.xyz );
#endif`;

export const grassVertexSource = (bladeHeight: number) =>
  groundSharedPrefix +
  `
    precision mediump float;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 offset;
    attribute vec2 uv;
    attribute vec2 halfRootAngle;
    attribute float scale;
    attribute float index;
    uniform float time;

    uniform float delta;
    uniform float posX;
    uniform float posZ;
    uniform float radius;
    uniform float width;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float frc;
    varying float idx;

    const float PI = 3.1415;
    const float TWO_PI = 2.0 * PI;


    //https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
    vec3 rotateVectorByQuaternion(vec3 v, vec4 q){
      return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
    }

    float placeOnSphere(vec3 v){
      float theta = acos(v.z/radius);
      float phi = acos(v.x/(radius * sin(theta)));
      float sV = radius * sin(theta) * sin(phi);
      //If undefined, set to default value
      if(sV != sV){
        sV = v.y;
      }
      return sV;
    }

    void main() {

    	//Vertex height in blade geometry
    	frc = position.y / float(` +
  bladeHeight +
  `);

    	//Scale vertices
      vec3 vPosition = position;
    	vPosition.y *= scale;

    	//Invert scaling for normals
    	vNormal = normal;
    	vNormal.y /= scale;

    	//Rotate blade around Y axis
      vec4 direction = vec4(0.0, halfRootAngle.x, 0.0, halfRootAngle.y);
    	vPosition = rotateVectorByQuaternion(vPosition, direction);
    	vNormal = rotateVectorByQuaternion(vNormal, direction);

      //UV for texture
      vUv = uv;

    	vec3 pos;
    	vec3 globalPos;
    	vec3 tile;

    	globalPos.x = offset.x-posX*delta;
    	globalPos.z = offset.z-posZ*delta;

    	tile.x = floor((globalPos.x + 0.5 * width) / width);
    	tile.z = floor((globalPos.z + 0.5 * width) / width);

    	pos.x = globalPos.x - tile.x * width;
    	pos.z = globalPos.z - tile.z * width;

    	pos.y = max(0.0, placeOnSphere(pos)) - radius;
    	pos.y += getYPosition(vec2(pos.x+delta*posX, pos.z+delta*posZ));

    	//Position of the blade in the visible patch [0->1]
      vec2 fractionalPos = 0.5 + offset.xz / width;
      //To make it seamless, make it a multiple of 2*PI
      fractionalPos *= TWO_PI;

      //Wind is sine waves in time.
      float noise = 0.5 + 0.5 * sin(fractionalPos.x + time);
      float halfAngle = -noise * 0.1;
      noise = 0.5 + 0.5 * cos(fractionalPos.y + time);
      halfAngle -= noise * 0.05;

    	direction = normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle)));

    	//Rotate blade and normals according to the wind
      vPosition = rotateVectorByQuaternion(vPosition, direction);
    	vNormal = rotateVectorByQuaternion(vNormal, direction);

    	//Move vertex to global location
    	vPosition += pos;

    	//Index of instance for varying colour in fragment shader
    	idx = index;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

    }`;

export const grassFragmentSource = `
    precision mediump float;

    uniform vec3 cameraPosition;

    //Light uniforms
    uniform float ambientStrength;
    uniform float diffuseStrength;
    uniform float specularStrength;
    uniform float translucencyStrength;
    uniform float shininess;
    uniform vec3 lightColour;
    uniform vec3 sunDirection;


    //Surface uniforms
    uniform sampler2D map;
    uniform sampler2D alphaMap;
    uniform vec3 specularColour;

    varying float frc;
    varying float idx;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    vec3 ACESFilm(vec3 x){
    	float a = 2.51;
    	float b = 0.03;
    	float c = 2.43;
    	float d = 0.59;
    	float e = 0.14;
    	return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
    }

    void main() {

      //If transparent, don't draw
      if(texture2D(alphaMap, vUv).r < 0.15){
        discard;
      }

    	vec3 normal;

    	//Flip normals when viewing reverse of the blade
    	if(gl_FrontFacing){
    		normal = normalize(vNormal);
    	}else{
    		normal = normalize(-vNormal);
    	}

      //Get colour data from texture
    	vec3 textureColour = pow(texture2D(map, vUv).rgb, vec3(2.2));

      //Add different green tones towards root
    	vec3 mixColour = idx > 0.75 ? vec3(0.2, 0.8, 0.06) : vec3(0.5, 0.8, 0.08);
      textureColour = mix(0.1 * mixColour, textureColour, 0.75);

    	vec3 lightTimesTexture = lightColour * textureColour;
      vec3 ambient = textureColour;
    	vec3 lightDir = normalize(sunDirection);

      //How much a fragment faces the light
    	float dotNormalLight = dot(normal, lightDir);
      float diff = max(dotNormalLight, 0.0);

      //Colour when lit by light
      vec3 diffuse = diff * lightTimesTexture;

      float sky = max(dot(normal, vec3(0, 1, 0)), 0.0);
    	vec3 skyLight = sky * vec3(0.12, 0.29, 0.55);

      vec3 viewDirection = normalize(cameraPosition - vPosition);
      vec3 halfwayDir = normalize(lightDir + viewDirection);
      //How much a fragment directly reflects the light to the camera
      float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);

      //Colour of light sharply reflected into the camera
      vec3 specular = spec * specularColour * lightColour;

    	//https://en.wikibooks.org/wiki/GLSL_Programming/Unity/Translucent_Surfaces
    	vec3 diffuseTranslucency = vec3(0);
    	vec3 forwardTranslucency = vec3(0);
    	float dotViewLight = dot(-lightDir, viewDirection);
    	if(dotNormalLight <= 0.0){
    		diffuseTranslucency = lightTimesTexture * translucencyStrength * -dotNormalLight;
    		if(dotViewLight > 0.0){
    			forwardTranslucency = lightTimesTexture * translucencyStrength * pow(dotViewLight, 16.0);
    		}
    	}

      vec3 col = 0.3 * skyLight * textureColour + ambientStrength * ambient + diffuseStrength * diffuse + specularStrength * specular + diffuseTranslucency + forwardTranslucency;

    	//Add a shadow towards root
    	col = mix(0.35*vec3(0.1, 0.25, 0.02), col, frc);

      //Tonemapping
      col = ACESFilm(col);

      //Gamma correction 1.0/2.2 = 0.4545...
    	col = pow(col, vec3(0.4545));

      gl_FragColor = vec4(col, 1.0);
    }`;

export const skyVertexShader2 = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4( position, 1.0 );    
		}
`;

export const skyFragmentShader2 = `
		varying vec2 vUv;
		uniform vec2 resolution;
		uniform vec3 sunDirection;
		uniform float fogFade;
		uniform float fov;

		const vec3 skyColour = 0.6 * vec3(0.02, 0.2, 0.9);
		//Darken sky when looking up
		vec3 getSkyColour(vec3 rayDir){
			return mix(0.35*skyColour, skyColour, pow(1.0-rayDir.y, 4.0));
		}

		//https://iquilezles.org/www/articles/fog/fog.htm
		vec3 applyFog(vec3 rgb, vec3 rayOri, vec3 rayDir, vec3 sunDir){
			//Make horizon more hazy
			float dist = 4000.0;
			if(abs(rayDir.y) < 0.0001){rayDir.y = 0.0001;}
			float fogAmount = 1.0 * exp(-rayOri.y*fogFade) * (1.0-exp(-dist*rayDir.y*fogFade))/(rayDir.y*fogFade);
			float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
			vec3 fogColor  = mix(vec3(0.35, 0.5, 0.9), vec3(1.0, 1.0, 0.75), pow(sunAmount, 16.0) );
		return mix(rgb, fogColor, clamp(fogAmount, 0.0, 1.0));
		}

    vec3 ACESFilm(vec3 x){
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
    }
  
		vec3 rayDirection(float fieldOfView, vec2 fragCoord) {
      vec2 xy = fragCoord - resolution.xy / 2.0;
      float z = (0.5 * resolution.y) / tan(radians(fieldOfView) / 2.0);
      return normalize(vec3(xy, -z));
    }

		//https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL/
		mat3 lookAt(vec3 camera, vec3 at, vec3 up){
			vec3 zaxis = normalize(at-camera);    
			vec3 xaxis = normalize(cross(zaxis, up));
			vec3 yaxis = cross(xaxis, zaxis);

			return mat3(xaxis, yaxis, -zaxis);
		}

		float getGlow(float dist, float radius, float intensity){
			dist = max(dist, 1e-6);
			return pow(radius/dist, intensity);	
		}

		void main() {

    	vec3 target = vec3(0.0, 0.0, 0.0);
    	vec3 up = vec3(0.0, 1.0, 0.0);
			vec3 rayDir = rayDirection(fov, gl_FragCoord.xy);

			//Get the view matrix from the camera orientation
			mat3 viewMatrix_ = lookAt(cameraPosition, target, up);

			//Transform the ray to point in the correct direction
			rayDir = viewMatrix_ * rayDir;

			vec3 col = getSkyColour(rayDir);

    	//Draw sun
			vec3 sunDir = normalize(sunDirection);
			float mu = dot(sunDir, rayDir);
    	col += vec3(1.0, 1.0, 0.8) * getGlow(1.0-mu, 0.00005, 0.9);

    	col += applyFog(col, vec3(0,1000,0), rayDir, sunDir);

			//Tonemapping
			col = ACESFilm(col);

			//Gamma correction 1.0/2.2 = 0.4545...
			col = pow(col, vec3(0.4545));

			gl_FragColor = vec4(col, 1.0 );
		}
`;
