const TransactionTable = ({ data }) => {
    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4">{transaction.date}</td>
                <td className="px-6 py-4">{transaction.category}</td>
                <td className="px-6 py-4">{transaction.amount}</td>
                <td className="px-6 py-4">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TransactionTable;
  