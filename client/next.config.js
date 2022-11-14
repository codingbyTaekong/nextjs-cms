const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  

  // target: "serverless",
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  webpack(conf) {
    conf.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  // Enable figma's wrong mask-type attribute work
                  removeRasterImages: false,
                  removeStyleElement: false,
                  removeUnknownsAndDefaults: false,
                  // Enable svgr's svg to fill the size
                  removeViewBox: false,
                },
              ],
            },
          },
        },
      ],
    });
    // 절대경로
    conf.resolve.modules.push(__dirname);
    return conf;
  },
  // async rewrites() {
  //   return [
  //     {
  //         source: '/api/jandi',
  //         destination: 'https://wh.jandi.com/connect-api/webhook/14743284/6a3d9a2d676faaa6afb9650edbcdd6e5',
  //     },
  //   ]
  // },
});