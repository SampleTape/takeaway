import axios from "axios";
import sha1 from "sha1";

axios.defaults.baseURL = "/apicloud";

function getApi(url) {
  var app_id = "A6100803940313";
  var now = Date.now();
  var appKey =
    sha1(app_id + "UZ" + "2B9B8497-6792-4871-CB08-FBFC2FA0D82B" + "UZ" + now) +
    "." +
    now;
  // 返回 promise
  return axios({
    method: "get",
    url,
    headers: {
      "X-APICloud-AppId": app_id,
      "X-APICloud-AppKey": appKey
    }
  });
}
function postApi(url, data) {
  var app_id = "A6100803940313";
  var now = Date.now();
  var appKey =
    sha1(app_id + "UZ" + "2B9B8497-6792-4871-CB08-FBFC2FA0D82B" + "UZ" + now) +
    "." +
    now;
  return axios({
    method: "post",
    url,
    headers: {
      "X-APICloud-AppId": app_id,
      "X-APICloud-AppKey": appKey
    },
    data
  });
}

export { getApi, postApi };
