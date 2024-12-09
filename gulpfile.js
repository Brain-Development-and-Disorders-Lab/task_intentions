const del = require("del");

/**
 * Clean up build artefacts
 * @param {function} cb callback function
 */
function clean(cb) {
  del(["dist", ".pytest_cache", "api/logs", "api/.Rhistory"]);
  cb();
}

exports.clean = clean;
