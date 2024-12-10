import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Alert, Grid, Card, CardContent, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit"; // Edit Icon imported
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom"; // For navigation to edit

const FlashcardContainer = styled(Box)(({ theme }) => ({
    perspective: "1000px",
    cursor: "pointer",
    width: 220,
    height: 320,
    margin: theme.spacing(2),
    position: "relative",
}));

const FlashcardInner = styled(Box)(({ flipped }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    textAlign: "center",
    transformStyle: "preserve-3d",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: "transform 0.6s",
}));

const FlashcardSide = styled(Card)(({ isBack }) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backfaceVisibility: "hidden",
    borderRadius: 12,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    backgroundColor: isBack ? "#B3C8CF" : "#0A3981",
    color: isBack ? "#000" : "#fff",
    transform: isBack ? "rotateY(180deg)" : "none",
    padding: "16px",
}));

const IconButtonWrapper = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 2,
    display: "flex",
    gap: "4px", // Space between icons
}));

const PopularFlashcards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found. Please log in again.");
                }

                const response = await axios.get(
                    "http://localhost:8000/api/flashcards/all-cards",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setCards(response.data);
            } catch (err) {
                console.error("Error fetching cards:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Failed to fetch cards.");
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>
                Most Popular Flashcards
            </Typography>
            <Grid container justifyContent="center" spacing={8}>
                {cards.length === 0 ? (
                    <Typography variant="h6" align="center" width="100%">
                        No flashcards found.
                    </Typography>
                ) : (
                    cards.map((pack) => (
                        <Grid item key={pack.id}>
                            <Flashcard
                                id={pack.id}
                                question={pack.question}
                                answer={pack.answer}
                                userName={pack.user_name}
                            />
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

const Flashcard = ({ id, question, answer, userName }) => {
    const [flipped, setFlipped] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const navigate = useNavigate(); // For edit navigation

    const toggleFavorite = () => {
        setFavorited(!favorited);
    };

    const handleEdit = (e) => {
        e.stopPropagation(); // Prevent flipping when clicking edit
        navigate(`/cards/update/${id}`);
    };

    return (
        <FlashcardContainer onClick={() => setFlipped(!flipped)}>
            <IconButtonWrapper>
                <IconButton onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}>
                    {favorited ? (
                        <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: "white" }} />
                    )}
                </IconButton>
                <IconButton onClick={handleEdit}>
                    <EditIcon sx={{ color: "white" }} />
                </IconButton>
            </IconButtonWrapper>

            <FlashcardInner flipped={flipped}>
                <FlashcardSide>
                    <CardContent>
                        <Typography variant="h6">{question}</Typography>
                    </CardContent>
                    <Typography
                        variant="caption"
                        align="center"
                        fontStyle="italic"
                        sx={{ marginBottom: "8px" }}
                    >
                        Created by: {userName}
                    </Typography>
                </FlashcardSide>
                <FlashcardSide isBack>
                    <CardContent>
                        <Typography variant="h6">{answer}</Typography>
                    </CardContent>
                    <Typography
                        variant="caption"
                        align="center"
                        fontStyle="italic"
                        sx={{ marginBottom: "8px" }}
                    >
                        Created by: {userName}
                    </Typography>
                </FlashcardSide>
            </FlashcardInner>
        </FlashcardContainer>
    );
};

export default PopularFlashcards;
