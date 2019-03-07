const CracoLessPlugin = require("craco-less");

module.exports = {
    devServer: {
        proxy: {
            '/ditt-nav-arbeidsgiver/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/ditt-nav-arbeidsgiver/api' : '/ditt-nav-arbeidsgiver-api/api'}
            }
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
