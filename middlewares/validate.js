const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(el => el.message);

      // Instead of redirecting, you can send JSON or render the form with messages
      // Example 1: JSON response (for API)
      // return res.status(400).json({ errors: messages });

      // Example 2: Render the same form with flash messages (if using EJS)
      req.flash("error", messages.join(". "));
      return next(); // just continue, flash messages will show on next render
    }
    next();
  }
}

module.exports = validate;
