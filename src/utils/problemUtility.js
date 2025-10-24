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
      base64_encoded: "false", //this is a format
      //made this false also
    },
    headers: {
      "x-rapidapi-key": "b19c0d193emsh2f76f098c637e3dp1e2bacjsnd1761b6ae610",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data; //see the response format from the documentation
    } catch (error) {
      console.error(error);
    }
  }
  return await fetchData();
};

const waiting=async (time)=>{
   setTimeout(()=>{
    return 1;
   },time);
}

const submitToken = async (result) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: result.join(","), //join converts array into string based on your delimeter
      base64_encoded: "false", // here also , make this false
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "b19c0d193emsh2f76f098c637e3dp1e2bacjsnd1761b6ae610",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const res = await fetchData();
    const isResultObtained = res.submissions.every((r) => r.status_id > 2);
    if (isResultObtained) return res.submissions;

    await waiting(1000);
  }
};

module.exports = { getLangById, submitBatch, submitToken };
