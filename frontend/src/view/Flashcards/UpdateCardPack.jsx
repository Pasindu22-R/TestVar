import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Button, Typography, IconButton, Grid, Divider, Paper } from "@mui/material";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import flashcardAPI from "../../config/flashcardAPI";
import Swal from 'sweetalert2';

const UpdateCardPack = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cardPack, setCardPack] = useState({ name: "", cards: [] });
  const [newCard, setNewCard] = useState({ question: "", answer: "" });

  useEffect(() => {
    const fetchCardPackDetails = async () => {
      try {
        const { data } = await flashcardAPI.get(`/packs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCardPack({ name: data.pack.name, cards: data.cards });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Error fetching card pack details',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      } 
    };

    fetchCardPackDetails();
  }, [id]);

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cardPack.cards];
    updatedCards[index][field] = value;
    setCardPack({ ...cardPack, cards: updatedCards });
  };

  const handleNewCardChange = (field, value) => {
    setNewCard({ ...newCard, [field]: value });
  };

  const addNewCard = () => {
    if (newCard.question && newCard.answer) {
      setCardPack({ ...cardPack, cards: [...cardPack.cards, newCard] });
      setNewCard({ question: "", answer: "" });
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Both question and answer are required',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const removeCard = (index) => {
    const updatedCards = cardPack.cards.filter((_, i) => i !== index);
    setCardPack({ ...cardPack, cards: updatedCards });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: cardPack.name,
        cards: cardPack.cards.map(({ question, answer }) => ({ question, answer })), // Filter out unwanted fields
      };

      const response = await flashcardAPI.put(`/packs/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      Swal.fire({
        title: 'Success!',
        text: 'Card pack updated successfully',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate("/cards");
      });
    } catch (err) {
      console.error("Update failed:", err.response || err.message);
      Swal.fire({
        title: 'Error!',
        text: 'Error updating card pack',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <Box sx={{ margin: 'auto', padding: 3, maxWidth: '800px' }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Update Card Pack
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <TextField
          label="Card Pack Name"
          variant="outlined"
          fullWidth
          value={cardPack.name}
          onChange={(e) => setCardPack({ ...cardPack, name: e.target.value })}
          sx={{ mb: 3 }}
          color="primary"
        />

        <Typography variant="h6" gutterBottom color="primary">
          Cards
        </Typography>
        {cardPack.cards.map((card, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  label={`Question ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={card.question}
                  onChange={(e) => handleCardChange(index, "question", e.target.value)}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label={`Answer ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={card.answer}
                  onChange={(e) => handleCardChange(index, "answer", e.target.value)}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} md={2} display="flex" justifyContent="center" alignItems="center">
                <IconButton onClick={() => removeCard(index)} color="error">
                  <DeleteTwoToneIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
          Add New Card
        </Typography>
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                label="New Question"
                variant="outlined"
                fullWidth
                value={newCard.question}
                onChange={(e) => handleNewCardChange("question", e.target.value)}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                label="New Answer"
                variant="outlined"
                fullWidth
                value={newCard.answer}
                onChange={(e) => handleNewCardChange("answer", e.target.value)}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} md={2} display="flex" justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                onClick={addNewCard}
                startIcon={<AddTwoToneIcon />}
                color="primary"
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ width: '200px' }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UpdateCardPack;
