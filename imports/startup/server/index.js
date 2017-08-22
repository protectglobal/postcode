// Import your server-side configs
import './config.js';
import './startup.js';
import './accounts.js';
import './rest-api.js';

// Import all your server-side collections
import '../../api/customers/collection.js';

// Import all your server-side methods
import '../../api/users/methods.js';
import '../../api/users/server/methods.js';
import '../../api/email-system/server/methods.js';

// Import all your publications
import '../../api/users/server/publications.js';
import '../../api/customers/server/publications.js';

// Import all your hooks

// Import cronjobs
// import './cron-jobs/<cron-job-name>.js';
