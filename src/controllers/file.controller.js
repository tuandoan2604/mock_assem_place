const util = require('util');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services/index');

const unlinkFile = util.promisify(fs.unlink);

const upload = catchAsync(async (req, res) => {
  const imageFormat = ['.png', '.jpg', '.esp', '.gif', '.jpeg', '.bmp', '.tif', '.tiff'];
  const { file } = req;
  const filename = req.file.originalname;
  const format = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  let type = 'videos';
  if (imageFormat.indexOf(format) > -1) type = 'images';
  const result = await fileService.uploadFile(file, type, format);
  await unlinkFile(file.path);
  res.send({ imagePath: result.Location, format: type });
});

module.exports = {
  upload,
};
