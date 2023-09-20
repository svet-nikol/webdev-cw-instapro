module.exports = {
  entry: "./index.js", // Входной файл, в котором мы пишем свой код
  output: {
    filename: "index.js", // Выходной файл, который подключаем к HTML, сохранится он по пути "./dist/index.js"
  },
  devtool: "source-map",
};
