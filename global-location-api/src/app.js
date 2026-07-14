const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const { setupSwagger } = require('../swagger/swagger');
const validateApiKey = require('./middleware/auth.middleware');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

setupSwagger(app);

app.use('/api/v1', validateApiKey, routes);

app.use((req, res, next) => {
  const error = new Error(`API endpoint not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use(errorHandler);

if (require.main === module) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Global Location API Server running on port ${PORT}`);
    console.log(`🔧 Mode: ${config.env}`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`==================================================`);
  });
}

module.exports = app;
