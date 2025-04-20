import { CronJob } from 'cron';
import { storage } from './storage';
import { calculateDailyROI } from '../client/src/lib/crypto-utils';
import { sendDepositConfirmationEmail } from './email';

/**
 * Setup daily cron jobs
 */
export function setupCronJobs() {
  // Calculate and add daily ROI for all active investments
  // Runs every day at midnight
  const dailyROIJob = new CronJob('0 0 * * *', async () => {
    console.log('[CRON] Running daily ROI calculation job...');
    
    try {
      // Get all users
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        // Get user's active investment
        const activeInvestment = await storage.getUserActiveInvestment(user.id);
        
        if (activeInvestment && activeInvestment.status === 'active') {
          // Calculate daily ROI
          const dailyROIAmount = calculateDailyROI(
            Number(activeInvestment.amount),
            Number(activeInvestment.dailyRoi)
          );
          
          // Check if investment has reached its end date
          const currentDate = new Date();
          const endDate = new Date(activeInvestment.endDate);
          
          if (currentDate >= endDate) {
            // Mark investment as completed
            await storage.updateInvestment(activeInvestment.id, { status: 'completed' });
            console.log(`[CRON] Investment #${activeInvestment.id} for user #${user.id} marked as completed`);
          } else {
            // Create a transaction for the ROI
            await storage.createTransaction({
              userId: user.id,
              type: 'roi',
              amount: dailyROIAmount,
              status: 'completed',
              note: `Daily ROI (${activeInvestment.dailyRoi}%) for ${activeInvestment.planId} plan`
            });
            
            // Update investment's total profit
            await storage.updateInvestment(
              activeInvestment.id,
              { totalProfit: Number(activeInvestment.totalProfit) + dailyROIAmount }
            );
            
            // Update user's balance
            await storage.updateUser(
              user.id,
              { balance: Number(user.balance) + dailyROIAmount }
            );
            
            console.log(
              `[CRON] Added daily ROI of $${dailyROIAmount.toFixed(2)} to user #${user.id} (${user.fullName})`
            );
          }
        }
      }
      
      console.log('[CRON] Daily ROI calculation completed successfully');
    } catch (error) {
      console.error('[CRON] Error in daily ROI calculation job:', error);
    }
  });
  
  // Check for pending deposits and mark as completed
  // In a real system, this would check blockchain confirmations
  // Runs every 10 minutes
  const depositConfirmationJob = new CronJob('*/10 * * * *', async () => {
    console.log('[CRON] Checking pending deposits...');
    
    try {
      // Get all transactions
      const allTransactions = await storage.getAllTransactions();
      
      // Filter for pending deposits
      const pendingDeposits = allTransactions.filter(
        tx => tx.type === 'deposit' && tx.status === 'pending'
      );
      
      if (pendingDeposits.length === 0) {
        console.log('[CRON] No pending deposits found');
        return;
      }
      
      console.log(`[CRON] Found ${pendingDeposits.length} pending deposits`);
      
      for (const deposit of pendingDeposits) {
        // In a real system, check blockchain for confirmation
        // For demo, mark all pending deposits as completed after a delay
        
        // Get deposit creation time
        const creationTime = deposit.createdAt.getTime();
        const currentTime = Date.now();
        const elapsedMinutes = (currentTime - creationTime) / (1000 * 60);
        
        // Mark as completed if it's been more than 5 minutes
        if (elapsedMinutes > 5) {
          // Update transaction status
          await storage.updateTransaction(deposit.id, { status: 'completed' });
          
          // Get user
          const user = await storage.getUser(deposit.userId);
          if (!user) continue;
          
          // Update user balance
          await storage.updateUser(
            user.id,
            { balance: Number(user.balance) + Number(deposit.amount) }
          );
          
          console.log(
            `[CRON] Deposit #${deposit.id} for user #${user.id} (${user.fullName}) confirmed - $${Number(deposit.amount).toFixed(2)}`
          );
          
          // Send confirmation email
          try {
            await sendDepositConfirmationEmail(
              user.email,
              user.fullName,
              Number(deposit.amount),
              'Investment Plan' // Would fetch actual plan name in a real implementation
            );
          } catch (emailError) {
            console.error('[CRON] Error sending deposit confirmation email:', emailError);
          }
        }
      }
      
      console.log('[CRON] Deposit confirmation job completed');
    } catch (error) {
      console.error('[CRON] Error in deposit confirmation job:', error);
    }
  });
  
  // Start the cron jobs
  dailyROIJob.start();
  depositConfirmationJob.start();
  
  console.log('[CRON] Scheduled jobs have been set up');
  
  // Return the jobs in case we need to stop them later
  return {
    dailyROIJob,
    depositConfirmationJob
  };
}
