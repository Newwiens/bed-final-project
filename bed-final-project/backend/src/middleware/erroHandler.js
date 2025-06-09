//algemene erro voor index

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Het gaat iets fout!" });
};

export default errorHandler;
