# MTN MoMo SMS Data Processor & Dashboard  

## Overview  
This project automates the extraction, categorization, and visualization of MTN MoMo transaction messages. It enables users to track financial trends, analyze transactions, and gain valuable insights into their financial activities.  

## Key Features  
- **Automated Data Processing** – Extracts and categorizes SMS-based financial transactions.  
- **Comprehensive Transaction Tracking** – Includes deposits, withdrawals, payments, bank transfers, and more.  
- **Interactive Dashboard** – Displays key insights through visual reports, charts, and tables.  
- **Search and Filter Functionality** – Allows users to explore financial data with advanced filtering options.  
- **Transaction Analytics** – Provides summaries, trends, and transaction volume analysis.  

## Dashboard Features  
The web-based dashboard provides an interface for visualizing and interacting with transaction data. It includes:  

- **Dashboard Overview** – Displays total transactions, total amount processed, and active users.  
- **Transaction Trends** – Line graph showing transaction volume over time.  
- **Transaction Types Analysis** – Bar chart displaying the distribution of transaction types.  
- **Recent Transactions Table** – A searchable and sortable table listing the latest transactions with details.  
- **Customizable Timeframes** – Users can view analytics for different time periods such as weekly or monthly.  

## Tech Stack  
| Component  | Technology Used  |  
|------------|-----------------|  
| **Frontend**  | HTML, CSS, JavaScript  |  
| **Backend**  | Python (Flask)  |  
| **Database**  | SQLite  |  
| **Data Source**  | XML File (MTN MoMo SMS Messages)  |  
| **Charts and Graphs**  | Chart.js (for visualizations)  |  

## Implementation Details  

### 1. Data Extraction and Cleaning  
- **XML Parsing** – Converts raw SMS messages into structured data.  
- **Data Categorization** – Classifies transactions into predefined types such as deposits, withdrawals, and payments.  
- **Error Handling and Logging** – Tracks unprocessed or malformed messages for further review.  

### 2. Backend and Database Engineering  
- **Flask-powered API** – Facilitates communication between the frontend and database.  
- **SQLite Relational Database** – Stores structured transaction records efficiently.  
- **Optimized Query Handling** – Enables fast data retrieval and filtering.  

### 3. Interactive Dashboard Development  
- **Built with HTML, CSS, and JavaScript** – Provides a responsive user interface.  
- **Dynamic Charts and Reports** – Visualizes transaction trends and insights.  
- **Search and Filter Functionalities** – Allows users to navigate and analyze transactions efficiently.  

## Setup and Installation  

### Clone the Repository  
```bash
git clone https://github.com/NFORMII/MOMO_app.git
Run the Backend Server
bash
Copy
Edit
cd MOMO_app
python app.py
Launch the Frontend
Open index.html in a web browser.

Lessons Learned
This project involved working with financial data, backend processing, and frontend visualization. The main challenges included:

Designing a scalable and efficient full-stack architecture.
Implementing data cleaning and categorization techniques.
Optimizing database queries for real-time transaction retrieval.

Team Members
David Muotoh-Francis – Frontend Development
Nformi & Josue – Backend and Data Processing
