const del = require("del");

/**
 * Clean up build artefacts
 * @param {function} cb callback function
 */
function clean(cb) {
  del(["dist"]);
  cb();
}

exports.clean = clean;
