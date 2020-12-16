require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'technext1097258',
    api_key:'252745193421951',
    api_secret: 'jll56CdkLP6l-NLLtfDSQbAxLsI',
});

module.exports = { cloudinary };
