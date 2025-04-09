module.exports = function (req, res, next) {
  const id = req.params.id;
  if (id != req.user.id) {
    return res.status(400).send({
      message: "Faqat shaxsiy malumotlarni ko'rishga malumot etiladi",
    });
  }
  next();
};
