const moment = require("moment");
const mongoose = require("mongoose");
const { hexToBase, decimalToBase } = require("../utils/utils");
const URL = require("../models/URL");

const ERROR_CODE_DUPLICATE_KEY = 11000;
const MAX_RETRY_ATTEMPTS = 3;

const generateCandidates = (objectId, milliseconds = 0) => {
  const objectIdString = objectId.toString();
  // extract parts
  const candidates = [];
  const candidateParts = [];
  // timestamp
  candidateParts.push(hexToBase(objectIdString.slice(0, 8), 62));
  // milliseconds
  candidateParts.push(decimalToBase(milliseconds, 62));
  // machine number
  // commented out and can be added for scalability
  // candidateParts.push(hexToBase(objectIdString.slice(8, 14)));
  // process number
  candidateParts.push(hexToBase(objectIdString.slice(14, 18), 62));
  // increment
  candidateParts.push(hexToBase(objectIdString.slice(18), 62));

  // Possible room for improvement: use different permutations
  // or add more candidates to avoid collisions
  let candidateString = "";
  for (const part of candidateParts) {
    candidateString = candidateString.concat(part);
    candidates.push(candidateString);
  }

  return candidates;
};

const checkCandidatesWithExistingKeys = async (candidates, session) => {
  // retrieve existing data based on the list of candidates
  const existingData = await URL.find(
    {
      key: {
        $in: candidates,
      },
    },
    { key: 1 },
    { session }
  );

  // filter out candidates with existing data
  const existingKeys = existingData.map((data) => data.key);
  return candidates.filter((candidate) => !existingKeys.includes(candidate));
};

const addNewURL = async (url, retryCount = MAX_RETRY_ATTEMPTS) => {
  let attempt = 1;
  while (attempt <= retryCount) {
    const session = await mongoose.startSession();
    const milliseconds = moment().milliseconds();
    try {
      // check if url is existing
      const existingKey = await getExistingKey(url, session);
      if (existingKey) {
        return existingKey;
      }
      // if not existing generate a new one
      let candidatesRemaining = [];
      do {
        const objectId = new mongoose.Types.ObjectId();
        const candidates = generateCandidates(objectId, milliseconds);
        candidatesRemaining = await checkCandidatesWithExistingKeys(
          candidates,
          session
        );
      } while (candidatesRemaining.length === 0);
      // try using the generated candidates
      while (candidatesRemaining.length > 0) {
        try {
          const candidate = candidatesRemaining.shift();
          const result = await URL.create(
            {
              url,
              key: candidate,
            },
            { session }
          );
          await session.commitTransaction();
          session.endSession();
          return result;
        } catch (error) {
          await session.abortTransaction();
          await handleTransactionError(error, url);
        }
      }
      throw new Error("Ran out of candidates");
    } catch (error) {
      handleAttemptError(error, url, attempt, retryCount);
      attempt++;
    } finally {
      session.endSession();
    }
  }
  console.error(`Transaction failed after ${retryCount} attempts.`);
  return null;
};

const handleTransactionError = async (error, url) => {
  if (
    error instanceof mongoose.Error.ValidationError &&
    error.code === ERROR_CODE_DUPLICATE_KEY &&
    error.message.includes(`dup key: { key: "${candidate}" }`)
  ) {
    console.warn("Duplicate key found. Retrying...");
  } else if (
    error instanceof mongoose.Error.ValidationError &&
    error.code === ERROR_CODE_DUPLICATE_KEY &&
    error.message.includes(`dup key: { url: "${url}" }`)
  ) {
    throw error;
  } else {
    if (
      error instanceof mongoose.Error.TransactionRetryError ||
      (error instanceof mongoose.Error.MongoServerError && error.code === 91)
    ) {
      console.warn("Creation failed due to errors. Retrying...");
    } else {
      throw error;
    }
  }
};

const handleAttemptError = (error, url, attempt, retryCount) => {
  if (error.message === "Ran out of candidates") {
    console.warn(
      `Transaction failed (attempt ${attempt}/${retryCount}). Retrying...`
    );
  } else if (
    error instanceof mongoose.Error.ValidationError &&
    error.code === ERROR_CODE_DUPLICATE_KEY &&
    error.message.includes(`dup key: { url: "${url}" }`)
  ) {
    console.warn(`Duplicate URL found (attempt ${attempt}/${retryCount}). Retrying...`);
  } else {
    throw error;
  }
};

const getExistingKey = async (url, session) => {
  const existingKeyObject = await URL.findOne(
    {
      url,
    },
    { key: 1 },
    { session }
  );
  return existingKeyObject.key;
};

module.exports = {
  generateCandidates,
  checkCandidatesWithExistingKeys,
  addNewURL,
  getExistingKey,
  handleAttemptError,
  handleTransactionError
};
