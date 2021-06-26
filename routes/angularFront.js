const wrapper = require("./librarys/myAsyncWrapper");

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('*', wrapper(async(req, res, next) => {
  if (req.csrfToken !== undefined) {
    res.cookie('CSRF-TOKEN', req.csrfToken());
  }

  const angularIndexPath = path.join(__dirname, '..', 'client/') + 'index.html';
  res.sendFile(angularIndexPath);
  return;
}));

module.exports = router;
