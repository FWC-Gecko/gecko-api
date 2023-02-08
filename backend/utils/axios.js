const axios = require('axios');

const axiosFunction = async (url, params) => {
  const { status, data } = await axios.get(url, {
    params,
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY },
  });

  return status.error_code === 200
    ? { success: true, data }
    : { success: false, error: status.error_message };
};

module.exports = axiosFunction;
