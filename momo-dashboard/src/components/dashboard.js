import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';  // Import other components
import DashboardCard from './DashboardCard';
import TransactionTable from './TransactionTable';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsRes = await axios.get('/api/transactions');
        setTransactions(transactionsRes.data);
        const summaryRes = await axios.get('/api/statistics');
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <DashboardCard title="Total Amount Sent" value={summary.totalSent} />
          <DashboardCard title="Total Transactions" value={summary.transactionCount} />
          <TransactionTable data={transactions} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
