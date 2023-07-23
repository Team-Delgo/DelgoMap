// import { override, addBabelPreset, addBabelPlugin } from 'customize-cra';

// export default override(
//   // babel 설정
//   addBabelPreset('@babel/preset-env'),
//   addBabelPreset('@babel/preset-react'),
//   addBabelPreset('@babel/preset-typescript'),
  

//   // webpack 설정
//   (config) => {
//     config.output.filename = 'static/js/[name].[hash:8].js';
//     config.output.chunkFilename = 'static/js/[name].[hash:8].chunk.js';
//     return config;
//   }
// );
module.exports = {
  webpack: function (config, env) {
    config.output.filename = 'static/js/[name].[hash:8].js';
    config.output.chunkFilename = 'static/js/[name].[hash:8].chunk.js';
    return config;
  }
};