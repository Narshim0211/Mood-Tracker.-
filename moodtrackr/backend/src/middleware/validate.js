const { ZodError } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    try {
      req.validated = schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: 'ValidationError', details: err.issues });
      }
      next(err);
    }
  };
}

module.exports = { validate };
