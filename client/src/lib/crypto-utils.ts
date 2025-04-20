// Mock implementation of crypto utility functions for the frontend
// In a production environment, these would use proper libraries with secure randomness

/**
 * Generates a mock BTC wallet with a random-like address and private key
 * @returns {Object} BTC wallet object with private key and address
 */
export function generateBitcoinWallet() {
  // Generate a random-like BTC testnet address (starting with m or n)
  const address = `n${generateRandomHex(33)}`;
  const privateKey = `L${generateRandomHex(51)}`;
  
  return {
    address,
    privateKey,
  };
}

/**
 * Generates a mock ETH wallet with a random-like address and private key
 * @returns {Object} ETH wallet object with private key and address
 */
export function generateEthereumWallet() {
  // Generate a random-like ETH address (starting with 0x)
  const address = `0x${generateRandomHex(40)}`;
  const privateKey = `0x${generateRandomHex(64)}`;
  
  return {
    address,
    privateKey,
  };
}

/**
 * Generates a mock SOL wallet with a random-like address and private key
 * @returns {Object} SOL wallet object with private key and address
 */
export function generateSolanaWallet() {
  // Generate a random-like SOL address
  const address = generateRandomHex(44);
  const privateKey = generateRandomHex(88);
  
  return {
    address,
    privateKey,
  };
}

/**
 * Helper function to generate random hex strings
 * @param {number} length - The length of the hex string to generate
 * @returns {string} A random hex string
 */
function generateRandomHex(length: number): string {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a wallet for the specified cryptocurrency
 * @param {string} crypto - The cryptocurrency to generate a wallet for (btc, eth, sol)
 * @returns {Object} Wallet object with address and private key
 */
export function generateWallet(crypto: string) {
  switch (crypto.toLowerCase()) {
    case 'btc':
      return generateBitcoinWallet();
    case 'eth':
      return generateEthereumWallet();
    case 'sol':
      return generateSolanaWallet();
    default:
      throw new Error(`Unsupported cryptocurrency: ${crypto}`);
  }
}

/**
 * Calculates the daily ROI amount
 * @param {number} amount - The investment amount
 * @param {number} roiPercentage - The daily ROI percentage
 * @returns {number} The daily ROI amount
 */
export function calculateDailyROI(amount: number, roiPercentage: number): number {
  return amount * (roiPercentage / 100);
}

/**
 * Calculates the total ROI amount for the investment duration
 * @param {number} amount - The investment amount
 * @param {number} roiPercentage - The daily ROI percentage
 * @param {number} durationDays - The investment duration in days
 * @returns {number} The total ROI amount
 */
export function calculateTotalROI(amount: number, roiPercentage: number, durationDays: number): number {
  return amount * (roiPercentage / 100) * durationDays;
}

/**
 * Converts a plan duration from weeks to days
 * @param {number} weeks - The duration in weeks
 * @returns {number} The duration in days
 */
export function weeksToDays(weeks: number): number {
  return weeks * 7;
}

/**
 * Validates if an amount meets the minimum investment requirement
 * @param {number} amount - The investment amount
 * @param {number} minAmount - The minimum required amount
 * @returns {boolean} Whether the amount is valid
 */
export function isValidInvestmentAmount(amount: number, minAmount: number): boolean {
  return !isNaN(amount) && amount >= minAmount;
}
