import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import flashcardAPI from "../../config/flashcardAPI";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Box,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CreateCardPack = () => {
  const [packName, setPackName] = useState("");
  const [cards, setCards] = useState([{ question: "", answer: "" }]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
  const navigate = useNavigate();

  const MAX_CARDS = 20;

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCard = () => {
    if (cards.length < MAX_CARDS) {
      setCards([...cards, { question: "", answer: "" }]);
    }
  };

  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!packName.trim()) {
      setAlert({ open: true, message: "Pack name is required!", severity: "error" });
      return;
    }

    if (cards.some((card) => !card.question.trim() || !card.answer.trim())) {
      setAlert({
        open: true,
        message: "All cards must have a question and an answer!",
        severity: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await flashcardAPI.post(
        "/create",
        { name: packName, cards },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlert({
        open: true,
        message: "Card pack created successfully!",
        severity: "primary",
      });
      setTimeout(() => navigate("/cards"), 1500);
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Failed to create card pack!", severity: "error" });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ position:'relative', bottom:'-10px' }}>
        <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
          Create Flashcard Pack
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Card Pack Name"
            variant="outlined"
            value={packName}
            onChange={(e) => setPackName(e.target.value)}
            required
            sx={{
              mb: 3
            }}
          />
          {cards.map((card, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <Tooltip title="Enter the question" arrow>
                    <TextField
                      fullWidth
                      label={`Question ${index + 1}`}
                      variant="outlined"
                      value={card.question}
                      onChange={(e) => handleCardChange(index, "question", e.target.value)}
                      required
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Tooltip title="Enter the answer" arrow>
                    <TextField
                      fullWidth
                      label={`Answer ${index + 1}`}
                      variant="outlined"
                      value={card.answer}
                      onChange={(e) => handleCardChange(index, "answer", e.target.value)}
                      required
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title="Remove this card" arrow>
                    <IconButton
                      color="error"
                      onClick={() => removeCard(index)}
                      aria-label="delete"
                      size="large"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
          ))}
          
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={addCard}
              disabled={cards.length >= MAX_CARDS}
              sx={{ mr: 2 }}
            >
              Add Card
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
            >
              Create Pack
            </Button>
        </form>
        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </Snackbar>
    </Container>
  );
};

export default CreateCardPack;
