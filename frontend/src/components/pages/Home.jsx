import React, { useState } from "react";
import { Container, Typography, Button, Box, Paper, Grid } from "@mui/material";

export default function Home() {
    const [showAjuda, setShowAjuda] = useState(false);

    const fullName = sessionStorage.getItem("fullName") || "";
    const role = sessionStorage.getItem("role") || "";

    const getRoleLabel = (role) => {
        switch (role) {
            case "admin": return "Administrador";
            case "condutor": return "Condutor";
            case "responsavel": return "Responsável";
            case "common": return "Usuário Comum";
            default: return "";
        }
    };

    const isLogged = !!fullName;

    if (showAjuda) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                        Ajuda (simulação)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Aqui seria o conteúdo de ajuda ou FAQ.<br />
                        (Funcionalidade em desenvolvimento)
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => setShowAjuda(false)}>
                        Voltar à Home
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                    Bem-vindo ao SmartKids
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Plataforma de gestão de viagens escolares.
                </Typography>
                {isLogged && (
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                        Olá, {fullName} ({getRoleLabel(role)})
                    </Typography>
                )}
                <Box sx={{ mb: 3 }}>
                    {!isLogged ? (
                        <>
                            <Button variant="contained" color="primary" sx={{ mr: 2, minWidth: 120 }}>
                                Login
                            </Button>
                            <Button variant="outlined" color="secondary" sx={{ minWidth: 120 }}>
                                Saiba mais
                            </Button>
                        </>
                    ) : (
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" color="primary">
                                    Minhas Viagens
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    Pagamentos
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="secondary">
                                    Perfil
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Box>
                {isLogged && (
                    <Typography variant="body2" color="text.secondary">
                        Último acesso: {/* aqui você pode exibir uma data real se quiser */}
                        {new Date().toLocaleString("pt-BR")}
                    </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                    <Button variant="text" color="secondary" onClick={() => setShowAjuda(true)}>
                        Ajuda
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}