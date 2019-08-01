const axios = require("axios");
const uuidv1 = require("uuid/v1");

module.exports = async (event, Status, Data = {}, error = "") => {
  const { PhysicalResourceId, StackId, RequestId, LogicalResourceId } = event;
  const responseBody = JSON.stringify({
    Status,
    Reason: error,
    PhysicalResourceId: PhysicalResourceId || uuidv1(),
    StackId,
    RequestId,
    LogicalResourceId,
    Data
  });

  const responseOptions = {
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  };
  console.info("Response body:\n", responseBody);
  try {
    await axios.put(event.ResponseURL, responseBody, responseOptions);
    console.info("CloudFormationSendResponse Success");
  } catch (error) {
    console.error("CloudFormationSendResponse Error:");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
    }
    console.error(error.config);
    // A UnhandledPromiseRejectionWarning will be emitted here. See https://forums.aws.amazon.com/thread.jspa?threadID=283258 for details.
    throw new Error("Could not send CloudFormation response");
  }
};
