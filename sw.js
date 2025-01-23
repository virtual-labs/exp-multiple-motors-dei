importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([{"revision":"7cc40c199d128af6b01e74a28c5900b0","url":"assets/css/bootstrap.min.css"},{"revision":"b1e92a5593c58e6832c7f6dce30a06ce","url":"assets/css/common-styles-responsive.css"},{"revision":"77f3d6639e02a6b774981b1ad75806f5","url":"assets/css/common-styles.css"},{"revision":"22d85286c513f3d4038c42b486ea1bf6","url":"assets/css/fontawesome.min.css"},{"revision":"613745964e452941615d4e3d1a387ab7","url":"assets/css/github-markdown.min.css"},{"revision":"a394012067cf46c79ab70d75f9caf500","url":"assets/css/katex.min.css"},{"revision":"53b8e50f782f63519dc05b76bd1d9c49","url":"assets/css/toast.css"},{"revision":"6d9501ec2a9a6e52b90a8d27340202b6","url":"assets/css/vlabs-style.css"},{"revision":"269550530cc127b6aa5a35925a7de6ce","url":"assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css"},{"revision":"912ec66d7572ff821749319396470bde","url":"assets/fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.svg"},{"revision":"ff2be0cf35ad764cfcc9779f148aa8ac","url":"assets/images/favicon.png"},{"revision":"59cbb9b31115938b15a1786dcedd7796","url":"assets/images/logo-new.png"},{"revision":"97524ffa51690acdcb0e54a4f5b8502a","url":"assets/images/logo.png"},{"revision":"7d45f6653f4b7219600292be2d83f1b4","url":"assets/images/popout.png"},{"revision":"7924fe35ba7c22ce467efd504cce93d7","url":"assets/images/vlabs-color-small-moe.jpg"},{"revision":"1eb55c09b5d84050d497a664520d2255","url":"assets/js/assessment_v2.js"},{"revision":"31ecd36dd9f2e26b04f3795097445547","url":"assets/js/assessment.js"},{"revision":"5000362f34eee7667adb9dbd883f2217","url":"assets/js/event-handler.js"},{"revision":"0f6278fc4d074348edaba4042b4dd1f8","url":"assets/js/iframeResize.js"},{"revision":"4ae9cbf2f402c4a1dde3d8f0e3e8cf1b","url":"assets/js/instruction-box.js"},{"revision":"d9b11ca4d877c327889805b73bb79edd","url":"assets/js/jquery-3.4.1.slim.min.js"},{"revision":"bc2456c37c311bbdd25f4f54e0e8d1b9","url":"assets/js/toggleSidebar.js"},{"revision":"30ef592489ce0ac84ab367ce9eb0d597","url":"assets/js/webcomponents-loader.min.js"},{"revision":"0f2e317d41fb69dfb0270dbdf749e380","url":"assets/js/zero-md.min.js"},{"revision":"caf1062309e21ed583d00d24cac20912","url":"assets/katex_assets/katex.min.css"},{"revision":"fccaeb3529e17f8b78a55699cede1ad8","url":"feedback.html"},{"revision":"c145af1e5a23cdb832258aa81e0c9e98","url":"index.html"},{"revision":"02f060ab0bfa7091a23d4ca41eb2c69d","url":"performance-report.html"},{"revision":"914e243a5d6373b22585e9bdd0c25eef","url":"plugins/svc-rating/checkEventSubmission.js"},{"revision":"e99077e253b07129d0b9755e6a06f93f","url":"plugins/svc-rating/config.js"},{"revision":"40bc0d089f560247a1bfb0cd151232ad","url":"plugins/svc-rating/imageData.js"},{"revision":"a47af25e8d8500c59a6c26bac42a0cd9","url":"plugins/svc-rating/images/empty-star.svg"},{"revision":"6ad37561267a21d6bcb558f9c7c3fe8a","url":"plugins/svc-rating/images/half-star.svg"},{"revision":"7924fe35ba7c22ce467efd504cce93d7","url":"plugins/svc-rating/images/logo.jpg"},{"revision":"f2be5f1d57e0a2c690e34cf9095bed16","url":"plugins/svc-rating/images/mobile_rating_icon.png"},{"revision":"17c8ce8f2faa7937f7978a4dfb69df3a","url":"plugins/svc-rating/images/mobile-icon.svg"},{"revision":"96102a862f070a61a20193b621188ef3","url":"plugins/svc-rating/images/star.svg"},{"revision":"e083f28aa9e5a670a2e5de02197c261f","url":"plugins/svc-rating/index.html"},{"revision":"db18c05646b11f1fa66ef3ebb87116ca","url":"plugins/svc-rating/index.js"},{"revision":"fdc8b6772fb88081e86497fd2f75e20b","url":"plugins/svc-rating/package-lock.json"},{"revision":"7039ff00a75fd32443048e6ed0020a91","url":"plugins/svc-rating/package.json"},{"revision":"1ed592c19b20d396536ebd3611f3ef40","url":"plugins/svc-rating/rating-display.js"},{"revision":"0267f54f7993bcd47793dd7f7be56c92","url":"plugins/svc-rating/rating-submit.js"},{"revision":"57e53998ce85ab911eea27fdc421480d","url":"plugins/svc-rating/rating.js"},{"revision":"1bb81f97b0723bfdd89184d485a0ecad","url":"plugins/tool-performance/config.json"},{"revision":"3062d3749c84c5dc3fc7013e11376fce","url":"plugins/tool-performance/css/main.css"},{"revision":"8ec7b430663c34b8e9882c923e34e86e","url":"plugins/tool-performance/index.html"},{"revision":"6fc8455688b00e5dd6d392b61743473a","url":"plugins/tool-performance/js/api/gsc.js"},{"revision":"d62937417a11fee561c78bf3b145d85d","url":"plugins/tool-performance/js/api/lighthouse.js"},{"revision":"d42b124fa3c85371ea563f49f38e5a3d","url":"plugins/tool-performance/js/commonData.js"},{"revision":"11e328184e68c05f60030c19aa4efca9","url":"plugins/tool-performance/js/main.js"},{"revision":"66d4aa241bb986851066c1684270d236","url":"plugins/tool-performance/js/parse.js"},{"revision":"3f82067c934ff332a430c76f9e37b260","url":"plugins/tool-performance/js/populate/gsc.js"},{"revision":"9e183c67dc9157cd26b8a076ccf04d69","url":"plugins/tool-performance/js/populate/lighthouse.js"},{"revision":"1709dc5f9149e869449dcb2b7a8b3a20","url":"plugins/tool-performance/js/util.js"},{"revision":"1bb81f97b0723bfdd89184d485a0ecad","url":"plugins/tool-validation/config.json"},{"revision":"95c086500b7a5941bd950f22c888cc41","url":"plugins/tool-validation/css/main.css"},{"revision":"8c8a8e5422cc687a53deffd1326e5556","url":"plugins/tool-validation/index.html"},{"revision":"a35ebe17ce73daf38433381fbe0071de","url":"plugins/tool-validation/js/link_validation.js"},{"revision":"acc595e531160409a0194bf7190696d0","url":"plugins/tool-validation/js/main.js"},{"revision":"49049daf46cd95b6d8754b4df6cd57b2","url":"plugins/tool-validation/package-lock.json"},{"revision":"3e614b98b80bb07eef3338b563d697af","url":"plugins/tool-validation/package.json"},{"revision":"2fd60d614e32bebea1b271e92f8c07f4","url":"posttest.html"},{"revision":"58a290cf1450e6399e39fd966dc19bb1","url":"posttest.json"},{"revision":"79a32ac7e4a5db3b46d80e50d7ade9d3","url":"pretest.html"},{"revision":"72db28df0da2bf15f17edf67eea95a92","url":"pretest.json"},{"revision":"21d8067b70b7728b39b47bbe4c3e67e9","url":"procedure.html"},{"revision":"9a5d7d171f7645d620eb40be33080c9d","url":"references.html"},{"revision":"40e81f7f3dfcbad4642e49f765a1a44b","url":"simulation.html"},{"revision":"c6a99d430cfd7c4f7da6cdf034f6f38f","url":"simulation/index.html"},{"revision":"7f719101020faa39defb9b92ae3a92e5","url":"simulation/simulation_1/index.html"},{"revision":"982eb5cefe75463921860e4e9e4fc0c9","url":"simulation/simulation_1/ledsim.html"},{"revision":"f6e302cabf669b667c43aa0c09f64a70","url":"simulation/simulation_1/src/css/style.css"},{"revision":"cb38a2318bf1171fea41f8ac2f6133a4","url":"simulation/simulation_1/src/images/dc_off.png"},{"revision":"d8a55dd7c59619810dd282665fa24086","url":"simulation/simulation_1/src/js/main.js"},{"revision":"6004cdab96d4af240e46465a8b211b8a","url":"simulation/simulation_2/index.html"},{"revision":"270f3f7ae2906cc09b730c681e946fca","url":"simulation/simulation_2/singleLed.html"},{"revision":"eea284dd78c60485b296af4371a2e643","url":"simulation/simulation_2/src/css/style.css"},{"revision":"83fe53a2a23c2fffc869d7b32794fe88","url":"simulation/simulation_2/src/images/servo_off.png"},{"revision":"2d4308d230f26683702b16f5545cd94c","url":"simulation/simulation_2/src/js/main.js"},{"revision":"3f09c1934ba6667800cd9afdf3f3f19c","url":"simulation/simulation_2/src/multipleLed.html"},{"revision":"92c747b455693cfcf10e0be1daed1fb8","url":"simulation/simulation_3/src/css/style.css"},{"revision":"d5a811a5476a85b72e7e661418c700ca","url":"simulation/simulation_3/src/js/main.js"},{"revision":"84dc7658118d6a18c4d4c9b965ba82a3","url":"simulation/simulation_4/index.html"},{"revision":"ff48046007c4c4624aa0a3ff9ed3b377","url":"simulation/simulation_4/ledsim.html"},{"revision":"e892bb5fcc8b3f7e32263e274e4bdde3","url":"simulation/simulation_4/src/css/style.css"},{"revision":"f0c314a0d8acd0d001396db45aad8e7d","url":"simulation/simulation_4/src/images/stepper_off.png"},{"revision":"c80972ac29fd0d26bedbb454e99a155a","url":"simulation/simulation_4/src/js/main.js"},{"revision":"b5971dcae1a03021b722976d14435432","url":"simulation/src/css/expSelector.css"},{"revision":"653347eb2fda6200bfad958327f24fd7","url":"simulation/src/css/style.css"},{"revision":"f3df172417a354fa24bc9a76fa7035c5","url":"simulation/src/js/main.js"},{"revision":"32eb7005295655076108aed632efc956","url":"theory.html"},{"revision":"f514096f425199b15c19ece05823bf11","url":"validator-report.html"}]);

// Add runtime caching for images, fonts, js, css.
workbox.routing.registerRoute(
    ({request}) => request.destination === 'script' || request.destination === 'style' || request.destination === 'font' || request.destination === 'image',
    new workbox.strategies.CacheFirst()
);

// Cache the json data from url https://github.com/exp-adder-circuit-iiith/pretest.json
// workbox.routing.registerRoute(
//     ({url}) => url.origin === 'https://github.com' && url.pathname === '/exp-adder-circuit-iiith/pretest.json',
//     new workbox.strategies.NetworkFirst()
// );