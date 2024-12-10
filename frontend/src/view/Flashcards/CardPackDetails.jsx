import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import flashcardAPI from "../../config/flashcardAPI";

const CardPackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await flashcardAPI.get(`/packs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCards(data.cards || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [id]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: { xs: 350, sm: 400, md: 450 },
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(${-currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
            width: `${cards.length * 100}%`,
          }}
        >
          {cards.map((card, index) => (
            <Box
              key={card.id || index}
              sx={{
                flex: "0 0 100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: currentIndex === index ? 1 : 0.5,
                transition: "opacity 0.5s",
                position: "relative",
              }}
            >
              <Card
                sx={{
                  width: 600,
                  height: 300,
                  borderRadius: 3,
                  backgroundColor: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={() => navigate(`/cards/update/${id}`)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#1976D2",
                    backgroundColor: "#B3C8CF",
                    border: "solid 2px #1976D2",
                    "&:hover": { backgroundColor: "#1976D2" },
                  }}
                >
                  <EditIcon />
                </IconButton>

                {/* Question */}
                <CardContent
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    paddingRight: 2,
                  }}
                >
                  <Typography variant="h5" color="#0D47A1">
                    {card.question}
                  </Typography>
                </CardContent>

                {/* Divider */}
                <Divider
                  orientation="vertical"
                  sx={{
                    backgroundColor: "#0D47A1",
                    width: 2,
                    height: "80%",
                  }}
                />

                {/* Answer */}
                <CardContent
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    paddingLeft: 2,
                  }}
                >
                  <Typography variant="h6" color="#1976D2">
                    {card.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Arrow Buttons */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              color: "#1976D2",
              backgroundColor: "#BBDEFB",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#90CAF9" },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              color: "#1976D2",
              backgroundColor: "#BBDEFB",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#90CAF9" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Dots for Navigation */}
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          {cards.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: currentIndex === index ? "#0D47A1" : "#BBDEFB",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </Box>
        <Typography variant="subtitle1" color="gray" sx={{ mt: 1 }}>
          Card {currentIndex + 1} of {cards.length}
        </Typography>
      </Box>
    </Container>
  );
};

export default CardPackDetails;
