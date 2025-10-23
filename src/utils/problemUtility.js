const axios = require("axios");
const getLangById = (l) => {
  const lang = {
    "c++": 54,
    java: 62,
    javascript: 63,
  };
  return lang[l.toLowerCase()];
};

const submitBatch = async (submissions) => {

  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "true",    //this is a format
    },
    headers: {
      "x-rapidapi-key": "b19c0d193emsh2f76f098c637e3dp1e2bacjsnd1761b6ae610",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;    //see the response format from the documentation
    } catch (error) {
      console.error(error);
    }
  }
  return await fetchData();
};

module.exports = { getLangById, submitBatch };
