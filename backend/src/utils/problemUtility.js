const axios = require("axios");

const getLangById = (l) => {
  const lang = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 63,
  };
  return lang[l.toLowerCase()];
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  try {
    const response = await axios.request(options);
    
    return response.data; 
  } catch (error) {
  console.error(
    "Error submitting batch to Judge0:",
    error.response?.status,
    error.response?.data || error.message
  );
  return null;

  }
};


/**
 * @param {number} time
 */
const waiting = (time) => {
   return new Promise(resolve => setTimeout(resolve, time));
}

const submitToken = async (result) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: result.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching tokens from Judge0:", error.message);
      // Return null so we can check if the fetch failed
      return null;
    }
  }

  while (true) {
    const res = await fetchData();
    
    // Check if res is valid before proceeding
    if (!res || !res.submissions || res.submissions.length === 0) {
        console.error("Judge0 polling failed, breaking loop.");
        return []; 
    }

    // Status_id > 2 means the submission is FINISHED (Accepted, Wrong, or Error)
    const isResultObtained = res.submissions.every((r) => r.status_id > 2);
    if (isResultObtained) return res.submissions;

    // AWAIT the promise to genuinely pause the execution
    await waiting(1000);
  }
};

module.exports = { getLangById, submitBatch, submitToken };