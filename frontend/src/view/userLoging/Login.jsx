import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link, Grid, Card } from "@mui/material";
import API from "../../config/api";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/login", formData);
            localStorage.setItem("token", data.token);
            navigate("/cards");
        } catch (err) {
            console.error(err);
            alert("Invalid credentials");
        }
    };

    return (
        <Grid
            container
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f4f4", // Light gray background
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 4,
                    boxShadow: 3,
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Typography
                        variant="h3"
                        fontWeight={600}
                        component="h1"
                        color="#0A3981"
                        textAlign="center"
                    >
                        Welcome!
                    </Typography>
                    <Typography
                        variant="h6"
                        component="h1"
                        color="#0A3981"
                        textAlign="center"
                    >
                        Please enter your credentials to continue
                    </Typography>
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: "#0A3981",
                        }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2" textAlign="center">
                        Don't have an account?{" "}
                        <Link href="/register" underline="hover" color="primary">
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Grid>
    );
};

export default Login;
