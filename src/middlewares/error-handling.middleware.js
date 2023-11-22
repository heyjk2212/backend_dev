export default function (err, req, res, next) {
  console.error(err);

  switch (err.name) {
    case "ValidationError":
      return res.status(400).json({ errorMessage: err.message });
    default:
      return res
        .status(500)
        .json({ errorMessage: "서버 내부 에러가 발생했습니다." });
  }
}