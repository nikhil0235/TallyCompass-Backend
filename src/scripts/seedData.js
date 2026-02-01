require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Feature = require('../models/Feature');
const VOC = require('../models/VOC');
const CustomerRequest = require('../models/CustomerRequest');
const Feedback = require('../models/Feedback');

// Helper arrays for random data
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Kiara', 'Myra', 'Prisha', 'Riya', 'Anika', 'Rahul', 'Amit', 'Sneha', 'Deepak', 'Sonia'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bhatia', 'Saxena', 'Patel', 'Singh', 'Kumar', 'Das', 'Rao', 'Nair', 'Iyer', 'Reddy', 'Chowdary', 'Mehta', 'Joshi', 'Agarwal', 'Jain', 'Shah'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Vadodara', 'Ghaziabad', 'Ludhiana'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Gujarat', 'Tamil Nadu', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar', 'Andhra Pradesh', 'Kerala'];
const roles = ['PM', 'Developer', 'QA', 'Designer', 'Sales Manager', 'Branch Manager', 'Partner'];
const msmeCompanyNames = [
    'Shree Ganesh Traders', 'Lakshmi Enterprises', 'Sai Ram Industries', 'Vardhman Textiles', 'Apex Engineering',
    'Sunrise Plastics', 'Om Packaging', 'Jain Agro Foods', 'Saraswati Dairy', 'Navkar Steel',
    'Rajdeep Electronics', 'Mehta Garments', 'Kiran Pharma', 'Sona Auto Parts', 'Ravi Tools',
    'Bhagwati Jewellers', 'Mohan Bakery', 'Elite Printers', 'Naman Handicrafts', 'Siddhi Vinayak Marble',
    'Krishna Ceramics', 'Pioneer Logistics', 'Shivam Construction', 'Anand Furniture', 'Classic Footwear',
    'Green Valley Farms', 'Bright Solar', 'Nexus IT Solutions', 'Blue Star Chemicals', 'Royal Paints',
    'Metro Pipes', 'Everest Polymers', 'Sparsh Cosmetics', 'Vikas Tyres', 'Aarav Packaging',
    'Shubham Electricals', 'Rudra Exports', 'Aayush Foods', 'Sapphire Textiles', 'Zenith Engineering',
    'Madhur Courier', 'Arihant Plastics', 'Sagar Motors', 'Nandini Dairy', 'Sparrow Technologies',
    'Vimal Fabrics', 'Ritika Creations', 'Sankalp Solutions', 'Aakash Electronics', 'Pragati Tools',
    'Tally Authorised Partner', 'Tally Certified Accountant', 'Tally Implementation Services', 'Tally Support Hub', 'Tally Training Center'
];
const productNames = ['TallyPrime', 'TallyEdge', 'TallyServer', 'TallyERP'];
const featureNames = [
    "JSON Export", "Excel Import", "Backup", "WhatsApp", "TallyVault", "Migration", "Repair", "Split", "Banking", "Payroll",
    "Cost Center", "Stripview", "Notification", "GST", "VAT", "BalanceSheet", "Profit Loss", "Taxation", "Inventory",
    "Accounting", "e-Invoice", "Multi Currency", "BOM", "Probable Match", "Reconciliation", "Sync", "TDS", "TCS",
    "Edit Log", "Audit Trail", "e-Payments", "GoTo", "Smart Find", "Dashboard", "Filters", "Restore", "Remote Access",
    "IMS", "Print", "Security", "Performance", "Compliance", "Mobile App", "API Access", "Cloud", "UI/UX",
    "Licensing", "Support", "Analytics", "Collaboration"
];
const designation = ['SDE-1', 'SDE-2', "Senior SDE", "Head of Engineering", "Head of sales", "Managing Director", "Head of PM"]
const tallyBusinessTypes = [
    'Textile Manufacturer', 'Pharma Distributor', 'Retailer', 'Chartered Accountant Firm', 'Logistics Provider',
    'Automobile Dealer', 'Jewellery Store', 'IT Services Company', 'Construction Contractor', 'FMCG Distributor',
    'Electronics Wholesaler', 'Grocery Chain', 'Restaurant Chain', 'Export House', 'E-commerce Seller',
    'Real Estate Agency', 'Consultancy Firm', 'Education Institute', 'Travel Agency', 'Healthcare Clinic',
    'Steel Trader', 'Plastic Manufacturer', 'Chemical Supplier', 'Furniture Showroom', 'Stationery Supplier',
    'Dairy Business', 'Bakery', 'Footwear Retailer', 'Mobile Store', 'Book Publisher',
    'Advertising Agency', 'Event Management', 'NGO', 'Hotel', 'Pharmacy',
    'Courier Service', 'Interior Designer', 'Solar Products Dealer', 'Paint Shop', 'Hardware Store'
];
const tallyPlanTypes = ['Gold', 'Silver', 'Educational', 'Rental', 'Cloud', "TPS"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const seedUsers = async (count = 50) => {
    console.log(`Seeding ${count} Users...`);
    const users = [];
    for (let i = 0; i < count; i++) {
        const fn = getRandom(firstNames);
        const ln = getRandom(lastNames);
        const userData = {
            fullName: `${fn} ${ln}`,
            userName: `${fn.toLowerCase()}${ln.toLowerCase()}${getRandomInt(1, 999)}`,
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
            password: 'password123', // Will be hashed by pre-save hook
            function: getRandom(roles),
            designation: getRandom(designation),
            status: Math.random() > 0.1 ? 'active' : 'inactive',
            location: {
                city: getRandom(cities),
                state: getRandom(states),
                Country: 'India'
            },
            yearOfJoining: getRandomInt(2015, 2025)
        };
        const user = await User.create(userData);
        users.push(user);
        console.log(`Created User ${i + 1}/${count}: ${user.userName}`);
    }
    return users;
};

const seedProducts = async (count = 20) => {
    console.log(`Seeding ${count} Products...`);
    const products = [];
    for (let i = 0; i < count; i++) {
        const productData = {
            productName: `${getRandom(productNames)} ${i}`,
            version: `v${getRandomInt(1, 10)}.${getRandomInt(0, 2)}`,
            releaseDate: getRandomDate(new Date(2020, 0, 1), new Date())
        };
        const product = await Product.create(productData);
        products.push(product);
        console.log(`Created Product ${i + 1}/${count}`);
    }
    return products;
};

const seedFeatures = async (count = 50) => {
    // Ensure we don't request more than available unique names
    const uniqueCount = Math.min(count, featureNames.length);
    console.log(`Seeding ${uniqueCount} Features...`);
    const features = [];

    for (let i = 0; i < uniqueCount; i++) {
        const feature = await Feature.create({ name: featureNames[i] });
        features.push(feature);
        console.log(`Created Feature ${i + 1}/${uniqueCount}: ${feature.name}`);
    }
    return features;
};

const seedCustomers = async (users, features, count = 50) => {
    console.log(`Seeding ${count} Customers...`);
    const customers = [];
    for (let i = 0; i < count; i++) {
        const company = getRandom(msmeCompanyNames);
        const contactFn = getRandom(firstNames);
        const customerData = {
            companyName: `${company}`,
            contactPersonName: `${contactFn} ${getRandom(lastNames)}`,
            email: `contact${i}@${company.toLowerCase().replace(/\s/g, '')}.com`,
            contactNo: `+91-${getRandomInt(7000000000, 9999999999)}`,
            businessType: getRandom(tallyBusinessTypes),
            planType: getRandom(tallyPlanTypes),
            accountStatus: Math.random() > 0.1 ? 'active' : 'inactive',
            customerProficiency: getRandom(['beginner', 'intermediate', 'advanced']),
            location: {
                city: getRandom(cities),
                state: getRandom(states),
                country: 'India',
                isInternational: false
            },
            featureList: [getRandom(features)._id, getRandom(features)._id],
            user: getRandom(users)._id // Linked PM/User
        };
        const customer = await Customer.create(customerData);
        customers.push(customer);
        console.log(`Created Customer ${i + 1}/${count}: ${customer.companyName}`);
    }
    return customers;
};

const seedFeedbacks = async (customers, count = 50) => {
    console.log(`Seeding ${count} Feedbacks...`);
    const feedbacks = [];
    const feedbackTexts = [
        "The GST filing process in TallyPrimary is seamless, but I often face issues when reconciling GSTR-2A data with the portal. A more automated reconciliation feature would save us hours of manual work every month.",
        "I really appreciate the new TallyPrime interface, specifically the GoTo feature which makes navigation so much easier. However, the initial load time has increased significantly compared to ERP9.",
        "E-invoice generation is fantastic and quick, but handling cancellations directly from Tally is sometimes glitchy. We need better error messages when the IRP rejects a payload.",
        "The Banking module is good, but the auto-reconciliation with imported bank statements often misses transactions if the narration format changes slightly. It needs better pattern matching.",
        "Payroll management is decent for small teams, but for our 500+ employee base, the processing speed slows down drastically. We also need more customizable salary slip formats.",
        "Cost Center reporting is very powerful, but I wish we could have more visual dashboards for tracking project-wise expenses instead of just tabular reports.",
        "The Remote Access feature is a lifesaver for our field sales team, but the connectivity drops frequently even with good internet. Stability improvements are much needed.",
        "I love the flexibility of TallyVault for security, but resetting the password is a nightmare if the admin forgets it. A secure recovery mechanism for authorized partners would be great.",
        "Migrating from ERP9 to Prime was mostly smooth, but some of our customized TDLs stopped working and required expensive redevelopment. Better backward compatibility for TDLs is requested.",
        "The Split Company Data tool often throws incomprehensible errors if the data volume is large. We had to struggle for days to split our 5-year data into financial years.",
        "Notification management for statutory due dates is excellent. It really helps us avoid penalties. Would be great if we could receive these notifications on WhatsApp as well.",
        "The VAT handling for our Dubai branch is precise, but handling multi-currency transactions alongside VAT often creates minor rounding off errors in the final balance sheet.",
        "Balance Sheet generation is instantaneous, which is Tally's biggest strength. However, the drill-down performance lag when accessing 2-year old data is noticeable.",
        "Profit & Loss statements are accurate, but I would like to see more comparative graphs and trend analysis built directly into the report view for better management presentations.",
        "Taxation modules are comprehensive, but the frequent statutory updates sometimes mess up existing voucher classes. We need a way to test updates in a sandbox first.",
        "Inventory tracking with Batch Wise details is good, but tracking expiry dates for thousands of SKUs slows down the invoicing screen significantly.",
        "Accounting vouchers are easy to enter, but we need more stringent audit trails that cannot be disabled by the admin to comply with the new MCA guidelines effectively.",
        "Multi-Currency support is vital for our export business. Tally handles the exchange rates well, but revaluation entries at month-end are still a bit manual and prone to errors.",
        "The Bill of Materials (BOM) feature is great for our assembly unit, but handling by-products and scrap tracking is not as intuitive as we would like it to be.",
        "Probable Match in bank reconciliation is a clever feature, but it gives too many false positives. We end up checking manual entries anyway. It needs to learn from user actions.",
        "Data Synchronization between our head office and branch offices is reliable, but conflict resolution when the same voucher is edited at both ends is very confusing.",
        "TDS deduction rules are easy to set up, but handling lower deduction certificates for specific vendors requires too many workarounds in the current master setup.",
        "TCS collection on sale of goods is implemented well, but the reporting for quarterly returns needs more filters to easily segregate between different classes of buyers.",
        "Edit Log is a compliance necessity, but it has bloated our data size by 30% in just six months. We need better optimization or archiving options for the log data.",
        "The new Audit Trail features are robust, but they make the data file heavy. Opening the audit analysis report takes too long during internal audits.",
        "E-payments integration with our bank is smooth, but sometimes the payment advice file generation fails without a clear log, forcing us to redo the batch.",
        "Smart Find is useful, but it still struggles with fuzzy search. If I misspell a ledger name slightly, it returns nothing. It should be more forgiving like Google search.",
        "The Filter feature in reports is improved, but I still can't filter vouchers based on specific narration text efficiently without writing a custom TDL.",
        "Restore functionality is reliable, but there should be an option to restore only specific masters or vouchers from a backup instead of overwriting the whole company data.",
        "IMS (Input Tax Credit) reconciliation is the need of the hour. Tally's current implementation is a good start, but real-time status updates from the portal are often delayed.",
        "Printing invoices is fast, but customizing the print layout to add a dynamic QR code for UPI payments requires technical help. This should be a drag-and-drop feature.",
        "The Dashboard view gives a good overview, but it is not customizable enough. I want to pin specific ratio analysis charts to my home screen for daily tracking.",
        "WhatsApp integration for sending invoices is brilliant and huge time saver. However, we often get blocked if we send too many. Tally should integrate with official WhatsApp APIs better.",
        "Handling 'On Account' payments is easy, but tracking them back to specific invoices after months is difficult if the reference management isn't strictly followed by staff.",
        "The 'Save View' feature for reports is very handy. It saves us time setting up the same filters every day. Please allow sharing these views with other users.",
        "Godown management is effective, but transferring stock between godowns lacks a transit tracking feature, which is critical for our logistics.",
        "Cheque Printing configuration is a bit tedious. We have multiple bank accounts and aligning the printer for each different cheque leaf size is a hassle.",
        "POS invoicing is quick, but it lacks integration with modern touchscreen terminals. We have to use keyboard shortcuts which new staff find hard to learn.",
        "Job Work processing is supported, but tracking material sent vs material received with wastage calculations needs a more simplified report structure.",
        "Interest calculation is accurate, but automatically posting the debit notes for interest is not fully automated and requires manual intervention.",
        "The 'Exchange Data' feature is good, but importing data from Excel still feels archaic. We have to map fields manually every time. A smart mapper is needed.",
        "User security controls are granular, but managing permissions for 50 users individually is painful. We need role-based groups where we can just assign a user to a 'Sales' role.",
        "The 'Exception Reports' are a hidden gem. They help us find negative cash balances and overdue receivables quickly. More such proactive alerts would be welcome.",
        "Budgeting is available but feels disconnected from the actual execution. We want real-time warnings while booking expenses if the budget is exceeded.",
        "Scenario management is useful for forecasting, but comparing multiple scenarios side-by-side in a single report is not currently possible.",
        "Credit Limit controls are strict, which is good, but the manager override authorization workflow is too complex to use in a busy retail counter environment.",
        "The Chart of Accounts view is clean, but bulk editing of ledger groups (moving 100 ledgers to a new group) is tedious and time-consuming.",
        "Stock Ageing analysis is crucial for us. Tally provides it, but we need more flexibility to define custom ageing slabs dynamically for different product categories.",
        "The API access for third-party integration is improving, but documentation is scarce. Integrating Tally with our CRM took weeks of trial and error.",
        "Overall, Tally is the backbone of our business. It's reliable and compliant. If the mobile app experience improves, we wouldn't need any other software."
    ];

    for (let i = 0; i < count; i++) {
        const feedbackData = {
            customerId: getRandom(customers)._id,
            medium: getRandom(['Email', 'Phone']),
            description: getRandom(feedbackTexts),
            rating: getRandomInt(1, 5)
        };
        const feedback = await Feedback.create(feedbackData);
        feedbacks.push(feedback);
        console.log(`Created Feedback ${i + 1}/${count}`);
    }
    return feedbacks;
};

const seedCustomerRequests = async (customers, products, count = 50) => {
    console.log(`Seeding ${count} Customer Requests...`);
    const requests = [];
    const requestTitles = [
        "Enable Dark Mode Support",
        "Add Multi-Currency POS Invoicing",
        "Improve E-Invoice Cancellation Flow",
        "Auto-Fetch GSTR-2B Data",
        "Cloud Sync Status Dashboard",
        "Mobile App Real-time Inventory",
        "Customize GST Invoice Columns",
        "WhatsApp Integration for Reports",
        "Bank Reconciliation AI Match",
        "Payroll Slip Email Automation",
        "Cost Center Hierarchy View",
        "Remote Access Bandwidth Optimization",
        "TallyVault Password Recovery via OTP",
        "Bulk Migrate TDLs to Prime",
        "Split Company Data Wizard Update",
        "Statutory Due Date Calendar",
        "Multi-Currency Balance Sheet Rounding Fix",
        "Drill-down Performance Optimization",
        "Profit & Loss Comparative Graphs",
        "Sandbox Mode for Updates",
        "Batch Expiry Alert System",
        "Audit Trail Log Achival",
        "Forex Revaluation Automation",
        "BOM Scrap Tracking Feature",
        "Smart Bank Reco Improvements",
        "Bi-directional Data Sync Conflict UI",
        "Lower Deduction Certificate Manager",
        "TCS Quarterly Return Filters",
        "Edit Log Size Compression",
        "Audit Analysis Performance",
        "E-payment Advice Log Viewer",
        "Smart Find Fuzzy Search",
        "Advanced Narrative Filters",
        "Granular Restore Options",
        "Real-time ITC Status Check",
        "Drag-and-Drop Print Designer",
        "Dashboard Widget Customization",
        "WhatsApp API Official Integration",
        "On Account Payment Tracking",
        "Share Save View Configurations",
        "Inter-Godown Transit Tracking",
        "Cheque Printer Configurator",
        "Touchscreen POS Interface",
        "Job Work Material Wastage Report",
        "Interest Calculation Debit Note Automator",
        "AI-based Excel Import Mapper",
        "Role-based User Security Groups",
        "Negative Cash Balance Alerts",
        "Real-time Budget Exceeded Warning",
        "Multi-Scenario Comparison Report"
    ];

    const requestDescriptions = [
        "Users working late at night find the current white theme stressful on the eyes. A system-wide Dark Mode that respects OS settings would significantly improve user experience and reduce eye strain for accountants working long hours.",
        "Our retail outlets deal with international tourists, and we need a quick way to generate POS invoices in multiple currencies (USD, EUR, GBP) with real-time exchange rate fetching at the counter.",
        "Currently, cancelling an e-invoice requires logging into the portal separately for verification. We need a seamless flow where cancellation is validated and processed instantly within Tally with a confirmation status update.",
        "Manually downloading GSTR-2B JSON and importing it is tedious. Tally should automatically fetch GSTR-2B data from the GST portal via API and show a variance report against our purchase register.",
        "We manage 20+ branch companies, and currently, there is no single view to check if all of them have synced their data to the head office successfully. A centralized cloud dashboard for sync status is required.",
        "Our warehouse staff needs a mobile app view that shows real-time inventory levels. They shouldn't have to call the accounts team to check stock before confirming an order to a customer.",
        "The standard GST invoice format is good, but we need to add specific columns for HSN summary and batch numbers in the main item grid without customizing TDL. A drag-and-drop column configurator is needed.",
        "Management wants daily sales and cash flow reports delivered automatically to their WhatsApp numbers at 9 PM. We currently do this manually by exporting to PDF and sharing.",
        "Bank reconciliation takes days because we have thousands of transactions. We need an AI-based feature that intelligently matches bank statement narratives with loose fuzzy logic to our ledger entries.",
        "Sending payroll slips to 500 employees one by one is impossible. We need a feature to bulk email password-protected payslips directly from the payroll module with a single click.",
        "The current Cost Center report is flat. We need a hierarchical tree view to see expenses rolled up by Department > Team > Project, allowing easier analysis of budget variance at each level.",
        "Using Tally via remote access on low-bandwidth connections (like 4G mobile hotspots) is very laggy. We need a 'Lite Mode' or better compression to make remote work feasible.",
        "We have situations where the admin forgets the TallyVault password. Since there is no data loss recovery, we need a secure OTP-based recovery mechanism linked to the registered partner's mobile number.",
        "We have heavy legacy TDL customizations. Moving to Prime is blocked because we don't know which TDLs are compatible. A migration tool that scans and auto-fixes common TDL deprecation issues is needed.",
        "The Split functionality often fails with generic memory errors on large data (5GB+). We need a more robust wizard that estimates required space and handles splitting in safer, smaller chunks.",
        "Small businesses often miss compliance deadlines. A built-in calendar dashboard that highlights upcoming GST, TDS, and PF filing dates based on the company's nature of business would be very helpful.",
        "When generating a consolidated Balance Sheet for our overseas branches, the rounding differences in currency conversion often create a mismatch. We need an auto-adjustment voucher feature for this.",
        "Drilling down from the Balance Sheet to the Voucher interface typically takes 5-10 seconds for our dataset. This latency breaks the flow of audit. We need query optimization for faster drill-down.",
        "Top management prefers visual data. The standard P&L is too numeric. We need a toggle to view the P&L as a comparative bar/line graph showing month-on-month trends instantly.",
        "We hesitate to install updates immediately in fear of breaking things. A 'Sandbox Mode' where we can apply the update and test with a copy of data before going live would build confidence.",
        "In our pharma business, selling expired goods is a huge risk. We need a proactive alert system that pops up a warning on the invoicing screen if a selected batch is near expiry.",
        "The new Audit Trail is great but fills up disk space rapidly. We need an archiving solution to move logs older than 2 years to a separate cold storage file to keep the active data light.",
        "Forex gain/loss calculation is currently manual at month end. Tally should automatically fetch rates and post provisional revaluation journal entries for all open forex bills.",
        "Our manufacturing process generates scrap which we sell. The BOM feature needs to better handle scrap generation ratios and automatically capture scrap stock during production entries.",
        "Bank Reconciliation needs to support more bank formats natively. Also, it should remember manual matches (e.g., 'NEFT-123' matches 'Vendor A') and suggest them next time.",
        "When data sync happens, conflicts (e.g., same voucher modified at HO and Branch) are just skipped. We need a UI to see these conflicts side-by-side and choose the winner manually.",
        "We deal with many vendors who have lower TDS deduction certificates. Assigning these rates voucher-by-voucher is prone to error. We need a master manager for valid dates and rates of certificates.",
        "TCS reporting is complex. We need filters to separate '206C(1H)' vs other sections easily in the quarterly return view to verify if we are collecting correctly.",
        "The Edit Log captures every nuance, which is good, but for minor non-financial changes (like narration update), it shouldn't consume so much space. We need compression or selective logging.",
        "The Audit Analysis tool scans all vouchers every time we open it, which takes 20 minutes. It should cache previous results and only scan delta changes for faster performance.",
        "Uploading payment files to the bank is fine, but if the bank rejects one record, we don't know which one. We need a log viewer that parses the bank's response file and highlights the failed transaction.",
        "Smart Find is too rigid. If I search for 'Ravi Tradr', it doesn't show 'Ravi Traders'. We need fuzzy search capabilities similar to search engines to find masters with spelling mistakes.",
        "Filtering vouchers by specific text in the narration is slow and limited. We need regex-support or 'contains' filters that work instantly across millions of vouchers.",
        "Restoring a backup overwrites the entire company. Sometimes we just want to restore a deleted ledger or a set of vouchers from yesterday. Granular restore options are critical.",
        "Before filing GSTR-3B, we want to know the real-time status of our vendors' filings. Tally should query the GSTN open API and flag vendors who haven't filed yet directly in the report.",
        "Customizing invoice prints requires coding. We need a WYSIWYG editor where we can drag logo, rearrange address fields, and add a QR code without technical knowledge.",
        "The Dashboard is static. I want to remove the 'Cash Flow' widget and replace it with a 'Top 5 Receivables' list. Customization of the home screen widgets is a top request.",
        "Third-party tools for WhatsApp are unreliable. Tally should partner with Meta to provide an official, legally compliant integration for sending invoices and reminders directly from the software.",
        "We receive lump-sum payments often. Allocating them to invoices later is hard because the 'On Account' tracking is loose. We need a dedicated workspace to knock off existing on-account entries.",
        "I spend 10 minutes setting up filters for my 'Overdue Receivables > 90 Days' report. I want to save this view configuration and share it with my sales team so they see exactly the same view.",
        "We transfer stock to our godowns in other states. Currently, stock disappears from Source and appears in Destination instantly. We need a 'Goods in Transit' virtual godown created automatically.",
        "We have accounts in 5 different banks. Setting up cheque printing dimensions for each is trial and error. Tally should have a cloud library of standard cheque templates for all Indian banks.",
        "Our POS counters use touchscreens. The current Tally UI is keyboard-centric. We need a touch-friendly POS interface with large buttons for items and payment modes.",
        "Tracking material wastage in Job Work is compliance-heavy. We need a dedicated report that compares 'Standard Wastage' vs 'Actual Wastage' for each job worker to control costs.",
        "We charge interest on overdue bills. Tally calculates it, but we have to manually post Debit Notes. Use a scheduler to automatically generate and email these debit notes on the 1st of every month.",
        "Importing huge Excel files of sales data is painful because column mapping is manual. Use AI to auto-detect headers like 'Inv Date', 'Party Name' and map them to Tally fields.",
        "Security control is by user. We want to create a 'Sales Team' group with specific rights, and just add users to that group. Managing rights for 50 users individually is not scalable.",
        "We operate on thin margins. If a cash payment entry turns the cash balance negative, the system should block the entry immediately with a 'Manager Override' prompt.",
        "Budgeting is passive. We need a 'Budget Exceeded' warning in red color at the moment of voucher entry if the expense ledger crosses the defined monthly budget.",
        "We create Best Case / Worst Case business plans. We need a report that shows Actuals vs Scenario A vs Scenario B in three columns to present to the board. Currently, we do this in Excel."
    ];

    for (let i = 0; i < count; i++) {
        const titleIndex = getRandomInt(0, requestTitles.length - 1);
        const requestData = {
            customterList: [getRandom(customers)._id],
            productId: getRandom(products)._id,
            requestTitle: requestTitles[titleIndex],
            requestType: getRandom(['issue', 'feature']),
            description: requestDescriptions[titleIndex],
            priority: getRandom(['low', 'medium', 'high']),
            action: {
                status: getRandom(['resolved', 'pending', 'review', 'cancelled']),
                description: "Follow up with require stackholders"
            }
        };
        const request = await CustomerRequest.create(requestData);
        requests.push(request);
        console.log(`Created Request ${i + 1}/${count}`);
    }
    return requests;
};

const seedVOCs = async (users, products, customers, count = 50) => {
    console.log(`Seeding ${count} VOCs...`);
    const vocs = [];
    const managementNames = ["Fireside Chat", "Monthly Connect", "Quarterly Review", "Leadership Meet", "Strategy Sync"];
    const eventNames = ["Founders Day", "Mahasabha", "Release Events", "Partner Summit", "Tally Utsav", "Tech Conclave"];

    const vocProjects = [
        { feature: "JSON Export", description: "This project aims to optimize the JSON export engine for high-volume transactions, ensuring compatibility with third-party analytics tools and reducing export time by 50% for large datasets." },
        { feature: "Excel Import", description: "Improving the Excel import utility to support dynamic column mapping using AI, allowing users to import sales and purchase data from any non-standard Excel format without manual reformatting." },
        { feature: "Backup", description: "Developing an automated cloud backup solution that incrementally syncs data to a secure vault every hour, ensuring zero data loss during hardware failures or ransomware attacks." },
        { feature: "WhatsApp", description: "Integrating official WhatsApp API to enable one-click sharing of invoices, ledgers, and outstanding reminders directly from the Tally interface with delivery status tracking." },
        { feature: "TallyVault", description: "Enhancing TallyVault security with a new encryption standard and introducing a secure, partner-assisted password recovery mechanism for verified administrators." },
        { feature: "Migration", description: "Streamlining the migration path from legacy versions to TallyPrime 5.0, focusing on auto-fixing TDL conflicts and preserving user-defined configurations during the upgrade." },
        { feature: "Repair", description: "Revamping the data repair tool to intelligently identify and fix corrupt binary blocks in the database, reducing the need to rewrite the entire company data file." },
        { feature: "Split", description: "Creating a new wizard for splitting company data that handles financial year splits more gracefully, ensuring all carry-forward balances and pending bills are accurate." },
        { feature: "Banking", description: "Introducing API-based banking integration for real-time payment status updates, automating the reconciliation process for NEFT, RTGS, and UPI transactions." },
        { feature: "Payroll", description: "Overhauling the payroll module to support flexible salary structures, automated statutory deductions for new labor codes, and bulk emailing of password-protected payslips." },
        { feature: "Cost Center", description: "Adding a hierarchical view for Cost Centers to allow multi-level budgeting and variance analysis, giving management better visibility into project profitability." },
        { feature: "Stripview", description: "Redesigning the Stripview report interface to allow drag-and-drop column reordering and conditional formatting to highlight critical data points like negative cash flow." },
        { feature: "Notification", description: "Building a central notification hub within Tally to alert users about statutory due dates, license expiries, and critical system errors in real-time." },
        { feature: "GST", description: "Updating the GST module to support the latest e-invoicing schema and adding a reconciliation utility that auto-fetches GSTR-2B data for gap analysis." },
        { feature: "VAT", description: "Enhancing the VAT module for GCC countries to handle complex multi-currency transactions and automated reverse charge mechanism (RCM) calculations." },
        { feature: "BalanceSheet", description: "Optimizing Balance Sheet generation for companies with over 10 years of data, introducing drill-down performance improvements and comparative trend graphs." },
        { feature: "Profit Loss", description: "Adding a vertical analysis mode to the Profit & Loss statement, allowing users to see each expense line item as a percentage of total revenue for better cost control." },
        { feature: "Taxation", description: "Creating a unified taxation dashboard that gives a bird's-eye view of all tax liabilities (GST, TDS, TCS) and their payment statuses for the current financial year." },
        { feature: "Inventory", description: "Implementing a batch-wise inventory tracking system with shelf-life management, triggering alerts for near-expiry stock to reduce wastage in retail and pharma." },
        { feature: "Accounting", description: "Introducing a 'Smart Ledger' creation flow that suggests group classifications and tax settings based on the ledger name using machine learning models." },
        { feature: "e-Invoice", description: "Building a fail-safe mechanism for e-Invoice generation that queues requests during internet outages and auto-retries when connectivity is restored." },
        { feature: "Multi Currency", description: "Automating the month-end forex revaluation process to instantly post journal entries for exchange rate gains/losses across all open foreign currency bills." },
        { feature: "BOM", description: "Enhancing Bill of Materials to support co-products and by-products with separate cost allocations, catering to the complex needs of chemical and process industries." },
        { feature: "Probable Match", description: "Refining the bank reconciliation 'Probable Match' algorithm to learn from user overrides, improving the accuracy of auto-matching bank statement entries over time." },
        { feature: "Reconciliation", description: "Developing a generic reconciliation framework that allows users to reconcile any two datasets, such as GSTR-2A vs Purchase Register or Bank vs Ledger." },
        { feature: "Sync", description: "Improving the data synchronization engine to support bi-directional sync with conflict resolution UI, allowing branches to operate offline and merge data seamlessly." },
        { feature: "TDS", description: "Updating the TDS module to handle lower deduction certificates more effectively, with a tracker for certificate validity and consumption limits." },
        { feature: "TCS", description: "Simplifying TCS on Sale of Goods compliance by adding a unified report to track collection thresholds and filing status for 206C(1H)." },
        { feature: "Edit Log", description: "Optimizing the Edit Log storage to compress historical audit trails, ensuring compliance with MCA guidelines without inflating the company data file size." },
        { feature: "Audit Trail", description: "Creating a tamper-proof audit trail viewer for auditors that highlights high-risk transactions like back-dated entries and altered vouchers." },
        { feature: "e-Payments", description: "Integrating directly with major payment gateways to allow users to generate payment links on invoices and reconcile receipts automatically upon payment." },
        { feature: "GoTo", description: "Expanding the GoTo search capability to include deep indexing of master descriptions and voucher narrations, making it easier to find specific transactions." },
        { feature: "Smart Find", description: "Implementing fuzzy search logic in the Smart Find feature to tolerate spelling mistakes and partial matches when searching for ledgers or items." },
        { feature: "Dashboard", description: "Launching a fully customizable dashboard where users can pin their favorite reports, graphs, and key performance indicators (KPIs) for a personalized home screen." },
        { feature: "Filters", description: "Introducing advanced filtering options with boolean logic (AND/OR) and regex support, empowering users to slice and dice data in Day Book and other reports." },
        { feature: "Restore", description: "Enabling granular data restoration, allowing users to recover specific deleted vouchers or masters from a backup without rolling back the entire database." },
        { feature: "Remote Access", description: "Optimizing the remote access protocol to deliver a faster, desktop-like experience even on low-bandwidth connections for remote accountants." },
        { feature: "IMS", description: "Developing an Input Tax Credit (ITC) Management System that tracks eligibility and usage of ITC across different tax heads to optimize cash flow." },
        { feature: "Print", description: "Adding a WYSIWYG print layout designer that allows users to drag-and-drop fields, add logos, and customize invoice templates without TDL coding." },
        { feature: "Security", description: "Implementing role-based access control (RBAC) groups, allowing admins to assign permissions to 'Sales Team' or 'Auditors' instead of managing individual users." },
        { feature: "Performance", description: "Conducting a comprehensive performance audit to reduce report loading times by 40% for large datasets containing over one million vouchers." },
        { feature: "Compliance", description: " Automating the generation of statutory audit reports (Form 3CD) by mapping ledger groups to tax clauses, saving Chartered Accountants significant time." },
        { feature: "Mobile App", description: "Launching a native mobile companion app that provides real-time access to key business insights, outstanding reports, and stock summaries on iOS and Android." },
        { feature: "API Access", description: "Releasing a comprehensive REST API layer to allow seamless integration with third-party CRMs, e-commerce platforms, and logistics software." },
        { feature: "Cloud", description: "Developing a hybrid cloud architecture that allows users to access their Tally data securely from a browser while keeping the primary database on-premise." },
        { feature: "UI/UX", description: "Modernizing the Tally interface with a fresh design language, dark mode support, and improved accessibility features for visually impaired users." },
        { feature: "Licensing", description: "Simplifying the licensing management portal to allow easier activation, surrender, and renewal of Tally licenses for multi-site organizations." },
        { feature: "Support", description: "Integrating an AI-powered chatbot within the product to answer common support queries and guide users through troubleshooting steps instantly." },
        { feature: "Analytics", description: "Embedding an advanced analytics engine that provides predictive insights on cash flow, inventory requirements, and sales trends based on historical data." },
        { feature: "Collaboration", description: "Adding comment threads and task assignment features within vouchers, enabling better communication and workflow management between accounting teams." }
    ];

    for (let i = 0; i < count; i++) {
        const connectType = getRandom(['VOC', 'Management', 'Event', 'Other']);
        let connectName = "";

        if (connectType === 'Management') {
            connectName = getRandom(managementNames);
        } else if (connectType === 'Event') {
            connectName = getRandom(eventNames);
        }

        const projectData = vocProjects[i % vocProjects.length];

        function randomFutureDate(date) {
            // 2 months = 60 days (approx)
            const min = 1; // at least 1 day after
            const max = 60; // up to 60 days after
            const daysToAdd = Math.floor(Math.random() * (max - min + 1)) + min;
            const result = new Date(date);
            result.setDate(result.getDate() + daysToAdd);
            return result;
        }

        const vocDate = getRandomDate(new Date(2025, 0, 1), new Date(2025, 0, 1))
        const vocData = {
            userID: getRandom(users)._id,
            connectType: connectType,
            connectName: connectName,
            stakeHolders: [getRandom(users)._id],
            vocStartDate: vocDate,
            vocEndDate: randomFutureDate(vocDate),
            projectName: `Project ${projectData.feature}`,
            status: getRandom(['Upcoming', 'Ongoing', 'Completed', 'Cancelled']),
            description: projectData.description,
            customerDetailsObj: {
                customerID: [getRandom(customers)._id],
                status: 'Pending'
            },
            ProductID: getRandom(products)._id
        };
        const voc = await VOC.create(vocData);
        vocs.push(voc);
        console.log(`Created VOC ${i + 1}/${count}: ${voc.projectName}`);
    }
    return vocs;
};

const seed = async () => {
    await connectDB();

    try {
        // Clear existing data? Maybe better to append or option to clear
        // User asked to "generate ... 50 objs", implicitly implies creating fresh or adding.
        // I will clear to avoid duplicates on unique fields (email/username).
        console.log('Clearing existing data...');
        // await Promise.all([
        //     User.deleteMany({}),
        //     Customer.deleteMany({}),
        //     Product.deleteMany({}),
        //     Feature.deleteMany({}),
        //     VOC.deleteMany({}),
        //     CustomerRequest.deleteMany({}),
        //     Feedback.deleteMany({})
        // ]);
        // Commenting out delete logic to be safe, but unique constraints will fail if I run this on existing DB.
        // I'll assume users want generation, if it fails due to unique, they should clear DB.
        // ACTUALLY, "Write a script to generate..." usually implies I should be able to run it. 
        // I'll add a flag or just catch errors. But for "dummy values" it's best to handle unique constraints by randomness.
        // My random generator has collision chance. 
        // I will delete for now to ensure clean seed as is standard for seed scripts.

        await User.deleteMany({});
        await Customer.deleteMany({});
        await Product.deleteMany({});
        await Feature.deleteMany({});
        await VOC.deleteMany({});
        await CustomerRequest.deleteMany({});
        await Feedback.deleteMany({});
        console.log("Data cleared.");

        const users = await seedUsers(50);
        const products = await seedProducts(50);
        const features = await seedFeatures(50);

        // Customers depend on Users and Features
        const customers = await seedCustomers(users, features, 50);

        // Feedbacks depend on Customers
        await seedFeedbacks(customers, 50);

        // Requests depend on Customers and Products
        await seedCustomerRequests(customers, products, 50);

        // VOCs depend on Users, Products, Customers
        await seedVOCs(users, products, customers, 50);

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

seed();
