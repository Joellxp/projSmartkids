const jwt = require("jsonwebtoken");
const accessSecret = "chave_acesso_super_secreta";

// Middleware que protege rotas autenticadas
function authMiddleware(req, res, next) {
    // Extrai o token do cabeçalho Authorization: Bearer TOKEN
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(403).json({ error: "Token ausente" });
    }
    
    try {
        // Verifica se o token é válido
        const decoded = jwt.verify(token, accessSecret);
        
        // Adiciona os dados decodificados à requisição
        req.user = decoded;
        
        // Continua para a próxima função
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

module.exports = authMiddleware;