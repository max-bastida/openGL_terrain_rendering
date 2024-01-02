#version 330

in vec3 Normal;
in vec3 position;
in float height;
in vec2 texCoord;
uniform vec3 lightPos;
uniform sampler2D waterTex;
uniform sampler2D grassTex;
uniform sampler2D rockTex;
uniform sampler2D snowTex;
uniform float waterHeight;
uniform vec4 eyePos;

void main() 
{
    float ambStrength = 0.4;
    vec3 lightColor = vec3(0.7,1,1);
    vec4 objectColor;
    vec3 ambient = lightColor * ambStrength;

    vec3 lightDir = normalize(lightPos - position);
    float diff = max(dot(Normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
    float m = 0.0f;

    float waterEdge = waterHeight - 0.2f;
    float grassEnd = 3.0f;
    float rockStart = 4.0f;
    float rockEnd = 6.0f;
    float snowStart = 8.0f;

    if (height <= waterEdge){
        m =1.0f;
        float ratio = (waterEdge - height)/(waterEdge) * 0.4;
        vec4 shadowCol = vec4(ratio, ratio, ratio, 0.0f);
        objectColor = texture(waterTex, texCoord) - shadowCol;
    } else if (height <= waterHeight){
        m =1.0f;
        float ratio = (1 - (waterHeight - height)/(waterHeight - waterEdge)) * 0.7;
        vec4 foamCol = vec4(ratio, ratio, ratio, 1.0f);
        objectColor = texture(waterTex, texCoord) + foamCol;
    }else if (height <= grassEnd){
        objectColor = texture(grassTex, texCoord);
    } else if (height <= rockStart){
        float ratio = (rockStart - height)/(rockStart - grassEnd);
        objectColor = ratio * texture(grassTex, texCoord) + (1 - ratio) * texture(rockTex, texCoord);
    } else if (height <= rockEnd){
        objectColor = texture(rockTex, texCoord);
    } else if (height <= snowStart) {
        float ratio = (snowStart - height)/(snowStart - rockEnd);
        objectColor = ratio * texture(rockTex, texCoord) + (1 - ratio) * texture(snowTex, texCoord);
    } else {
        objectColor = texture(snowTex, texCoord);
    }

    vec3 viewDir = normalize(vec3(eyePos.x,eyePos.y,eyePos.z) - position);
    vec3 ray = normalize(reflect(lightDir, Normal));
    float specularFactor = dot(viewDir, ray);
    vec3 specular = vec3(0,0,0);
    if (specularFactor > 0){
        specular = lightColor * m * pow(specularFactor, 32) ;
    }
    gl_FragColor = objectColor * vec4((ambient + diffuse), 1.0);
}
