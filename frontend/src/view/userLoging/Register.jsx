import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link, Grid, MenuItem, Card } from "@mui/material";
import API from "../../config/api";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        mobile_number: "",
        grade: "",
        address: "",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (profilePicture) {
            data.append("profile_picture", profilePicture);
        }

        try {
            await API.post("/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("User registered successfully!");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Error registering user");
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
                backgroundColor: "#ffffff", // Light gray background for better contrast
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 500,
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
                        color="#0A3981"
                        textAlign="center"
                    >
                        Create an Account
                    </Typography>
                    <TextField
                        label="Full Name"
                        type="text"
                        name="fullName"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        required
                    />
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
                    <TextField
                        label="Mobile Number"
                        type="text"
                        name="mobile_number"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        select
                        label="Grade"
                        name="grade"
                        value={formData.grade}
                        fullWidth
                        onChange={handleChange}
                    >
                        {["Grade 1", "Grade 2", "University"].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Address"
                        type="text"
                        name="address"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                    <Button variant="contained" component="label">
                        Upload Profile Picture
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                            backgroundColor: "#0A3981",
                            "&:hover": { backgroundColor: "#508D4E" },
                        }}
                    >
                        Register
                    </Button>
                    <Typography variant="body2" textAlign="center">
                        Already have an account?{" "}
                        <Link href="/" underline="hover" color="success.main">
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Grid>
    );
};

export default Register;
