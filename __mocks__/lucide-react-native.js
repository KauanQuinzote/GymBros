// Mock global dos icones: qualquer icone importado vira um componente vazio.
// Evita que o Jest tente transpilar react-native-svg (sintaxe Flow) quando
// um modulo importa a API publica de uma feature que contem componentes.
const Icon = () => null;
module.exports = new Proxy(
  { __esModule: true },
  { get: (target, prop) => (prop in target ? target[prop] : Icon) }
);
